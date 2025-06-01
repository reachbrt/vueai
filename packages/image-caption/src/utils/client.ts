// Image caption client utilities

import type { ImageCaptionConfig, ImageCaptionOptions, ImageCaptionResult, HuggingFaceResponse } from '../types';
import { DEFAULT_CONFIG } from '../types';

export class ImageCaptionClient {
  private config: ImageCaptionConfig;

  constructor(config: Partial<ImageCaptionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async generateCaption(
    imageData: string | Uint8Array,
    options: ImageCaptionOptions = {}
  ): Promise<ImageCaptionResult> {
    const startTime = Date.now();

    if (!this.config.apiKey) {
      throw new Error('Hugging Face API key is required');
    }

    const model = options.model || this.config.model || 'gpt-4o';

    // Try multiple models as fallback
    const modelsToTry = [
      model,
      'nlpconnect/vit-gpt2-image-captioning',
      'Salesforce/blip-image-captioning-base'
    ].filter((m, i, arr) => arr.indexOf(m) === i); // Remove duplicates

    let lastError: Error | null = null;

    for (const currentModel of modelsToTry) {
      try {
        console.log('Trying model:', currentModel);
        const result = await this.tryGenerateCaption(imageData, currentModel, options, startTime);
        return result;
      } catch (error) {
        console.warn(`Model ${currentModel} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw lastError || new Error('All models failed to generate caption');
  }

  private async tryGenerateCaption(
    imageData: string | Uint8Array,
    model: string,
    options: ImageCaptionOptions,
    startTime: number
  ): Promise<ImageCaptionResult> {
    let apiUrl = 'https://api.openai.com/v1/chat/completions';

    // Verify the model name is properly encoded
    console.log('Using model:', model);
    console.log('Full API URL:', apiUrl);

    // Prepare image data
    let imageBytes: Uint8Array;
    if (typeof imageData === 'string') {
      // Convert base64 to bytes
      const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
      const binaryString = atob(base64Data);
      imageBytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        imageBytes[i] = binaryString.charCodeAt(i);
      }
    } else {
      imageBytes = imageData;
    }

    // For OpenAI Vision API, we send JSON with image data
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: options.prompt || 'Describe this image in detail. Focus on the main subjects, actions, and setting.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData,
                  detail: options.detail || 'auto'
                }
              }
            ]
          }
        ],
        max_tokens: options.maxTokens || 300,
        temperature: options.temperature || 0.7
      })
    };



    try {
      console.log('Making request to:', apiUrl);
      console.log('Request headers:', requestOptions.headers);
      console.log('Image data type:', typeof imageData);

      const response = await fetch(apiUrl, requestOptions);

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = `API request failed: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          console.log('Error response:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse the error response, use the status text
          console.log('Could not parse error response');
        }

        // If it's a 404 or CORS error, provide helpful message
        if (response.status === 404) {
          errorMessage = `Model "${model}" not found or not accessible. This may be due to CORS restrictions in the browser. For production use, implement a backend proxy.`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API response:', data);

      if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error('Invalid response from OpenAI API');
      }

      const caption = data.choices[0]?.message?.content || 'No caption generated';
      const processingTime = Date.now() - startTime;

      return {
        caption,
        model,
        processingTime,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Caption generation error:', error);
      throw new Error(`Caption generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  updateConfig(newConfig: Partial<ImageCaptionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): ImageCaptionConfig {
    return { ...this.config };
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.config.apiKey) {
        return false;
      }

      // Basic format validation - OpenAI tokens start with 'sk-' and are longer
      if (!this.config.apiKey.startsWith('sk-') || this.config.apiKey.length < 40) {
        return false;
      }

      // For browser environments, we can't easily test the API key due to CORS
      // The real validation will happen when making actual inference requests
      // This is a basic format check to catch obvious errors
      return true;
    } catch (error) {
      console.warn('Connection test failed:', error);
      return false;
    }
  }
}

export function createImageCaptionClient(config: Partial<ImageCaptionConfig> = {}): ImageCaptionClient {
  return new ImageCaptionClient(config);
}

export default ImageCaptionClient;
