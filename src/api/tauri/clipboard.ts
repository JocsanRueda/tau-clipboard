import { DEFAULT_SYSTEM_SETTINGS } from "@/constants/system-options";
import { Font } from "@/types/fonts.type";
import { invoke } from "@tauri-apps/api/core";

// remove item
export const removeClipboardItem = async (index: number) => {
  try {
    await invoke("delete_item_command", {
      index:index,
    });
  } catch (err) {
    console.error("Error deleting item:", err);
  }
};
// update item
export const updateClipboardItem = async (index: number, text: string, property="value") => {
  try {
    await invoke("update_item_command", { index:index, newValue:text , propertyName:property});
  } catch (err) {
    console.error("Error updating item:", err);
  }
};

// delete all items
export const deleteAllClipboardItems = async () => {
  try {
    await invoke("delete_all_items_command");
  } catch (err) {
    console.error("Error deleting all items:", err);
  }
};

// update item
export const fixedClipboardItem = async (index: number, state: boolean) => {
  try {
    await invoke("fixed_item_command", { index:index, newValue:state });
  } catch (err) {
    console.error("Error updating item:", err);
  }
};

// write image
export const writeClipboardImage = async (fileName: string) => {

  try {
    await invoke("write_image_command", { fileName: fileName });
  } catch (err) {
    console.error("Error writing image:", err);
  }
};

// turn on shortcuts
export const onShortcuts = async (keys: string) => {
  try {
    await invoke("on_shortcuts_command", { keys: keys });
  } catch (err) {
    console.error("Error turning on shortcuts:", err);
  }
};

// turn off shortcuts
export const offShortcuts = async (keys: string) => {
  try {
    await invoke("off_shortcuts_command", { keys: keys });
  } catch (err) {
    console.error("Error turning off shortcuts:", err);
  }
};

// get system font
export const getSystemFont = async (): Promise<Font> => {
  try {
    const font: string = await invoke("get_system_font_command");
    const fontParts = font.split(" ");
    const exists = fontParts.length > 0;

    if (!exists) return {exists:false} as Font;

    const fontObj: Font = {
      name: fontParts[0],
      size: parseInt(fontParts[1])+"px"  || "12px",
      exists,
    };

    return  fontObj;
  } catch (err) {
    console.error("Error getting Gnome font:", err);
    return {} as Font;
  }
};

// list fonts
export const listFont = async () => {
  try {
    const fonts: string[] = await invoke("list_font");
    console.log("Fonts:", fonts);
  } catch (err) {
    console.error("Error listing fonts:", err);
    return [];
  }
};

// get system font size

export const getSystemFontSize= async (): Promise<string | number> => {
  try {
    const fontSize: string = await invoke("get_system_font_size");
    return fontSize;
  } catch (err) {
    console.error("Error getting system font size:", err);
    return DEFAULT_SYSTEM_SETTINGS.font_size;
  }
};

