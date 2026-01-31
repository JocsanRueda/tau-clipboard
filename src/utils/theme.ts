import { DEFAULT_THEME_INDEX, THEME } from "@/constants/constant";
import { ThemeFile, ThemesFileJson } from "@/types/theme.type";
import themesJson from "../themes/themes.json";
import { getLocalStorageSettings, getLocalStorageTheme, saveLocalStorageTheme } from "./localStorage";
import { getUserThemes } from "./store";

export async function applyTheme(theme: ThemeFile) {

  const systemSettings=getLocalStorageSettings();

  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primaryColor);
  root.style.setProperty("--color-secondary", theme.secondaryColor);
  root.style.setProperty("--color-tertiary", theme.tertiaryColor);
  root.style.setProperty("--border-width", theme.borderWidth);

  if (systemSettings?.font_size) {
    root.style.fontSize = systemSettings.font_size+"px";
  }

  saveLocalStorageTheme(theme);
}

export function applyFontSize(fontSize: number) {
  const root = document.documentElement;
  root.style.fontSize = fontSize + "px";
}

export function resetTheme() {

  const root = document.documentElement;
  root.style.removeProperty("--color-primary");
  root.style.removeProperty("--color-secondary");
  root.style.removeProperty("--border-width");
  root.style.removeProperty("--color-tertiary");
  root.style.removeProperty("--font-type");
  root.style.removeProperty("--font-size");

}

export function getCurrentTheme() {
  const root = document.documentElement;
  return root.classList.contains(THEME.DARK) ? THEME.DARK : THEME.LIGHT;
}

export function isDark() {
  return getCurrentTheme() === THEME.DARK;
}

export function isLight() {
  return getCurrentTheme() === THEME.LIGHT;
}

export function getThemes(){
  const themes  = themesJson as ThemesFileJson;
  return themes.themes;
}

export async function applyThemeById(id: string){
  // 1. search in local storage
  const themeStorage = getLocalStorageTheme();
  if (themeStorage?.id === id) {
    applyTheme(themeStorage);
    return;
  }

  // 2. search in default themes
  const themes = getThemes();
  const foundTheme = themes.find(t => t.id === id);
  if (foundTheme) {
    applyTheme(foundTheme);
    return;
  }

  // 3. search in user themes (async)
  const userThemes = await getUserThemes();
  const foundUserTheme = userThemes.find(t => t.id === id);
  if (foundUserTheme) {
    applyTheme(foundUserTheme);
    return;
  }

  const defaultTheme =  themes[DEFAULT_THEME_INDEX];
  applyTheme(defaultTheme);

}

export function toggleDarkMode(isDarkMode: boolean){
  const htmlElement = document.documentElement;

  if (isDarkMode) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }

  // eslint-disable-next-line no-undef
  localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));

}

export const getStorageIsDarkMode=()=>{
  try {
    // eslint-disable-next-line no-undef
    const isDarkMode= JSON.parse(localStorage.getItem("isDarkMode") || "true");
    if(typeof isDarkMode !== "boolean") return true;
    return isDarkMode;
  } catch (error) {
    console.error("Error parsing isDarkMode from localStorage", error);
    return true;
  }
};
