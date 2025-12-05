/**
 * Local storage utility for persisting training data
 * Privacy-focused - all data stays in browser
 */

export class PredictiveStorage {
  private storageKey: string;
  private useLocalStorage: boolean;

  constructor(storageKey: string = 'aivue_predictive_input') {
    this.storageKey = storageKey;
    this.useLocalStorage = this.isLocalStorageAvailable();
  }

  /**
   * Check if localStorage is available
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save data to storage
   */
  async save(data: any): Promise<void> {
    if (!this.useLocalStorage) {
      console.warn('localStorage not available, data will not persist');
      return;
    }

    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(this.storageKey, jsonData);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw error;
    }
  }

  /**
   * Load data from storage
   */
  async load(): Promise<any | null> {
    if (!this.useLocalStorage) {
      return null;
    }

    try {
      const jsonData = localStorage.getItem(this.storageKey);
      if (!jsonData) {
        return null;
      }
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
   */
  async clear(): Promise<void> {
    if (!this.useLocalStorage) {
      return;
    }

    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw error;
    }
  }

  /**
   * Check if data exists
   */
  async exists(): Promise<boolean> {
    if (!this.useLocalStorage) {
      return false;
    }

    return localStorage.getItem(this.storageKey) !== null;
  }

  /**
   * Get storage size in bytes
   */
  async getSize(): Promise<number> {
    if (!this.useLocalStorage) {
      return 0;
    }

    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return 0;
    }

    return new Blob([data]).size;
  }

  /**
   * Export data as downloadable file
   */
  async exportToFile(filename: string = 'predictive-input-data.json'): Promise<void> {
    const data = await this.load();
    if (!data) {
      throw new Error('No data to export');
    }

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Import data from file
   */
  async importFromFile(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const jsonData = e.target?.result as string;
          const data = JSON.parse(jsonData);
          await this.save(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

