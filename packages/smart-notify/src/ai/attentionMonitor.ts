import type { UserAttention, UserAttentionState, Notification, AttentionMonitor as IAttentionMonitor } from '../types';

export class AttentionMonitor implements IAttentionMonitor {
  private state: UserAttention;
  private checkInterval: number = 1000; // 1 second
  private idleThreshold: number = 60000; // 1 minute
  private intervalId?: number;
  private lastMouseMove: number = Date.now();
  private lastKeyPress: number = Date.now();
  private isTyping: boolean = false;
  private typingTimeout?: number;

  constructor(idleThreshold?: number) {
    if (idleThreshold) {
      this.idleThreshold = idleThreshold;
    }

    this.state = {
      state: 'active',
      lastActivity: Date.now(),
      idleTime: 0,
      isPageVisible: true,
      isUserTyping: false,
      mouseActivity: false,
      doNotDisturb: false
    };
  }

  getCurrentState(): UserAttention {
    return { ...this.state };
  }

  shouldDelay(notification: Notification, attention: UserAttention): boolean {
    // Never delay critical notifications
    if (notification.priority === 'critical') {
      return false;
    }

    // Delay if in do-not-disturb mode
    if (attention.doNotDisturb) {
      return true;
    }

    // Delay if user is typing
    if (attention.isUserTyping) {
      return true;
    }

    // Delay if user is focused and notification is low priority
    if (attention.state === 'focused' && notification.priority === 'low') {
      return true;
    }

    // Delay if page is not visible
    if (!attention.isPageVisible) {
      return true;
    }

    // Delay if user is away
    if (attention.state === 'away') {
      return true;
    }

    return false;
  }

  startMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Set up event listeners
    this.setupEventListeners();

    // Start periodic state updates
    this.intervalId = window.setInterval(() => {
      this.updateState();
    }, this.checkInterval);
  }

  stopMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Remove event listeners
    this.removeEventListeners();

    // Clear interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  setDoNotDisturb(enabled: boolean, until?: number): void {
    this.state.doNotDisturb = enabled;
    this.state.doNotDisturbUntil = until;
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Mouse movement
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mousedown', this.handleMouseMove);
    window.addEventListener('wheel', this.handleMouseMove);

    // Keyboard activity
    window.addEventListener('keydown', this.handleKeyPress);
    window.addEventListener('keyup', this.handleKeyUp);

    // Page visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    // Focus/blur
    window.addEventListener('focus', this.handleFocus);
    window.addEventListener('blur', this.handleBlur);
  }

  private removeEventListeners(): void {
    if (typeof window === 'undefined') return;

    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mousedown', this.handleMouseMove);
    window.removeEventListener('wheel', this.handleMouseMove);
    window.removeEventListener('keydown', this.handleKeyPress);
    window.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleFocus);
    window.removeEventListener('blur', this.handleBlur);
  }

  private handleMouseMove = (): void => {
    this.lastMouseMove = Date.now();
    this.state.lastActivity = Date.now();
    this.state.mouseActivity = true;
  };

  private handleKeyPress = (): void => {
    this.lastKeyPress = Date.now();
    this.state.lastActivity = Date.now();
    this.isTyping = true;
    this.state.isUserTyping = true;

    // Clear existing timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set timeout to detect when user stops typing
    this.typingTimeout = window.setTimeout(() => {
      this.isTyping = false;
      this.state.isUserTyping = false;
    }, 1000);
  };

  private handleKeyUp = (): void => {
    this.state.lastActivity = Date.now();
  };

  private handleVisibilityChange = (): void => {
    this.state.isPageVisible = !document.hidden;
    if (!document.hidden) {
      this.state.lastActivity = Date.now();
    }
  };

  private handleFocus = (): void => {
    this.state.lastActivity = Date.now();
    this.updateAttentionState();
  };

  private handleBlur = (): void => {
    this.updateAttentionState();
  };

  private updateState(): void {
    const now = Date.now();
    const timeSinceActivity = now - this.state.lastActivity;

    this.state.idleTime = timeSinceActivity;

    // Update attention state
    this.updateAttentionState();

    // Reset mouse activity flag
    this.state.mouseActivity = false;
  }

  private updateAttentionState(): void {
    const now = Date.now();
    const timeSinceActivity = now - this.state.lastActivity;

    let newState: UserAttentionState;

    if (!this.state.isPageVisible) {
      newState = 'away';
    } else if (timeSinceActivity > this.idleThreshold * 5) {
      newState = 'away';
    } else if (timeSinceActivity > this.idleThreshold) {
      newState = 'idle';
    } else if (this.isTyping || this.state.mouseActivity) {
      newState = 'focused';
      if (!this.state.focusStartTime) {
        this.state.focusStartTime = now;
      }
    } else {
      newState = 'active';
      this.state.focusStartTime = undefined;
    }

    this.state.state = newState;
  }
}

