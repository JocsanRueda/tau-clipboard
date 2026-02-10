import { SystemSettings } from "@/types/system-settings.type";
import { Theme, ThemeFile } from "@/types/theme.type";
import { applyFontSettings } from "./theme";

export function saveLocalStorageTheme(theme: Theme) {
  // eslint-disable-next-line no-undef
  localStorage.setItem("theme", JSON.stringify(theme));
}

export function getLocalStorageTheme(): ThemeFile | null {
  // eslint-disable-next-line no-undef
  const theme = localStorage.getItem("theme");
  if (theme) {
    try {
      const parsedTheme = JSON.parse(theme);
      return parsedTheme;
    } catch (error) {
      console.error("Error parsing theme from localStorage:", error);
      return null;
    }
  }
  return null;
}

export function saveLocalStorageSettings(settings: SystemSettings ) {
  // eslint-disable-next-line no-undef
  localStorage.setItem("systemSettings", JSON.stringify(settings));
  applyFontSettings(settings.font_size, settings.font);
}

export function getLocalStorageSettings(): SystemSettings | null {
  // eslint-disable-next-line no-undef
  const settings = localStorage.getItem("systemSettings");
  if (settings) {
    try {
      const parsedSettings = JSON.parse(settings);
      return parsedSettings;
    } catch (error) {
      console.error("Error parsing system settings from localStorage:", error);
      return null;
    }
  }
  return null;
}
