
export const TYPE_CONTROL_SETTINGS = {
  DROPDOWN: "dropdown",
  SHORTCUT_INPUT: "shortcut_input",
  UNITY_INPUT: "unity_input",
};

export type DropdownSettings = {
  label: string;
  key: string;
  items: Array<{ label: string; value: string | number | boolean }>;
  defaultValue: number;
  type: typeof TYPE_CONTROL_SETTINGS.DROPDOWN;
};

export type UnityInputSettings = {
  label: string;
  key: string;
  defaultValue: string | number;
  type: typeof TYPE_CONTROL_SETTINGS.UNITY_INPUT;
  min: number;
  max: number;
  unity: string;
  placeholder: string;
  typeValue: "number" | "text";
};

export type ShortcutInputSettings = {
  label: string;
  key: string;
  defaultValue: string;
  type: typeof TYPE_CONTROL_SETTINGS.SHORTCUT_INPUT;
  placeholder: string;
};
