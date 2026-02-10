
import { useEffect, useState } from "react";
import "./App.css";

import ClipboardBody from "./components/ClipboardBody";
import WindowControls from "./components/Window-Controls";
import { useSystemSettingsContext } from "./context/System-Settings-Context";
import { initLanguage } from "./utils/languages";
function App() {

  const [isMaximized, setIsMaximized] =  useState<boolean>(false);

  const {settings}= useSystemSettingsContext();
  useEffect(() => {

    const initLang= async (lang: string) => {

      await initLanguage(lang );
    };
    initLang(settings.language);

  }, [settings.language]);

  return (
    <div className={`font-sans
        flex flex-col h-screen overflow-hidden
        ${settings.rounded_window_corners && !isMaximized? "rounded-xl" : ""}
        border-1 border-gray-400 dark:border-primary-dark
      `}
    >

      <WindowControls roundedWindow={settings.rounded_window_corners && !isMaximized}  setIsMaximized={setIsMaximized}/>

      <ClipboardBody />

    </div>

  );
}

export default App;
