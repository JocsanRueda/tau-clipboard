import { DropdownSettings, TYPE_CONTROL_SETTINGS, UnityInputSettings, ShortcutInputSettings } from "@/types/system-options-type";

export const timeOptions : DropdownSettings = {
  label:"Expiration Time",
  key:"expiration_time",
  items:[
    { label: "1 hour", value: 60*60 },
    { label: "6 hours", value: 60*60*6 },
    { label: "12 hours", value: 60*60*12 },
    { label: "24 hours", value: 60*60*24 },
    { label: "48 hours", value: 60*60*48 },
  ],
  defaultValue: 3,
  type: TYPE_CONTROL_SETTINGS.DROPDOWN,
};

export const limitItemsOptions : DropdownSettings = {
  label:"Limit of items",
  key:"item_limit",
  items: [
    { label: "50 items", value: 50 },
    { label: "100 items", value: 100 },
    { label: "200 items", value: 200 },
    { label: "500 items", value: 500 },
    { label: "no_limit", value: -1 },
  ],
  defaultValue: 2,
  type: TYPE_CONTROL_SETTINGS.DROPDOWN,
};

export const languagesOptions : DropdownSettings = {
  label:"Language",
  key:"language",
  items: [
    { label: "english", value: "en" },
    { label: "spanish", value: "es" },
  ],
  defaultValue: 0,
  type: TYPE_CONTROL_SETTINGS.DROPDOWN,
};

export const orderItemsOptions : DropdownSettings = {
  label:"Order Items ",
  key:"item_order",
  items: [
    { label: "ascending", value: "ascending" },
    { label: "descending", value: "descending" },
  ],
  defaultValue: 0,
  type: TYPE_CONTROL_SETTINGS.DROPDOWN,
};

export const roundedWindowOptions : DropdownSettings = {
  label:"Rounded Window",
  key:"rounded_window_corners",
  items: [
    { label: "enabled", value: true },
    { label: "disabled", value: false },
  ],
  defaultValue: 0,
  type: TYPE_CONTROL_SETTINGS.DROPDOWN,
};

export const fontSizeOptions : UnityInputSettings = {
  label:"Font Size",
  key:"font_size",
  defaultValue: 13,
  type: TYPE_CONTROL_SETTINGS.UNITY_INPUT,
  min:6,
  max:30,
  unity:"px",
  placeholder:"12",
  typeValue:"number",
};

export const horizontalSizeOptions : UnityInputSettings = {
  label:"Horizontal Size",
  key:"horizontal_size",
  defaultValue:380,
  type: TYPE_CONTROL_SETTINGS.UNITY_INPUT,
  min:100,
  max:1000,
  unity:"px",
  placeholder:"380",
  typeValue:"number",

};

export const verticalSizeOptions : UnityInputSettings = {
  label:"Vertical Size",
  key:"vertical_size",
  defaultValue:440,
  type: TYPE_CONTROL_SETTINGS.UNITY_INPUT,
  min:100,
  max:1000,
  unity:"px",
  placeholder:"440",
  typeValue:"number",

};

export const searchShorcutOptions : ShortcutInputSettings = {
  label:"Search Shortcut",
  key:"search_shortcut",
  defaultValue: "Ctrl+F",
  type: TYPE_CONTROL_SETTINGS.SHORTCUT_INPUT,
  placeholder:"press_key_combination",
};

export const deleteAllShortcutOptions : ShortcutInputSettings = {
  label:"Delete All Shortcut",
  key:"delete_all_shortcut",
  defaultValue: "Ctrl+Backspace",
  type: TYPE_CONTROL_SETTINGS.SHORTCUT_INPUT,
  placeholder:"press_key_combination",
};

export const sortShortcutOptions : ShortcutInputSettings = {
  label:"Sort Shortcut",
  key:"sort_shortcut",
  defaultValue: "Ctrl+S",
  type: TYPE_CONTROL_SETTINGS.SHORTCUT_INPUT,
  placeholder:"press_key_combination",
};
export const keyboardLaunchOptions : ShortcutInputSettings = {
  label:"Keyboard launch",
  key:"keyboard_shortcut",
  defaultValue: "Super+V",
  type: TYPE_CONTROL_SETTINGS.SHORTCUT_INPUT,
  placeholder:"press_key_combination",

};
export const DEFAULT_SYSTEM_SETTINGS = {
  expiration_time: timeOptions.items[timeOptions.defaultValue].value as number,
  item_limit: limitItemsOptions.items[limitItemsOptions.defaultValue].value as number,
  language: languagesOptions.items[languagesOptions.defaultValue].value as string,
  item_order: orderItemsOptions.items[orderItemsOptions.defaultValue].value as string,
  rounded_window_corners: roundedWindowOptions.items[roundedWindowOptions.defaultValue].value as boolean,
  font_size: fontSizeOptions.defaultValue as number,
  horizontal_size: horizontalSizeOptions.defaultValue as number,
  vertical_size: verticalSizeOptions.defaultValue as number,
  keyboard_shortcut: keyboardLaunchOptions.defaultValue as string,
  search_shortcut: searchShorcutOptions.defaultValue as string,
  delete_all_shortcut: deleteAllShortcutOptions.defaultValue as string,
  sort_shortcut: sortShortcutOptions.defaultValue as string,
};

export type CategoySettings={
  GeneralSettings: Array< DropdownSettings>,
  AppearanceSettings:Array< DropdownSettings | UnityInputSettings>,
  KeyboardSettings:Array< ShortcutInputSettings>,
}

export const CATEGORY_SYSTEM_SETTINGS : CategoySettings  = {
  GeneralSettings:[
    languagesOptions,
    limitItemsOptions,
    timeOptions,
    orderItemsOptions,
  ],

  AppearanceSettings:[
    horizontalSizeOptions,
    verticalSizeOptions,
    fontSizeOptions,
    roundedWindowOptions,
  ],

  KeyboardSettings:[
    searchShorcutOptions,
    deleteAllShortcutOptions,
    sortShortcutOptions,
  ]

};

