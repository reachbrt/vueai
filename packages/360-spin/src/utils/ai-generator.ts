import type { AI360GeneratorConfig, AI360GenerationProgress, AI360GenerationResult } from '../types';

/**
 * AI 360 Generator - Generates 360-degree product views from a single image
 */
export class AI360Generator {
  private config: Required<AI360GeneratorConfig>;
  private onProgress?: (progress: AI360GenerationProgress) => void;

  constructor(config: AI360GeneratorConfig, onProgress?: (progress: AI360GenerationProgress) => void) {
    this.config = {
      provider: config.provider || 'openai',
      apiKey: config.apiKey,
      frameCount: config.frameCount || 36,
      backgroundColor: config.backgroundColor || 'white',
      customBackgroundColor: config.customBackgroundColor || '#ffffff',
      quality: config.quality || 80,
      imageSize: config.imageSize || '1024x1024',
      model: config.model || (config.provider === 'openai' ? 'dall-e-3' : 'stable-diffusion-xl-1024-v1-0'),
      useVisionAnalysis: config.useVisionAnalysis !== false,
      promptTemplate: config.promptTemplate || ''
    };
    this.onProgress = onProgress;
  }

  /**
   * Generate 360-degree frames from a single product image
   */
  async generate(imageFile: File | string): Promise<AI360GenerationResult> {
    const startTime = Date.now();
    const frames: string[] = [];

    try {
      // Step 1: Convert image to base64 if it's a File
      const imageBase64 = typeof imageFile === 'string' 
        ? imageFile 
        : await this.fileToBase64(imageFile);

      this.updateProgress(0, 'Analyzing product image...');

      // Step 2: Analyze the product using GPT-4 Vision (if enabled)
      let productDescription = '';
      if (this.config.useVisionAnalysis && this.config.provider === 'openai') {
        productDescription = await this.analyzeProduct(imageBase64);
      } else {
        productDescription = 'Product image';
      }

      this.updateProgress(10, 'Product analyzed. Generating frames...');

      // Step 3: Generate frames at different angles
      const angleStep = 360 / this.config.frameCount;

      for (let i = 0; i < this.config.frameCount; i++) {
        const angle = Math.round(i * angleStep);
        const progress = 10 + Math.round((i / this.config.frameCount) * 85);
        
        this.updateProgress(progress, `Generating frame ${i + 1}/${this.config.frameCount} (${angle}°)...`, frames);

        const frameUrl = await this.generateFrame(productDescription, angle, i);
        frames.push(frameUrl);
      }

      this.updateProgress(100, 'Generation complete!', frames);

      const generationTime = Date.now() - startTime;

      return {
        frames,
        productDescription,
        metadata: {
          provider: this.config.provider,
          frameCount: this.config.frameCount,
          generationTime,
          model: this.config.model
        }
      };
    } catch (error) {
      console.error('AI 360 Generation error:', error);
      throw error;
    }
  }

  /**
   * Analyze product image using GPT-4 Vision
   */
  private async analyzeProduct(imageBase64: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this product image and provide a detailed description including: product type, color, material, key features, and style. Be concise but specific. This will be used to generate 360-degree views.'
              },
              {
                type: 'image_url',
                image_url: { url: imageBase64 }
              }
            ]
          }
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Product';
  }

  /**
   * Generate a single frame at a specific angle
   */
  private async generateFrame(productDescription: string, angle: number, frameIndex: number): Promise<string> {
    if (this.config.provider === 'openai') {
      return this.generateFrameOpenAI(productDescription, angle, frameIndex);
    } else {
      return this.generateFrameStability(productDescription, angle, frameIndex);
    }
  }

  /**
   * Generate frame using OpenAI DALL-E
   */
  private async generateFrameOpenAI(productDescription: string, angle: number, _frameIndex: number): Promise<string> {
    const backgroundColor = this.getBackgroundColorValue();
    
    const prompt = this.config.promptTemplate || 
      `Create a high-quality product photograph of: ${productDescription}
View angle: ${angle} degrees rotation (0° is front view, rotating clockwise around vertical axis)
Background: ${backgroundColor}
Style: Professional product photography, studio lighting, high detail, sharp focus, centered composition
The product should be clearly visible and well-lit from this ${angle}° angle.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        prompt: prompt.substring(0, 4000), // DALL-E has prompt limits
        n: 1,
        size: this.config.imageSize,
        quality: 'hd',
        style: 'natural'
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from OpenAI');
    }

    // Convert to base64 for local storage
    return this.urlToBase64(imageUrl);
  }

  /**
   * Generate frame using Stability AI
   */
  private async generateFrameStability(productDescription: string, angle: number, _frameIndex: number): Promise<string> {
    const backgroundColor = this.getBackgroundColorValue();

    const prompt = this.config.promptTemplate ||
      `Professional product photograph of ${productDescription}, viewed from ${angle} degrees angle, ${backgroundColor} background, studio lighting, high quality, detailed, centered`;

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30
      })
    });

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.statusText}`);
    }

    const data = await response.json();
    const base64Image = data.artifacts[0]?.base64;

    if (!base64Image) {
      throw new Error('No image returned from Stability AI');
    }

    return `data:image/png;base64,${base64Image}`;
  }

  /**
   * Get background color value based on config
   */
  private getBackgroundColorValue(): string {
    switch (this.config.backgroundColor) {
      case 'white':
        return 'pure white';
      case 'transparent':
        return 'transparent/alpha channel';
      case 'black':
        return 'pure black';
      case 'custom':
        return this.config.customBackgroundColor;
      default:
        return 'white';
    }
  }

  /**
   * Convert File to base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert URL to base64
   */
  private async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting URL to base64:', error);
      return url; // Return original URL if conversion fails
    }
  }

  /**
   * Update progress callback
   */
  private updateProgress(percentage: number, status: string, generatedFrames: string[] = []): void {
    if (this.onProgress) {
      this.onProgress({
        currentFrame: generatedFrames.length,
        totalFrames: this.config.frameCount,
        percentage,
        status,
        generatedFrames
      });
    }
  }
}
