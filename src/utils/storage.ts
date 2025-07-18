import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback storage for when AsyncStorage is not available
class FallbackStorage {
  private storage: { [key: string]: string } = {};

  async getItem(key: string): Promise<string | null> {
    try {
      return this.storage[key] || null;
    } catch (error) {
      console.warn('FallbackStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.storage[key] = value;
    } catch (error) {
      console.warn('FallbackStorage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      delete this.storage[key];
    } catch (error) {
      console.warn('FallbackStorage removeItem error:', error);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      keys.forEach(key => delete this.storage[key]);
    } catch (error) {
      console.warn('FallbackStorage multiRemove error:', error);
    }
  }
}

// Robust storage wrapper
class RobustStorage {
  private storage: typeof AsyncStorage | FallbackStorage;

  constructor() {
    // Check if AsyncStorage is available
    if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
      this.storage = AsyncStorage;
    } else {
      console.warn('AsyncStorage not available, using fallback storage');
      this.storage = new FallbackStorage();
    }
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.storage.getItem(key);
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.storage.setItem(key, value);
    } catch (error) {
      console.warn('Storage setItem error:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.storage.removeItem(key);
    } catch (error) {
      console.warn('Storage removeItem error:', error);
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      if (this.storage instanceof FallbackStorage) {
        await this.storage.multiRemove(keys);
      } else {
        await AsyncStorage.multiRemove(keys);
      }
    } catch (error) {
      console.warn('Storage multiRemove error:', error);
    }
  }
}

export const storage = new RobustStorage();
export default storage; 