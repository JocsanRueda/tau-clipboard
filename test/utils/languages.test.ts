import { changeLanguage, initLanguage } from '../../src/utils/languages';
import { LANGUAGES } from '../../src/constants/constant';
import i18next from 'i18next';

// Mock i18next and react-i18next
jest.mock('i18next', () => ({
  __esModule: true,
  default: {
    use: jest.fn().mockReturnThis(),
    init: jest.fn(),
    changeLanguage: jest.fn(),
    hasResourceBundle: jest.fn(),
    addResourceBundle: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  initReactI18next: 'initReactI18next',
}));


// Mock dynamic imports
jest.mock('../../src/locales/en.json', () => ({
  default: { greeting: 'Hello' },
}), { virtual: true });

jest.mock('../../src/locales/es.json', () => ({
  default: { greeting: 'Hola' },
}), { virtual: true });

describe('Language Utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initLanguage', () => {
    it('should initialize i18next with default language', async () => {
      await initLanguage();
      expect(i18next.init).toHaveBeenCalledWith(expect.objectContaining({
        lng: LANGUAGES.default,
        fallbackLng: LANGUAGES.ENGLISH,
      }));
    });

    it('should initialize i18next with a specified language', async () => {
      await initLanguage(LANGUAGES.SPANISH);
      expect(i18next.init).toHaveBeenCalledWith(expect.objectContaining({
        lng: LANGUAGES.SPANISH,
        fallbackLng: LANGUAGES.ENGLISH,
      }));
    });
  });

  describe('changeLanguage', () => {
    it('should change the language', async () => {
      (i18next.hasResourceBundle as jest.Mock).mockReturnValue(true);
      await changeLanguage(LANGUAGES.SPANISH);
      expect(i18next.changeLanguage).toHaveBeenCalledWith(LANGUAGES.SPANISH);
    });

    it('should load and add the resource bundle if it does not exist', async () => {
      (i18next.hasResourceBundle as jest.Mock).mockReturnValue(false);
      await changeLanguage(LANGUAGES.SPANISH);
      expect(i18next.addResourceBundle).toHaveBeenCalledWith(
        LANGUAGES.SPANISH,
        'translation',
        expect.any(Object),
        true,
        true
      );
      expect(i18next.changeLanguage).toHaveBeenCalledWith(LANGUAGES.SPANISH);
    });
  });
});
