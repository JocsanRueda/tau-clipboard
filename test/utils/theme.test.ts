import {
  applyTheme,
  applyFontSize,
  resetTheme,
  getCurrentTheme,
  isDark,
  isLight,
  getThemes,
  applyThemeById,
  toggleDarkMode,
  getStorageIsDarkMode,
} from '../../src/utils/theme';
import { getLocalStorageSettings, getLocalStorageTheme, saveLocalStorageTheme } from '../../src/utils/localStorage';
import { getUserThemes } from '../../src/utils/store';
import { THEME } from '../../src/constants/constant';
import themesJson from '../../src/themes/themes.json';

// Mock localStorage utils
jest.mock('../../src/utils/localStorage', () => ({
  getLocalStorageSettings: jest.fn(),
  getLocalStorageTheme: jest.fn(),
  saveLocalStorageTheme: jest.fn(),
}));

// Mock store utils
jest.mock('../../src/utils/store', () => ({
  getUserThemes: jest.fn(),
}));

jest.mock('../../src/themes/themes.json', () => ({
    themes: [
        {
            id: 'default-dark',
            name: 'Default Dark',
            primaryColor: '#ff0000',
            secondaryColor: '#00ff00',
            tertiaryColor: '#0000ff',
            borderWidth: '1px',
        }
    ]
}), { virtual: true });

describe('Theme Utils', () => {
  const root = document.documentElement;

  afterEach(() => {
    jest.clearAllMocks();
    root.removeAttribute('style');
    root.classList.remove(THEME.DARK, THEME.LIGHT);
  });

  const mockTheme = {
    id: 'test-theme',
    name: 'Test Theme',
    primaryColor: '#ff0000',
    secondaryColor: '#00ff00',
    tertiaryColor: '#0000ff',
    borderWidth: '2px',
  };

  describe('applyTheme', () => {
    it('should apply theme colors and border width to the root element', async () => {
      (getLocalStorageSettings as jest.Mock).mockReturnValue({ font_size: 16 });
      await applyTheme(mockTheme);

      expect(root.style.getPropertyValue('--color-primary')).toBe(mockTheme.primaryColor);
      expect(root.style.getPropertyValue('--color-secondary')).toBe(mockTheme.secondaryColor);
      expect(root.style.getPropertyValue('--color-tertiary')).toBe(mockTheme.tertiaryColor);
      expect(root.style.getPropertyValue('--border-width')).toBe(mockTheme.borderWidth);
      expect(root.style.fontSize).toBe('16px');
      expect(saveLocalStorageTheme).toHaveBeenCalledWith(mockTheme);
    });
  });

  describe('applyFontSize', () => {
    it('should apply font size to the root element', () => {
      const fontSize = 20;
      applyFontSize(fontSize);
      expect(root.style.fontSize).toBe(`${fontSize}px`);
    });
  });

  describe('resetTheme', () => {
    it('should remove theme properties from the root element', () => {
        root.style.setProperty('--color-primary', 'red');
        resetTheme();
        expect(root.style.getPropertyValue('--color-primary')).toBe('');
    });
  });

  describe('getCurrentTheme', () => {
    it('should return dark when dark class is present', () => {
        root.classList.add(THEME.DARK);
        expect(getCurrentTheme()).toBe(THEME.DARK);
    });

    it('should return light when dark class is not present', () => {
        expect(getCurrentTheme()).toBe(THEME.LIGHT);
    });
  });

    describe('isDark and isLight', () => {
        it('should correctly identify dark mode', () => {
            root.classList.add(THEME.DARK);
            expect(isDark()).toBe(true);
            expect(isLight()).toBe(false);
        });

        it('should correctly identify light mode', () => {
            root.classList.remove(THEME.DARK);
            expect(isDark()).toBe(false);
            expect(isLight()).toBe(true);
        });
    });


  // describe('getThemes', () => {
  //   it('should return themes from the json file', () => {
  //       const themes = getThemes();
  //       console.log(themes);
  //       expect(themes).toEqual(themesJson.themes);
  //   });
  // });

  // describe('applyThemeById', () => {
  //   it('should apply theme from local storage if found', async () => {
  //     (getLocalStorageTheme as jest.Mock).mockReturnValue(mockTheme);
  //     await applyThemeById(mockTheme.id);
  //     expect(saveLocalStorageTheme).toHaveBeenCalledWith(mockTheme);
  //   });

  //   it('should apply theme from default themes if found', async () => {
  //       const defaultTheme = themesJson.themes[0];
  //       (getLocalStorageTheme as jest.Mock).mockReturnValue(null);
  //       await applyThemeById(defaultTheme.id);
  //       expect(saveLocalStorageTheme).toHaveBeenCalledWith(defaultTheme);
  //   });

  //   it('should apply theme from user themes if found', async () => {
  //       const userTheme = { ...mockTheme, id: 'user-theme' };
  //       (getLocalStorageTheme as jest.Mock).mockReturnValue(null);
  //       (getUserThemes as jest.Mock).mockResolvedValue([userTheme]);
  //       await applyThemeById(userTheme.id);
  //       expect(saveLocalStorageTheme).toHaveBeenCalledWith(userTheme);
  //   });

  // });

  describe('toggleDarkMode', () => {
    it('should add dark class and save to localStorage', () => {
        toggleDarkMode(true);
        expect(root.classList.contains('dark')).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith('isDarkMode', 'true');
    });

    it('should remove dark class and save to localStorage', () => {
        toggleDarkMode(false);
        expect(root.classList.contains('dark')).toBe(false);
        expect(localStorage.setItem).toHaveBeenCalledWith('isDarkMode', 'false');
    });
  });

  describe('getStorageIsDarkMode', () => {
    it('should return boolean from localStorage', () => {
        (localStorage.getItem as jest.Mock).mockReturnValue('false');
        expect(getStorageIsDarkMode()).toBe(false);
    });

    it('should return true if value is not a boolean', () => {
        (localStorage.getItem as jest.Mock).mockReturnValue('not a boolean');
        expect(getStorageIsDarkMode()).toBe(true);
    });
  });
});

// Mock localStorage for toggleDarkMode and getStorageIsDarkMode
const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        store = {};
      }),
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
