/**
 * Interaction pattern analysis utilities
 */

export interface TypingPattern {
  speed: number; // words per minute
  corrections: number; // backspace count
  pauses: number; // long pauses count
  emotion: 'focused' | 'frustrated' | 'hesitant' | 'confident';
}

export interface ClickPattern {
  rageClicks: number; // rapid repeated clicks
  hesitation: number; // hover without click count
  precision: number; // 0-1, accuracy of clicks
  emotion: 'frustrated' | 'uncertain' | 'confident';
}

/**
 * Typing pattern analyzer
 */
export class TypingAnalyzer {
  private keystrokes: number[] = [];
  private backspaces = 0;
  private pauses = 0;
  private lastKeystroke = 0;
  private startTime = 0;

  start() {
    this.keystrokes = [];
    this.backspaces = 0;
    this.pauses = 0;
    this.startTime = Date.now();
  }

  recordKeystroke(isBackspace = false) {
    const now = Date.now();
    
    if (isBackspace) {
      this.backspaces++;
    }

    // Detect pauses (>2 seconds between keystrokes)
    if (this.lastKeystroke > 0 && now - this.lastKeystroke > 2000) {
      this.pauses++;
    }

    this.keystrokes.push(now);
    this.lastKeystroke = now;
  }

  getPattern(): TypingPattern {
    const duration = (Date.now() - this.startTime) / 1000 / 60; // minutes
    const speed = duration > 0 ? this.keystrokes.length / duration : 0;

    let emotion: TypingPattern['emotion'] = 'focused';
    
    if (this.backspaces > this.keystrokes.length * 0.3) {
      emotion = 'frustrated';
    } else if (this.pauses > 5) {
      emotion = 'hesitant';
    } else if (speed > 60 && this.backspaces < this.keystrokes.length * 0.1) {
      emotion = 'confident';
    }

    return {
      speed,
      corrections: this.backspaces,
      pauses: this.pauses,
      emotion
    };
  }

  reset() {
    this.start();
  }
}

/**
 * Click pattern analyzer
 */
export class ClickAnalyzer {
  private clicks: Array<{ x: number; y: number; time: number }> = [];
  private hovers: number = 0;
  private lastHoverStart = 0;

  recordClick(x: number, y: number) {
    const now = Date.now();
    this.clicks.push({ x, y, time: now });

    // Remove old clicks (older than 5 seconds)
    this.clicks = this.clicks.filter(click => now - click.time < 5000);
  }

  recordHoverStart() {
    this.lastHoverStart = Date.now();
  }

  recordHoverEnd() {
    if (this.lastHoverStart > 0) {
      const duration = Date.now() - this.lastHoverStart;
      if (duration > 1000) {
        this.hovers++;
      }
      this.lastHoverStart = 0;
    }
  }

  getPattern(): ClickPattern {
    // Detect rage clicks (3+ clicks in same area within 1 second)
    let rageClicks = 0;
    for (let i = 0; i < this.clicks.length - 2; i++) {
      const click1 = this.clicks[i];
      const click2 = this.clicks[i + 1];
      const click3 = this.clicks[i + 2];

      const timeDiff = click3.time - click1.time;
      const distance1 = Math.sqrt(Math.pow(click2.x - click1.x, 2) + Math.pow(click2.y - click1.y, 2));
      const distance2 = Math.sqrt(Math.pow(click3.x - click2.x, 2) + Math.pow(click3.y - click2.y, 2));

      if (timeDiff < 1000 && distance1 < 50 && distance2 < 50) {
        rageClicks++;
      }
    }

    // Calculate precision (how close clicks are to each other)
    let totalDistance = 0;
    for (let i = 1; i < this.clicks.length; i++) {
      const distance = Math.sqrt(
        Math.pow(this.clicks[i].x - this.clicks[i - 1].x, 2) +
        Math.pow(this.clicks[i].y - this.clicks[i - 1].y, 2)
      );
      totalDistance += distance;
    }
    const avgDistance = this.clicks.length > 1 ? totalDistance / (this.clicks.length - 1) : 0;
    const precision = Math.max(0, 1 - avgDistance / 500);

    let emotion: ClickPattern['emotion'] = 'confident';
    if (rageClicks > 0) {
      emotion = 'frustrated';
    } else if (this.hovers > 3) {
      emotion = 'uncertain';
    }

    return {
      rageClicks,
      hesitation: this.hovers,
      precision,
      emotion
    };
  }

  reset() {
    this.clicks = [];
    this.hovers = 0;
  }
}

