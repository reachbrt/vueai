/**
 * Voice tone analysis utilities
 */

export interface VoiceAnalysisResult {
  pitch: number; // 0-1 (low to high)
  speed: number; // 0-1 (slow to fast)
  energy: number; // 0-1 (calm to energetic)
  emotion: 'calm' | 'excited' | 'stressed' | 'neutral';
  confidence: number;
}

/**
 * Analyze voice tone from audio stream
 */
export async function analyzeVoiceTone(audioStream: MediaStream): Promise<VoiceAnalysisResult> {
  return new Promise((resolve) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(audioStream);
    
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    microphone.connect(analyser);

    // Analyze for 1 second
    setTimeout(() => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate pitch (frequency distribution)
      let pitchSum = 0;
      let pitchCount = 0;
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > 0) {
          pitchSum += i * dataArray[i];
          pitchCount += dataArray[i];
        }
      }
      const pitch = pitchCount > 0 ? (pitchSum / pitchCount) / bufferLength : 0.5;

      // Calculate energy (volume)
      const energy = dataArray.reduce((sum, val) => sum + val, 0) / (bufferLength * 255);

      // Estimate speed (variation in frequency)
      let variation = 0;
      for (let i = 1; i < bufferLength; i++) {
        variation += Math.abs(dataArray[i] - dataArray[i - 1]);
      }
      const speed = Math.min(variation / (bufferLength * 100), 1);

      // Determine emotion
      let emotion: VoiceAnalysisResult['emotion'] = 'neutral';
      if (energy > 0.7 && speed > 0.6) {
        emotion = 'excited';
      } else if (energy > 0.6 && pitch > 0.6) {
        emotion = 'stressed';
      } else if (energy < 0.3 && speed < 0.4) {
        emotion = 'calm';
      }

      audioContext.close();

      resolve({
        pitch,
        speed,
        energy,
        emotion,
        confidence: 0.7
      });
    }, 1000);
  });
}

/**
 * Start continuous voice monitoring
 */
export class VoiceMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private animationFrame: number | null = null;
  private callback: ((result: VoiceAnalysisResult) => void) | null = null;

  async start(stream: MediaStream, callback: (result: VoiceAnalysisResult) => void) {
    this.callback = callback;
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.microphone = this.audioContext.createMediaStreamSource(stream);
    
    this.analyser.fftSize = 2048;
    this.microphone.connect(this.analyser);

    this.analyze();
  }

  private analyze = () => {
    if (!this.analyser || !this.callback) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Calculate metrics (same as analyzeVoiceTone)
    let pitchSum = 0;
    let pitchCount = 0;
    for (let i = 0; i < bufferLength; i++) {
      if (dataArray[i] > 0) {
        pitchSum += i * dataArray[i];
        pitchCount += dataArray[i];
      }
    }
    const pitch = pitchCount > 0 ? (pitchSum / pitchCount) / bufferLength : 0.5;

    const energy = dataArray.reduce((sum, val) => sum + val, 0) / (bufferLength * 255);

    let variation = 0;
    for (let i = 1; i < bufferLength; i++) {
      variation += Math.abs(dataArray[i] - dataArray[i - 1]);
    }
    const speed = Math.min(variation / (bufferLength * 100), 1);

    let emotion: VoiceAnalysisResult['emotion'] = 'neutral';
    if (energy > 0.7 && speed > 0.6) {
      emotion = 'excited';
    } else if (energy > 0.6 && pitch > 0.6) {
      emotion = 'stressed';
    } else if (energy < 0.3 && speed < 0.4) {
      emotion = 'calm';
    }

    this.callback({
      pitch,
      speed,
      energy,
      emotion,
      confidence: 0.7
    });

    this.animationFrame = requestAnimationFrame(this.analyze);
  };

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    this.callback = null;
  }
}

