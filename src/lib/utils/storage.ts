/**
 * localStorage utilities with type safety and error handling
 * Centralizes storage patterns used across the app
 */

/**
 * Load data from localStorage with optional validation
 * @param key - Storage key
 * @param validator - Optional type guard function
 * @returns Parsed data or null if invalid/missing
 */
export function loadFromStorage<T>(
  key: string,
  validator?: (value: unknown) => value is T
): T | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (validator && !validator(parsed)) {
      console.warn(`Storage validation failed for key: ${key}`);
      return null;
    }

    return parsed as T;
  } catch (e) {
    console.warn(`Failed to load from storage: ${key}`, e);
    return null;
  }
}

/**
 * Save data to localStorage
 * @param key - Storage key
 * @param data - Data to save
 * @returns true if successful
 */
export function saveToStorage<T>(key: string, data: T): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Failed to save to storage: ${key}`, e);
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param key - Storage key
 */
export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Failed to remove from storage: ${key}`, e);
  }
}

/**
 * Create a persistent store that syncs with localStorage
 * @param key - Storage key
 * @param defaultValue - Default value if nothing in storage
 * @param validator - Optional type guard
 */
export function createPersistentValue<T>(
  key: string,
  defaultValue: T,
  validator?: (value: unknown) => value is T
): {
  get: () => T;
  set: (value: T) => void;
  remove: () => void;
} {
  // Use symbol to track cache state - allows caching falsy values like 0, false, ''
  const NOT_CACHED = Symbol('not-cached');
  let cachedValue: T | typeof NOT_CACHED = NOT_CACHED;

  return {
    get() {
      if (cachedValue !== NOT_CACHED) return cachedValue;

      const stored = loadFromStorage<T>(key, validator);
      cachedValue = stored ?? defaultValue;
      return cachedValue;
    },
    set(value: T) {
      cachedValue = value;
      saveToStorage(key, value);
    },
    remove() {
      cachedValue = NOT_CACHED;
      removeFromStorage(key);
    }
  };
}

/**
 * Storage keys used in the app
 */
export const STORAGE_KEYS = {
  BUILDS: 'captains-cove-builds',
  THEME: 'captains-cove-theme',
  PREFERENCES: 'captains-cove-prefs',
  VIEW_MODES: 'captains-cove-views'
} as const;
