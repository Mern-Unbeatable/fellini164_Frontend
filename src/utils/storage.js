// LocalStorage utility functions

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const setStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error saving to localStorage (key: ${key}):`, error);
  }
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @returns {any} Parsed value or null if not found
 */
export const getStorage = (key) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return null;
    }
    // Try to parse as JSON, if it fails return the raw string (for tokens)
    try {
      return JSON.parse(serializedValue);
    } catch {
      // If not valid JSON, return as-is (handles plain strings like JWT tokens)
      return serializedValue;
    }
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return null;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
  }
};

/**
 * Clear all localStorage data
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if a key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export const hasStorage = (key) => {
  return localStorage.getItem(key) !== null;
};
