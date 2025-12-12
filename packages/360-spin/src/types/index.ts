/**
 * Animation mode for 360-degree spin
 */
export type SpinMode = 'gif' | 'frames' | 'auto';

/**
 * Trigger type for starting the spin animation
 */
export type SpinTrigger = 'hover' | 'click' | 'auto';

/**
 * Direction of the spin animation
 */
export type SpinDirection = 'clockwise' | 'counterclockwise';

/**
 * Configuration options for 360-degree spin
 */
export interface Spin360Config {
  /**
   * Static image URL (shown by default)
   */
  staticImage: string;

  /**
   * Animated image URL (GIF) or array of frame URLs
   */
  animatedImage: string | string[];

  /**
   * Animation mode
   * @default 'auto' - automatically detects based on animatedImage type
   */
  mode?: SpinMode;

  /**
   * Trigger for starting animation
   * @default 'hover'
   */
  trigger?: SpinTrigger;

  /**
   * Width of the image container
   * @default '100%'
   */
  width?: string | number;

  /**
   * Height of the image container
   * @default 'auto'
   */
  height?: string | number;

  /**
   * Alt text for the image
   */
  alt?: string;

  /**
   * Frame rate for frame sequence animation (frames per second)
   * @default 30
   */
  frameRate?: number;

  /**
   * Whether to loop the animation
   * @default true
   */
  loop?: boolean;

  /**
   * Whether to reverse the animation on second hover
   * @default false
   */
  reverseOnSecondHover?: boolean;

  /**
   * Spin direction
   * @default 'clockwise'
   */
  direction?: SpinDirection;

  /**
   * Whether to preload animated images
   * @default true
   */
  preload?: boolean;

  /**
   * Loading placeholder image
   */
  loadingImage?: string;

  /**
   * CSS class for the container
   */
  containerClass?: string;

  /**
   * CSS class for the image
   */
  imageClass?: string;

  /**
   * Whether to show loading indicator
   * @default true
   */
  showLoading?: boolean;

  /**
   * Custom loading text
   * @default 'Loading...'
   */
  loadingText?: string;

  /**
   * Whether to enable touch/drag to spin on mobile
   * @default true
   */
  enableDragSpin?: boolean;

  /**
   * Sensitivity for drag spin (pixels per frame)
   * @default 10
   */
  dragSensitivity?: number;
}

/**
 * Events emitted by the 360-spin component
 */
export interface Spin360Events {
  /**
   * Emitted when animation starts
   */
  'animation-start': void;

  /**
   * Emitted when animation ends
   */
  'animation-end': void;

  /**
   * Emitted when images are loaded
   */
  'loaded': void;

  /**
   * Emitted when loading fails
   */
  'error': Error;

  /**
   * Emitted when current frame changes (for frame sequence mode)
   */
  'frame-change': number;
}

/**
 * AI Provider for 360 generation
 */
export type AIProvider = 'openai' | 'stability';

/**
 * Background color options for AI generation
 */
export type BackgroundColor = 'white' | 'transparent' | 'black' | 'custom';

/**
 * Configuration for AI 360 generation
 */
export interface AI360GeneratorConfig {
  /**
   * AI provider to use
   * @default 'openai'
   */
  provider?: AIProvider;

  /**
   * API key for the AI provider
   */
  apiKey: string;

  /**
   * Number of frames to generate
   * @default 36
   */
  frameCount?: number;

  /**
   * Background color for generated images
   * @default 'white'
   */
  backgroundColor?: BackgroundColor;

  /**
   * Custom background color (hex or rgb)
   * Only used when backgroundColor is 'custom'
   */
  customBackgroundColor?: string;

  /**
   * Image quality (0-100)
   * @default 80
   */
  quality?: number;

  /**
   * Image size for generation
   * @default '1024x1024'
   */
  imageSize?: '1024x1024' | '1024x1792' | '1792x1024';

  /**
   * Model to use for generation
   * OpenAI: 'dall-e-3' | 'dall-e-2'
   * Stability: 'stable-diffusion-xl-1024-v1-0'
   */
  model?: string;

  /**
   * Whether to use GPT-4 Vision for product analysis
   * @default true
   */
  useVisionAnalysis?: boolean;

  /**
   * Custom prompt template
   */
  promptTemplate?: string;
}

/**
 * Progress information for AI generation
 */
export interface AI360GenerationProgress {
  /**
   * Current frame being generated (0-based)
   */
  currentFrame: number;

  /**
   * Total frames to generate
   */
  totalFrames: number;

  /**
   * Progress percentage (0-100)
   */
  percentage: number;

  /**
   * Current status message
   */
  status: string;

  /**
   * Generated frames so far
   */
  generatedFrames: string[];
}

/**
 * Result of AI 360 generation
 */
export interface AI360GenerationResult {
  /**
   * Array of generated frame URLs (base64 or URLs)
   */
  frames: string[];

  /**
   * Product description from AI analysis
   */
  productDescription?: string;

  /**
   * Generation metadata
   */
  metadata: {
    provider: AIProvider;
    frameCount: number;
    generationTime: number;
    model: string;
  };
}

