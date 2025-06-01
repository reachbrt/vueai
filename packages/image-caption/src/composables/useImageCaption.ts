import { ref, computed, reactive } from 'vue';
import type {
  ImageCaptionConfig,
  ImageCaptionOptions,
  ImageCaptionResult,
  ImageCaptionError,
  CaptionHistory,
  ImageUploadEvent,
  BatchCaptionRequest,
  BatchCaptionResult
} from '../types';

// Available OpenAI Vision models
export const AVAILABLE_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'Latest and most capable vision model with multimodal understanding',
    provider: 'OpenAI',
    maxTokens: 4096,
    costPer1000Tokens: 0.005
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Faster and more cost-effective vision model',
    provider: 'OpenAI',
    maxTokens: 16384,
    costPer1000Tokens: 0.00015
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'High-intelligence vision model with detailed analysis',
    provider: 'OpenAI',
    maxTokens: 4096,
    costPer1000Tokens: 0.01
  }
];

export interface UseImageCaptionOptions {
  config?: Partial<ImageCaptionConfig>;
  autoCaption?: boolean;
  saveHistory?: boolean;
  maxHistorySize?: number;
}

export interface UseImageCaptionReturn {
  // State
  isLoading: any;
  isProcessing: any;
  error: any;
  result: any;
  history: any;
  currentImage: any;

  // Methods
  generateCaption: (image: File | string, options?: ImageCaptionOptions) => Promise<ImageCaptionResult>;
  generateBatchCaptions: (request: BatchCaptionRequest) => Promise<BatchCaptionResult>;
  uploadImage: (file: File) => Promise<ImageUploadEvent>;
  processImageUrl: (url: string) => Promise<string>;
  clearHistory: () => void;
  clearError: () => void;
  clearResult: () => void;
  setConfig: (config: Partial<ImageCaptionConfig>) => void;
  getModelInfo: (modelId: string) => any;
  exportHistory: (format: 'json' | 'csv') => string;
}

export function useImageCaption(options: UseImageCaptionOptions = {}): UseImageCaptionReturn {
  const {
    config: initialConfig = {},
    autoCaption = false,
    saveHistory = true,
    maxHistorySize = 50
  } = options;

  // Reactive state
  const state = reactive({
    isLoading: false,
    isProcessing: false,
    error: null as string | null,
    result: null as ImageCaptionResult | null,
    history: [] as CaptionHistory[],
    currentImage: null as string | null
  });

  // Configuration with environment variable fallback
  const config = ref<ImageCaptionConfig>({
    apiKey: initialConfig.apiKey || (typeof window !== 'undefined' && (window as any).import?.meta?.env?.VITE_OPENAI_API_KEY) || '',
    model: 'gpt-4o',
    ...initialConfig
  });

  // Computed properties
  const isLoading = computed(() => state.isLoading);
  const isProcessing = computed(() => state.isProcessing);
  const error = computed(() => state.error);
  const result = computed(() => state.result);
  const history = computed(() => state.history);
  const currentImage = computed(() => state.currentImage);

  // Utility functions
  const validateImage = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 20 * 1024 * 1024; // 20MB (OpenAI limit)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return { valid: false, error: `Invalid file type: ${file.type}. Please use JPEG, PNG, WebP, or GIF.` };
    }

    if (file.size > maxSize) {
      return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 20MB.` };
    }

    if (file.size === 0) {
      return { valid: false, error: 'File is empty or corrupted.' };
    }

    return { valid: true };
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const urlToBase64 = async (url: string): Promise<string> => {
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
      throw new Error(`Failed to load image from URL: ${error}`);
    }
  };

  // Main caption generation function
  const generateCaption = async (
    image: File | string,
    options: ImageCaptionOptions = {}
  ): Promise<ImageCaptionResult> => {
    const startTime = Date.now();
    state.isProcessing = true;
    state.error = null;

    try {
      // Validate OpenAI API key format
      if (!config.value.apiKey?.startsWith('sk-')) {
        throw new Error('Please provide a valid OpenAI API key (starts with "sk-")');
      }

      // Convert image to base64
      let imageData: string;
      if (typeof image === 'string') {
        if (image.startsWith('http')) {
          imageData = await urlToBase64(image);
        } else {
          imageData = image;
        }
      } else {
        const validation = validateImage(image);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        imageData = await fileToBase64(image);
        state.currentImage = imageData;
      }

      // Validate base64 format
      if (!imageData.startsWith('data:image/')) {
        throw new Error('Invalid image format. Expected base64 data URL.');
      }

      // Check if the base64 data is reasonable size (not too large for API)
      const base64Size = imageData.length * 0.75; // Approximate decoded size
      if (base64Size > 20 * 1024 * 1024) {
        throw new Error('Image too large after encoding. Please use a smaller image.');
      }

      console.log('🚀 Making API call to OpenAI Vision');
      console.log('🔑 Using OpenAI API key:', config.value.apiKey ? 'Yes (length: ' + config.value.apiKey.length + ')' : 'No');
      console.log('📸 Image data type:', typeof imageData);
      console.log('📸 Image data length:', imageData.length);
      console.log('📸 Image data starts with:', imageData.substring(0, 50) + '...');

      const model = options.model || config.value.model || 'gpt-4o';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.value.apiKey}`,
          'Content-Type': 'application/json',
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
      });

      if (!response.ok) {
        let errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`;

        try {
          const errorData = await response.json();
          console.error('❌ OpenAI API Error Response:', errorData);
          errorMessage = errorData.error?.message || errorMessage;

          // Provide helpful error messages
          if (response.status === 401) {
            errorMessage = 'Invalid OpenAI API key. Please check your API key.';
          } else if (response.status === 403) {
            errorMessage = 'Access denied. Please ensure your API key has the correct permissions.';
          } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
          } else if (response.status === 400) {
            if (errorData.error?.message?.includes('image')) {
              errorMessage = `Image processing error: ${errorData.error.message}`;
            } else {
              errorMessage = `Invalid request: ${errorData.error?.message || 'Please check your image format and size.'}`;
            }
          }
        } catch (e) {
          console.error('Could not parse error response:', e);
        }

        console.error('❌ Final error message:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const caption = data.choices[0]?.message?.content || 'No caption generated';
      console.log('✅ OpenAI Vision API call successful');

      const processingTime = Date.now() - startTime;

      const result: ImageCaptionResult = {
        caption,
        model,
        processingTime,
        timestamp: new Date()
      };

      state.result = result;

      // Save to history
      if (saveHistory) {
        const historyItem: CaptionHistory = {
          id: `caption_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          image: imageData,
          caption,
          model,
          timestamp: new Date(),
          processingTime
        };

        state.history.unshift(historyItem);

        // Limit history size
        if (state.history.length > maxHistorySize) {
          state.history = state.history.slice(0, maxHistorySize);
        }
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      state.error = errorMessage;
      throw error;
    } finally {
      state.isProcessing = false;
    }
  };

  // Batch caption generation
  const generateBatchCaptions = async (request: BatchCaptionRequest): Promise<BatchCaptionResult> => {
    const { images, options = {} } = request;
    const results: ImageCaptionResult[] = [];
    const errors: Array<{ index: number; error: ImageCaptionError }> = [];
    const startTime = Date.now();

    state.isLoading = true;
    state.error = null;

    try {
      for (let i = 0; i < images.length; i++) {
        try {
          const result = await generateCaption(images[i], options);
          results.push(result);
        } catch (error) {
          errors.push({
            index: i,
            error: {
              message: error instanceof Error ? error.message : 'Unknown error',
              code: 'CAPTION_GENERATION_FAILED',
              timestamp: new Date()
            }
          });
        }
      }

      return {
        results,
        errors,
        totalProcessed: images.length,
        successCount: results.length,
        errorCount: errors.length,
        processingTime: Date.now() - startTime
      };

    } finally {
      state.isLoading = false;
    }
  };

  // Upload image handler
  const uploadImage = async (file: File): Promise<ImageUploadEvent> => {
    const validation = validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const dataUrl = await fileToBase64(file);
    state.currentImage = dataUrl;

    const uploadEvent: ImageUploadEvent = {
      file,
      dataUrl,
      size: file.size,
      type: file.type,
      name: file.name,
      timestamp: new Date()
    };

    // Auto-generate caption if enabled
    if (autoCaption) {
      try {
        await generateCaption(file);
      } catch (error) {
        console.warn('Auto-caption failed:', error);
      }
    }

    return uploadEvent;
  };

  // Process image URL
  const processImageUrl = async (url: string): Promise<string> => {
    try {
      const dataUrl = await urlToBase64(url);
      state.currentImage = dataUrl;

      // Auto-generate caption if enabled
      if (autoCaption) {
        try {
          await generateCaption(url);
        } catch (error) {
          console.warn('Auto-caption failed:', error);
        }
      }

      return dataUrl;
    } catch (error) {
      throw new Error(`Failed to process image URL: ${error}`);
    }
  };

  // Utility methods
  const clearHistory = (): void => {
    state.history = [];
  };

  const clearError = (): void => {
    state.error = null;
  };

  const clearResult = (): void => {
    state.result = null;
  };

  const setConfig = (newConfig: Partial<ImageCaptionConfig>): void => {
    config.value = { ...config.value, ...newConfig };
  };

  const getModelInfo = (modelId: string) => {
    return AVAILABLE_MODELS.find(model => model.id === modelId);
  };

  const exportHistory = (format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(state.history, null, 2);
    } else {
      // CSV export
      const headers = ['id', 'caption', 'model', 'timestamp', 'processingTime'];
      const rows = state.history.map(item => [
        item.id,
        `"${item.caption.replace(/"/g, '""')}"`, // Escape quotes
        item.model,
        item.timestamp.toISOString(),
        item.processingTime.toString()
      ]);
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  };

  return {
    // State
    isLoading,
    isProcessing,
    error,
    result,
    history,
    currentImage,

    // Methods
    generateCaption,
    generateBatchCaptions,
    uploadImage,
    processImageUrl,
    clearHistory,
    clearError,
    clearResult,
    setConfig,
    getModelInfo,
    exportHistory
  };
}