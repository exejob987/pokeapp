import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  FAVORITES: '@pokeapp/favorites',
  POKEMON_SEARCH_INDEX: '@pokeapp/search_index',
  LAST_LOADED_OFFSET: '@pokeapp/last_offset',
} as const;

export const storageService = {
  /**
   * Retrieves an item from AsyncStorage and automatically parses it.
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Error getting key "${key}":`, error);
      return null;
    }
  },

  /**
   * Serializes and stores an item in AsyncStorage.
   */
  async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[StorageService] Error setting key "${key}":`, error);
      return false;
    }
  },

  /**
   * Removes an item from AsyncStorage.
   */
  async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[StorageService] Error removing key "${key}":`, error);
      return false;
    }
  },

  /**
   * Clears all AsyncStorage content (mostly for developer options or debugging).
   */
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('[StorageService] Error clearing AsyncStorage:', error);
      return false;
    }
  },
};
