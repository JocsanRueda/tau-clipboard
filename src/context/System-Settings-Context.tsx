import { DEFAULT_SYSTEM_SETTINGS } from "@/constants/system-options";
import { SystemSettings } from "@/types/system-settings.type";
import { getSettings, saveSettings } from "@/utils/store";
import { applyFontSettings, applyFontSize } from "@/utils/theme";
import React,{ createContext, useCallback, useEffect, useMemo, useState } from "react";

type SystemSettingsContextValue={
  settings:SystemSettings,
    // eslint-disable-next-line no-unused-vars
  setSystemSettings:(settings:SystemSettings)=>void;
}

const SystemSettingsContext= createContext<SystemSettingsContextValue | null>({
  settings:DEFAULT_SYSTEM_SETTINGS,
  setSystemSettings:()=>{}
});

export const SystemSettingsProvider:React.FC<{children: React.ReactNode}> = ({ children }) => {

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(DEFAULT_SYSTEM_SETTINGS);

  useEffect(()=>{
    async function loadSettings(){

      const s= await getSettings();

      if(s){
        setSystemSettings(s);
        applyFontSettings(s.font_size, s.font);

      }else{
        applyFontSettings(DEFAULT_SYSTEM_SETTINGS.font_size, DEFAULT_SYSTEM_SETTINGS.font);
        saveSettings(DEFAULT_SYSTEM_SETTINGS);
        setSystemSettings(DEFAULT_SYSTEM_SETTINGS);

      }
    }

    loadSettings();

  },[]);

  const setSystemSettingsWrapper= useCallback(async (settings:SystemSettings)=>{
    setSystemSettings(settings);
    applyFontSize(settings.font_size);
    try{
      await saveSettings(settings);

    }catch (error) {
      console.error("Error saving settings:", error);
    }
  },[]);

  const value=useMemo(()=>({

    settings:systemSettings,
    setSystemSettings:setSystemSettingsWrapper

  }),[systemSettings,setSystemSettingsWrapper]);

  return <SystemSettingsContext.Provider value={value}>{children}</SystemSettingsContext.Provider>;

};

export function useSystemSettingsContext() {
  const ctx= React.useContext(SystemSettingsContext);
  if(!ctx) throw new Error("useSystemSettingsContext must be used within a SystemSettingsProvider");
  return ctx;
}
