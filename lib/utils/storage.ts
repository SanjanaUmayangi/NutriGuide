import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  setItem: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage set error:', e);
    }
  },
  
  getItem: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.warn('Storage get error:', e);
      return null;
    }
  },
  
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  },
  
  // Initialize app data from storage
  initializeAppData: async () => {
    const [favourites, tracker, theme, token, username] = await Promise.all([
      getItem('favourites'),
      getItem('tracker'),
      getItem('theme'),
      getItem('token'),
      getItem('username')
    ]);
    
    return { favourites, tracker, theme, token, username };
  }
};

export const { setItem, getItem, removeItem } = storage;