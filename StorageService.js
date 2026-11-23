import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_STORAGE_KEY = '@noteflow_notes';

const StorageService = {
  // READ: Retrieve the saved JSON string and convert it back to an array.
  async getNotes() {
    try {
      const storedValue = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      return storedValue ? JSON.parse(storedValue) : [];
    } catch (error) {
      console.error('Error reading notes:', error);
      throw error;
    }
  },

  // CREATE / UPDATE / DELETE: Save the complete notes array as a JSON string.
  async saveNotes(notes) {
    try {
      const jsonValue = JSON.stringify(notes);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving notes:', error);
      throw error;
    }
  },
};

export default StorageService;
