import type { Notification, SmartNotifyConfig, NotificationStats } from '../types';

const STORAGE_PREFIX = 'smart-notify-';

export class NotificationStorage {
  private storageKey = `${STORAGE_PREFIX}notifications`;
  private configKey = `${STORAGE_PREFIX}config`;
  private statsKey = `${STORAGE_PREFIX}stats`;
  private modelsKey = `${STORAGE_PREFIX}models`;

  saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  loadNotifications(): Notification[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  }

  saveConfig(config: Partial<SmartNotifyConfig>): void {
    try {
      localStorage.setItem(this.configKey, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  loadConfig(): Partial<SmartNotifyConfig> | null {
    try {
      const data = localStorage.getItem(this.configKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load config:', error);
      return null;
    }
  }

  saveStats(stats: NotificationStats): void {
    try {
      localStorage.setItem(this.statsKey, JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save stats:', error);
    }
  }

  loadStats(): NotificationStats | null {
    try {
      const data = localStorage.getItem(this.statsKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load stats:', error);
      return null;
    }
  }

  saveModels(models: Record<string, string>): void {
    try {
      localStorage.setItem(this.modelsKey, JSON.stringify(models));
    } catch (error) {
      console.error('Failed to save models:', error);
    }
  }

  loadModels(): Record<string, string> | null {
    try {
      const data = localStorage.getItem(this.modelsKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load models:', error);
      return null;
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.configKey);
      localStorage.removeItem(this.statsKey);
      localStorage.removeItem(this.modelsKey);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  exportData(): string {
    return JSON.stringify({
      notifications: this.loadNotifications(),
      config: this.loadConfig(),
      stats: this.loadStats(),
      models: this.loadModels(),
      version: '1.0.0',
      exportedAt: Date.now()
    });
  }

  importData(data: string | any): void {
    try {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (parsed.notifications) this.saveNotifications(parsed.notifications);
      if (parsed.config) this.saveConfig(parsed.config);
      if (parsed.stats) this.saveStats(parsed.stats);
      if (parsed.models) this.saveModels(parsed.models);
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  }
}

export const storage = new NotificationStorage();

