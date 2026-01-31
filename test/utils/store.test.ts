import { getHistoryItems, saveSettings, getSettings, getThemeId, saveThemeId, getUserThemes, addTheme, deleteTheme } from '../../src/utils/store';
import { Store } from '@tauri-apps/plugin-store';
import { getLocalStorageSettings, saveLocalStorageSettings } from '../../src/utils/localStorage';
import { CLIPBOARD_KEY, DEFAULT_THEME_ID } from '../../src/constants/constant';

// Mock @tauri-apps/plugin-store
jest.mock('@tauri-apps/plugin-store');

const mockStoreInstance = {
    get: jest.fn(),
    set: jest.fn(),
    save: jest.fn(),
};

(Store as any).load = jest.fn().mockResolvedValue(mockStoreInstance);


// Mock localStorage utils
jest.mock('../../src/utils/localStorage', () => ({
    getLocalStorageSettings: jest.fn(),
    saveLocalStorageSettings: jest.fn(),
}));

describe('Store Utils', () => {
    afterEach(() => {
        jest.clearAllMocks();
        mockStoreInstance.get.mockClear();
        mockStoreInstance.set.mockClear();
        mockStoreInstance.save.mockClear();
    });

    describe('getHistoryItems', () => {
        it('should return history items from the store', async () => {
            const mockItems = [{ id: '1', content: 'test' }];
            mockStoreInstance.get.mockResolvedValue(mockItems);
            const items = await getHistoryItems();
            expect(items).toEqual(mockItems);
            expect(Store.load).toHaveBeenCalledWith(CLIPBOARD_KEY.FILE_HISTORY);
            expect(mockStoreInstance.get).toHaveBeenCalledWith(CLIPBOARD_KEY.HISTORY);
        });

        it('should return an empty array if no items are in the store', async () => {
            mockStoreInstance.get.mockResolvedValue(null);
            const items = await getHistoryItems();
            expect(items).toEqual([]);
        });
    });

    describe('saveSettings', () => {
        it('should save settings to the store and localStorage', async () => {
            const mockSettings = { theme: 'dark' };
            await saveSettings(mockSettings as any);
            expect(Store.load).toHaveBeenCalledWith(CLIPBOARD_KEY.FILE_SETTINGS);
            expect(mockStoreInstance.set).toHaveBeenCalledWith(CLIPBOARD_KEY.SETTINGS, mockSettings);
            expect(mockStoreInstance.save).toHaveBeenCalled();
            expect(saveLocalStorageSettings).toHaveBeenCalledWith(mockSettings);
        });
    });

    describe('getSettings', () => {
        it('should return settings from localStorage if available', async () => {
            const mockSettings = { theme: 'dark' };
            (getLocalStorageSettings as jest.Mock).mockReturnValue(mockSettings);
            const settings = await getSettings();
            expect(settings).toEqual(mockSettings);
            expect(Store.load).not.toHaveBeenCalled();
        });

        it('should return settings from the store if not in localStorage', async () => {
            const mockSettings = { theme: 'dark' };
            (getLocalStorageSettings as jest.Mock).mockReturnValue(null);
            mockStoreInstance.get.mockResolvedValue(mockSettings);
            const settings = await getSettings();
            expect(settings).toEqual(mockSettings);
            expect(mockStoreInstance.get).toHaveBeenCalledWith(CLIPBOARD_KEY.SETTINGS);
        });
    });

    describe('getThemeId', () => {
        it('should return the theme id from the store', async () => {
            const mockThemeId = 'custom-theme';
            mockStoreInstance.get.mockResolvedValue(mockThemeId);
            const themeId = await getThemeId();
            expect(themeId).toBe(mockThemeId);
            expect(mockStoreInstance.get).toHaveBeenCalledWith(CLIPBOARD_KEY.THEME);
        });

        it('should return the default theme id if none is in the store', async () => {
            mockStoreInstance.get.mockResolvedValue(null);
            const themeId = await getThemeId();
            expect(themeId).toBe(DEFAULT_THEME_ID);
        });
    });

    describe('saveThemeId', () => {
        it('should save the theme id to the store', async () => {
            const mockThemeId = 'custom-theme';
            await saveThemeId(mockThemeId);
            expect(mockStoreInstance.set).toHaveBeenCalledWith(CLIPBOARD_KEY.THEME, mockThemeId);
            expect(mockStoreInstance.save).toHaveBeenCalled();
        });
    });

    describe('Theme operations', () => {
        const mockThemes = [{ id: '1', name: 'Theme 1' }];

        describe('getUserThemes', () => {
            it('should return user themes from the store', async () => {
                mockStoreInstance.get.mockResolvedValue(mockThemes);
                const themes = await getUserThemes();
                expect(themes).toEqual(mockThemes);
                expect(mockStoreInstance.get).toHaveBeenCalledWith(CLIPBOARD_KEY.THEMES);
            });

            it('should return an empty array if no themes are in the store', async () => {
                mockStoreInstance.get.mockResolvedValue(null);
                const themes = await getUserThemes();
                expect(themes).toEqual([]);
            });
        });

        describe('addTheme', () => {
            it('should add a new theme to the store', async () => {
                const newTheme = { id: '2', name: 'Theme 2' };
                mockStoreInstance.get.mockResolvedValue(mockThemes);
                await addTheme(newTheme as any);
                expect(mockStoreInstance.set).toHaveBeenCalledWith(CLIPBOARD_KEY.THEMES, [...mockThemes, newTheme]);
                expect(mockStoreInstance.save).toHaveBeenCalled();
            });
        });

        describe('deleteTheme', () => {
            it('should delete a theme from the store', async () => {
                const themeIdToDelete = '1';
                mockStoreInstance.get.mockResolvedValue(mockThemes);
                await deleteTheme(themeIdToDelete);
                expect(mockStoreInstance.set).toHaveBeenCalledWith(CLIPBOARD_KEY.THEMES, []);
                expect(mockStoreInstance.save).toHaveBeenCalled();
            });
        });
    });
});
