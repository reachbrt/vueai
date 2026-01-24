/**
 * @aivue/guided-form - Keyboard Navigation Utilities
 * Handles keyboard shortcuts and navigation
 */

export interface KeyboardNavigationOptions {
  enterToNext?: boolean;
  numericShortcuts?: boolean;
  tabNavigation?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  onSelectOption?: (index: number) => void;
}

export class KeyboardNavigationHandler {
  private options: KeyboardNavigationOptions;
  private listeners: Array<() => void> = [];

  constructor(options: KeyboardNavigationOptions) {
    this.options = options;
  }

  public attach(): void {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Enter to next
      if (this.options.enterToNext && event.key === 'Enter' && !event.shiftKey) {
        const target = event.target as HTMLElement;
        // Don't trigger on textarea
        if (target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          this.options.onNext?.();
        }
      }

      // Shift+Enter to previous
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        this.options.onPrevious?.();
      }

      // Numeric shortcuts (1-9 for options)
      if (this.options.numericShortcuts && /^[1-9]$/.test(event.key)) {
        const target = event.target as HTMLElement;
        // Only if not typing in an input
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          const index = parseInt(event.key) - 1;
          this.options.onSelectOption?.(index);
        }
      }

      // Tab navigation
      if (this.options.tabNavigation && event.key === 'Tab') {
        // Let default tab behavior work
        // Could add custom logic here if needed
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    this.listeners.push(() => document.removeEventListener('keydown', handleKeyDown));
  }

  public detach(): void {
    this.listeners.forEach(remove => remove());
    this.listeners = [];
  }
}

export function createKeyboardNavigation(options: KeyboardNavigationOptions): KeyboardNavigationHandler {
  return new KeyboardNavigationHandler(options);
}

