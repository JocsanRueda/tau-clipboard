import { resizeWindow } from "@/api/tauri/windows";
import { PAGES } from "@/constants/constant";
import {
  CATEGORY_SYSTEM_SETTINGS,
  deleteAllShortcutOptions,

  searchShorcutOptions,
  sortShortcutOptions,
} from "@/constants/system-options";
import { usePageContext } from "@/context/Page-Contex";
import { useSystemSettingsContext } from "@/context/System-Settings-Context";
import { SystemSettings as SystemSettingsProps } from "@/types/system-settings.type";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ContentSettings from "./Content-Settings";
import { Button } from "./UI-Components/Button";
import Dropdown from "./UI-Components/Dropdown";
import ShortcutInput from "./UI-Components/Shorcut-input";
import { UnityInput } from "./UI-Components/Unitiy-input";
import { UnityInputSettings, DropdownSettings, TYPE_CONTROL_SETTINGS } from "@/types/system-options-type";
import { formatValue } from "@/utils/string";
export function SystemSettings(){

  const {handlePage}= usePageContext();

  const [openDropdown, setOpenDropdown] = useState<{index: number, key: string}>({
    index: -1,
    key: "",
  });

  // const [isEditing, setIsEditing]= useState<boolean>(false);

  const {settings, setSystemSettings} = useSystemSettingsContext();

  const [tempSettings, setTempSettings]= useState<SystemSettingsProps>(settings);

  const shorcutsRef= useRef<string>(settings.keyboard_shortcut);
  const shorcutsSearchRef= useRef<string>(settings.search_shortcut);
  const shorcutsDeleteRef= useRef<string>(settings.delete_all_shortcut);
  const shortcutsSortRef= useRef<string>(settings.sort_shortcut);

  const { t } = useTranslation();

  const handleSelect = async (key: keyof SystemSettingsProps, value: string | number | boolean, type?: string) => {
    const newValue = formatValue(value, type);

    setTempSettings((prevSettings) => ({
      ...prevSettings,
      [key]: newValue,
    }));
  };

  const handleDropdownToggle = (dropdownId: number  , key: string) => {
    setOpenDropdown((prev) => (prev.index === dropdownId && prev.key === key ? {index: -1, key: ""} : {index: dropdownId, key}));
  };

  const handleShorcutChange = async (combo: string, key: string) => {
    handleSelect(key as keyof SystemSettingsProps, combo);
    if (key ===  sortShortcutOptions.key) {
      shorcutsRef.current = combo;
    } else if (key === searchShorcutOptions.key) {
      shorcutsSearchRef.current = combo;
    } else if (key === deleteAllShortcutOptions.key) {
      shorcutsDeleteRef.current = combo;
    } else{
      shortcutsSortRef.current = combo;
    }
  };

  const handleApplySettings = async (e: React.FormEvent) => {
    console.log("Applying settings:", tempSettings);

    e.preventDefault();

    if (tempSettings) {
      setSystemSettings(tempSettings);
    }

    if (tempSettings.vertical_size !== settings.vertical_size || tempSettings.horizontal_size !== settings.horizontal_size) {
      resizeWindow(tempSettings.horizontal_size, tempSettings.vertical_size);
    }

    handlePage(PAGES.HOME);

  };

  return(
    <form onSubmit={handleApplySettings}>
      <div className="w-full  flex flex-col justify-center items-center py-2 px-2.5 mb-5 overflow-x-scroll " >

        {/* settings items */}

        <div className="w-full">

          <h1 className="mx-auto font-light text-black dark:text-white my-2 -ml-1">{t("behavior")}</h1>

          {CATEGORY_SYSTEM_SETTINGS.GeneralSettings.map((cfg, idx) => (
            <ContentSettings label={t(cfg.key)} key={t(cfg.key)} firstItem={idx==0} lastItem={idx==CATEGORY_SYSTEM_SETTINGS.GeneralSettings.length-1}>

              <Dropdown
                options={cfg.items}
                onSelect={(value) => handleSelect(cfg.key as keyof SystemSettingsProps, value)}
                selectedValue={tempSettings[cfg.key as keyof SystemSettingsProps]}
                isOpen={openDropdown.index === idx && openDropdown.key === cfg.key}
                onToggle={() => handleDropdownToggle(idx, cfg.key)}
              />

            </ContentSettings>

          ))}

        </div>

        {/* aparent settings */}
        <div className="w-full">

          <h1 className="mx-auto font-light text-black dark:text-white my-2 -ml-1">{t("appearance")}</h1>

          {CATEGORY_SYSTEM_SETTINGS.AppearanceSettings.map((cfg, idx) => {

            const cfgUnity= cfg as UnityInputSettings;

            const cfgDropdown= cfg as DropdownSettings;

            const value= tempSettings[cfg.key as keyof SystemSettingsProps];

            return(

              <ContentSettings label={t(cfg.key)} key={t(cfg.key)} firstItem={idx==0} lastItem={idx==CATEGORY_SYSTEM_SETTINGS.AppearanceSettings.length-1}>
                {cfg.type === TYPE_CONTROL_SETTINGS.UNITY_INPUT && (

                  <UnityInput
                    unity={cfgUnity.unity}
                    type={cfgUnity.typeValue}
                    placeholder={cfgUnity.placeholder}
                    value={value as string}
                    min={cfgUnity.min}
                    max={cfgUnity.max}
                    onSelect={(value) =>handleSelect(cfgUnity.key as keyof SystemSettingsProps, value,cfgUnity.typeValue)}

                  />
                )}

                {cfg.type === TYPE_CONTROL_SETTINGS.DROPDOWN && (
                  <Dropdown
                    options={cfgDropdown.items}
                    onSelect={(value) => handleSelect(cfgDropdown.key as keyof SystemSettingsProps, value)}
                    selectedValue={tempSettings[cfgDropdown.key as keyof SystemSettingsProps]}
                    isOpen={openDropdown.index === idx && openDropdown.key === cfgDropdown.key}
                    onToggle={() => handleDropdownToggle(idx, cfgDropdown.key)}
                  />

                )}

              </ContentSettings>
            );
          })}
        </div>

        {/* size settings */}

        <div className="w-full">

          <h1 className="mx-auto font-light text-black dark:text-white  my-2 -ml-1">{t("keyboards_shortcut")}</h1>

          {CATEGORY_SYSTEM_SETTINGS.KeyboardSettings.map((cfg, idx) => {

            const value= tempSettings[cfg.key as keyof SystemSettingsProps];

            return(

              <ContentSettings label={t(cfg.key)} key={t(cfg.key)} firstItem={idx==0} lastItem={idx==CATEGORY_SYSTEM_SETTINGS.KeyboardSettings.length-1}>
                <ShortcutInput
                  value={value as string}
                  onChange={(combo) => handleShorcutChange(combo ?? "", cfg.key)}
                  placeholder={t(cfg.placeholder)}

                />
              </ContentSettings>
            );
          })}

          <Button label={t("apply")} type="submit" />

        </div>
      </div>

    </form>
  );
}
