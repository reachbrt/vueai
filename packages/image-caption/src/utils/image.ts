// Image processing utilities

import { SUPPORTED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '../types';
import type { ImageProcessingOptions } from '../types';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

export function validateImageFile(file: File): ImageValidationResult {
  const warnings: string[] = [];
  
  // Check file type
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported image type: ${file.type}. Supported types: ${SUPPORTED_IMAGE_TYPES.join(', ')}`
    };
  }

  // Check file size
  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
    };
  }

  // Add warnings for large files
  if (file.size > 5 * 1024 * 1024) { // 5MB
    warnings.push('Large image file may take longer to process');
  }

  // Check dimensions if possible (for some browsers)
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > 2048 || img.height > 2048) {
        warnings.push('Large image dimensions may affect processing speed');
      }
      resolve({ valid: true, warnings });
    };
    img.onerror = () => {
      resolve({ valid: true, warnings }); // Still valid, just couldn't check dimensions
    };
    img.src = URL.createObjectURL(file);
  }) as any; // Type assertion for compatibility
}

export function resizeImageFile(
  file: File, 
  options: ImageProcessingOptions = {}
): Promise<File> {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    format = 'jpeg',
    resize = true
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      let { width, height } = img;
      
      // Calculate new dimensions if resizing is enabled
      if (resize && (width > maxWidth || height > maxHeight)) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: `image/${format}`,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        `image/${format}`,
        quality
      );

      // Clean up
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to convert file to base64'));
    };
    
    reader.readAsDataURL(file);
  });
}

export function convertUrlToBase64(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      
      // Validate blob type
      if (!SUPPORTED_IMAGE_TYPES.includes(blob.type)) {
        throw new Error(`Unsupported image type from URL: ${blob.type}`);
      }
      
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert URL image to base64'));
      reader.readAsDataURL(blob);
      
    } catch (error) {
      reject(error);
    }
  });
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image to get dimensions'));
    };
    
    img.src = URL.createObjectURL(file);
  });
}

export function createImageThumbnail(
  file: File, 
  size: number = 150
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      const { width, height } = img;
      
      // Calculate square thumbnail dimensions
      const minDimension = Math.min(width, height);
      const scale = size / minDimension;
      
      canvas.width = size;
      canvas.height = size;
      
      // Calculate crop area for center crop
      const cropX = (width - minDimension) / 2;
      const cropY = (height - minDimension) / 2;
      
      // Draw cropped and scaled image
      ctx.drawImage(
        img,
        cropX, cropY, minDimension, minDimension,
        0, 0, size, size
      );
      
      // Convert to data URL
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnailDataUrl);
      
      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to create thumbnail'));
    };

    img.src = URL.createObjectURL(file);
  });
}

export function compressImage(
  file: File,
  quality: number = 0.8,
  maxSizeKB?: number
): Promise<File> {
  return new Promise(async (resolve, reject) => {
    try {
      let currentQuality = quality;
      let compressedFile = await resizeImageFile(file, { quality: currentQuality });
      
      // If max size is specified, iteratively reduce quality
      if (maxSizeKB) {
        const maxSizeBytes = maxSizeKB * 1024;
        let iterations = 0;
        const maxIterations = 10;
        
        while (compressedFile.size > maxSizeBytes && currentQuality > 0.1 && iterations < maxIterations) {
          currentQuality -= 0.1;
          compressedFile = await resizeImageFile(file, { quality: currentQuality });
          iterations++;
        }
      }
      
      resolve(compressedFile);
    } catch (error) {
      reject(error);
    }
  });
}

export const imageUtils = {
  validateImageFile,
  resizeImageFile,
  convertToBase64,
  convertUrlToBase64,
  getImageDimensions,
  createImageThumbnail,
  compressImage
};
