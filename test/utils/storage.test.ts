import {
  saveToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage,
} from '../../src/utils/storage';

// Mock de localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LocalStorage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // Test para saveToLocalStorage
  test('should save an item to localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';
    saveToLocalStorage(key, value);
    expect(localStorage.getItem(key)).toEqual(JSON.stringify(value));
  });

  // Test para getFromLocalStorage
  test('should retrieve an item from localStorage', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    localStorage.setItem(key, JSON.stringify(value));
    const result = getFromLocalStorage(key);
    expect(result).toEqual(value);
  });

  test('should return null if item does not exist in localStorage', () => {
    const key = 'nonExistentKey';
    const result = getFromLocalStorage(key);
    expect(result).toBeNull();
  });

  // Test para removeFromLocalStorage
  test('should remove an item from localStorage', () => {
    const key = 'testKey';
    const value = 'testValue';
    localStorage.setItem(key, JSON.stringify(value));
    removeFromLocalStorage(key);
    expect(localStorage.getItem(key)).toBeNull();
  });

  // Test para clearLocalStorage
  test('should clear all items from localStorage', () => {
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    clearLocalStorage();
    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
  });
});
