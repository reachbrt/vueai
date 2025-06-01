// Image captioning types for @aivue/image-caption

export interface ImageCaptionConfig {
  apiKey?: string;
  model?: string;
  maxLength?: number;
  minLength?: number;
  temperature?: number;
  topK?: number;
  topP?: number;
  repetitionPenalty?: number;
  useCache?: boolean;
  waitForModel?: boolean;
}

export interface ImageCaptionOptions {
  model?: string;
  prompt?: string;
  detail?: 'low' | 'high' | 'auto';
  maxTokens?: number;
  temperature?: number;
}

export interface ImageCaptionResult {
  caption: string;
  confidence?: number;
  model: string;
  processingTime: number;
  timestamp: Date;
}

export interface ImageCaptionError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
  timestamp?: Date;
}

export interface ImageUploadEvent {
  file: File;
  dataUrl: string;
  size: number;
  type: string;
  name: string;
  timestamp?: Date;
}

export interface CaptionHistory {
  id: string;
  image: string; // base64 or URL
  caption: string;
  model: string;
  timestamp: Date;
  processingTime: number;
  confidence?: number;
}

export interface ImageCaptionState {
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  result: ImageCaptionResult | null;
  history: CaptionHistory[];
  currentImage: string | null;
}

export interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
  estimated_time?: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  provider: 'huggingface';
  type: 'image-to-text';
  maxImageSize?: number;
  supportedFormats?: string[];
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  resize?: boolean;
}

export interface CaptionGenerationOptions {
  includeConfidence?: boolean;
  includeAlternatives?: boolean;
  maxAlternatives?: number;
  filterProfanity?: boolean;
  customPrompt?: string;
}

export interface BatchCaptionRequest {
  images: (File | string)[];
  options?: ImageCaptionOptions;
}

export interface BatchCaptionResult {
  results: ImageCaptionResult[];
  errors: Array<{ index: number; error: ImageCaptionError }>;
  totalProcessed: number;
  totalProcessingTime?: number;
  processingTime: number;
  successCount: number;
  errorCount: number;
}

export interface ImageCaptionAnalytics {
  totalCaptions: number;
  averageProcessingTime: number;
  mostUsedModel: string;
  successRate: number;
  errorRate: number;
  topImageTypes: Array<{ type: string; count: number }>;
  dailyUsage: Array<{ date: string; count: number }>;
}

// Available models
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'nlpconnect/vit-gpt2-image-captioning',
    name: 'ViT-GPT2 (Recommended)',
    description: 'Vision Transformer + GPT2 for image captioning - Most reliable',
    provider: 'huggingface',
    type: 'image-to-text',
    maxImageSize: 5 * 1024 * 1024,
    supportedFormats: ['jpeg', 'jpg', 'png']
  },
  {
    id: 'Salesforce/blip-image-captioning-base',
    name: 'BLIP Base',
    description: 'Salesforce BLIP base model for image captioning',
    provider: 'huggingface',
    type: 'image-to-text',
    maxImageSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['jpeg', 'jpg', 'png', 'webp']
  },
  {
    id: 'Salesforce/blip-image-captioning-large',
    name: 'BLIP Large',
    description: 'Salesforce BLIP large model for better accuracy',
    provider: 'huggingface',
    type: 'image-to-text',
    maxImageSize: 10 * 1024 * 1024,
    supportedFormats: ['jpeg', 'jpg', 'png', 'webp']
  },
  {
    id: 'microsoft/git-base-coco',
    name: 'GIT Base',
    description: 'Microsoft GIT model trained on COCO dataset',
    provider: 'huggingface',
    type: 'image-to-text',
    maxImageSize: 8 * 1024 * 1024,
    supportedFormats: ['jpeg', 'jpg', 'png', 'webp']
  }
];

export const DEFAULT_CONFIG: ImageCaptionConfig = {
  model: 'nlpconnect/vit-gpt2-image-captioning',
  maxLength: 50,
  minLength: 5,
  temperature: 1.0,
  topK: 50,
  topP: 0.9,
  repetitionPenalty: 1.0,
  useCache: true,
  waitForModel: true
};

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif'
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_BATCH_SIZE = 10;
