import { SystemSettings } from "@/types/system-settings.type";
import { Theme } from "@/types/theme.type";
import { getLocalStorageSettings, getLocalStorageTheme, saveLocalStorageSettings, saveLocalStorageTheme } from "../../src/utils/localStorage";

describe("localStorage utility functions", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("saveLocalStorageTheme and getLocalStorageTheme", () => {
    it("should save and retrieve a theme correctly", () => {
      const theme: Theme = {
        id: "dark-theme",
        name: "dark",
        primaryColor: "#000",
        secondaryColor: "#111",
        tertiaryColor: "#222",
        borderWidth: "1px",
        fontColor: "#fff",
        fontSize: "16px",
      };

      saveLocalStorageTheme(theme);
      const retrievedTheme = getLocalStorageTheme();

      expect(retrievedTheme).toEqual(theme);
    });

    it("should return null if theme is not set in localStorage", () => {
      const retrievedTheme = getLocalStorageTheme();
      expect(retrievedTheme).toBeNull();
    });

    it("should return null if theme in localStorage is invalid JSON", () => {
      localStorage.setItem("theme", "{invalidJson}");
      const retrievedTheme = getLocalStorageTheme();
      expect(retrievedTheme).toBeNull();
    });
  });

  describe("saveLocalStorageSettings and getLocalStorageSettings", () => {
    it("should save and retrieve system settings correctly", () => {
      const settings: SystemSettings = { 
        expiration_time: 3600,
        item_limit: 50,
        keyboard_shortcut: "Ctrl+V",
        search_shortcut: "Ctrl+F",
        delete_all_shortcut: "Ctrl+Shift+D",
        sort_shortcut: "Ctrl+S",
        item_order: "desc",
        language: "en",
        rounded_window_corners: true,
        font_size: 16,
        vertical_size: 600,
        horizontal_size: 800,
      };

      saveLocalStorageSettings(settings);
      const retrievedSettings = getLocalStorageSettings();

      expect(retrievedSettings).toEqual(settings);
    });

    it("should return null if system settings are not set in localStorage", () => {
      const retrievedSettings = getLocalStorageSettings();
      expect(retrievedSettings).toBeNull();
    });

    it("should return null if system settings in localStorage are invalid JSON", () => {
      localStorage.setItem("systemSettings", "{invalidJson}");
      const retrievedSettings = getLocalStorageSettings();
      expect(retrievedSettings).toBeNull();
    });
  });
});