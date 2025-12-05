/**
 * Facial expression detection utilities (optional, requires user permission)
 */

export interface FacialExpression {
  emotion: 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral' | 'confused';
  confidence: number;
  features: {
    smiling: number; // 0-1
    eyebrowsRaised: number; // 0-1
    eyesWide: number; // 0-1
  };
}

/**
 * Facial expression analyzer using webcam
 * Note: This is a simplified implementation. For production, consider using
 * libraries like face-api.js or TensorFlow.js with face detection models
 */
export class FacialAnalyzer {
  private video: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;
  private animationFrame: number | null = null;
  private callback: ((result: FacialExpression) => void) | null = null;

  async start(callback: (result: FacialExpression) => void): Promise<boolean> {
    try {
      // Request camera permission
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });

      this.callback = callback;
      this.video = document.createElement('video');
      this.canvas = document.createElement('canvas');
      
      this.video.srcObject = this.stream;
      this.video.play();

      this.video.addEventListener('loadeddata', () => {
        this.analyze();
      });

      return true;
    } catch (error) {
      console.error('Failed to access camera:', error);
      return false;
    }
  }

  private analyze = () => {
    if (!this.video || !this.canvas || !this.callback) return;

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    ctx.drawImage(this.video, 0, 0);

    // Simplified emotion detection based on image brightness and contrast
    // In production, use a proper ML model like face-api.js
    const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    let brightness = 0;
    let contrast = 0;
    
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      brightness += avg;
      contrast += Math.abs(avg - 128);
    }

    brightness /= (data.length / 4);
    contrast /= (data.length / 4);

    // Simple heuristic (replace with actual ML model)
    let emotion: FacialExpression['emotion'] = 'neutral';
    let smiling = 0;
    let eyebrowsRaised = 0;
    let eyesWide = 0;

    if (brightness > 140 && contrast > 40) {
      emotion = 'happy';
      smiling = 0.7;
    } else if (brightness < 100 && contrast > 50) {
      emotion = 'angry';
      eyebrowsRaised = 0.6;
    } else if (contrast > 60) {
      emotion = 'surprised';
      eyesWide = 0.8;
      eyebrowsRaised = 0.7;
    }

    this.callback({
      emotion,
      confidence: 0.5, // Low confidence for this simple implementation
      features: {
        smiling,
        eyebrowsRaised,
        eyesWide
      }
    });

    this.animationFrame = requestAnimationFrame(this.analyze);
  };

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }
    this.callback = null;
  }
}

/**
 * Check if facial detection is supported
 */
export function isFacialDetectionSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    return false;
  }
}

