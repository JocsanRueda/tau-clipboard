import { ICON_TOP_BAR_SIZE, PAGES } from "@/constants/constant";
import { orderItemsOptions } from "@/constants/system-options";
import { usePageContext } from "@/context/Page-Contex";
import { useSystemSettingsContext } from "@/context/System-Settings-Context";
import { useDarkMode } from "@/hooks/useDarkMode";
import { TopBarProps } from "@/types/top-bar.type";
import { getStorageIsDarkMode } from "@/utils/theme";
import { useRef, useState } from "react";
import { CgTrash } from "react-icons/cg";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { LuMoon, LuSun } from "react-icons/lu";
import { RiSortDesc } from "react-icons/ri";

import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";

function TopBar({ deleteFunction, setFilter, filter }: TopBarProps) {

  const { t } = useTranslation();

  const ASCENDING= orderItemsOptions.items[0].value as string;
  const DESCENDING= orderItemsOptions.items[1].value as string;

  const { handlePage } = usePageContext();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(getStorageIsDarkMode());

  const {settings, setSystemSettings} = useSystemSettingsContext();

  const [onFocus, setOnFocus]= useState<boolean>(false);

  // eslint-disable-next-line no-undef
  const input = useRef<HTMLInputElement>(null);

  useDarkMode(isDarkMode);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSort = (value: string) => {
    setSystemSettings({ ...settings, item_order: value });
  };

  //search hotkey
  useHotkeys(settings.search_shortcut,(event)=>{

    event.preventDefault();

    setIsSearchVisible(!isSearchVisible);
    if(!isSearchVisible){
      // eslint-disable-next-line no-undef
      setTimeout(()=>{

        if (onFocus) {
          input.current?.blur();
          setOnFocus(false);
        }else{
          input.current?.focus();
          setOnFocus(true);
        }

      },100);
    }
  });

  // delete all hotkey

  useHotkeys(settings.delete_all_shortcut,(event)=>{
    event.preventDefault();
    deleteFunction();
  });

  // sort shortcut
  useHotkeys(settings.sort_shortcut,(event)=>{
    event.preventDefault();

    handleSort(settings.item_order === DESCENDING ? ASCENDING : DESCENDING);
  });

  return (

    <div className="flex justify-end items-center px-2 py-2 dark:bg-primary mx-1 gap-2.5 overflow-visible">

      <div
        className={`flex items-center min-w-0 w-auto max-w-ws  ${
          isSearchVisible
            ? "flex-grow bg-gray-300 dark:bg-secondary text-gray-900 "
            : "flex-none overflow-visible"
        } text-quaternary rounded-lg  py-1 focus-within:ring-2 focus-within:ring-gray-400 dark:focus-within:ring-tertiary overflow-hidden transition-all duration-100`} // Añadido transition-all
      >
        <FaMagnifyingGlass
          size={ICON_TOP_BAR_SIZE}
          className={`${
            isSearchVisible ? "text-gray-400 mx-2" : "text-gray-900 dark:text-quaternary hover:dark:text-tertiary hover:scale-110"
          } cursor-pointer transition-[color,scale] duration-10 overflow-visible`}
          onClick={() => setIsSearchVisible(!isSearchVisible)}
        />

        <input
          ref={input}
          type="text"
          placeholder={t("search")+"..."}
          className={`bg-transparent focus:outline-none text-black dark:text-quaternary transition-[width,opacity] duration-100 ${

            isSearchVisible ? "w-full opacity-100" : "w-0 opacity-0"
          }`}
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          onFocus={() => setOnFocus(true)}
          onBlur={() => setOnFocus(false)}
        />
      </div>

      <div className=" flex flex-row justify-end items-center gap-2.5">

        {/* Sort */}
        <RiSortDesc
          size={ICON_TOP_BAR_SIZE}
          className={`transition-[color,scale,rotate] duration-100 text-gray-900 dark:text-quaternary hover:dark:text-secondary-light hover:scale-120 ${settings.item_order === ASCENDING ? "" : "rotate-180"}`}
          onClick={() => handleSort(settings.item_order === ASCENDING ? DESCENDING : ASCENDING)}

          style={{strokeWidth:0.5}}
        />
        {/* Delete All */}
        <CgTrash
          size={ICON_TOP_BAR_SIZE}
          className="transition-[color,scale] duration-100 text-gray-900 dark:text-quaternary dark:hover:text-red-500 hover:scale-135 scale-120 "
          onClick={deleteFunction}
        />

        {/* Settings */}
        <IoSettingsSharp
          size={ICON_TOP_BAR_SIZE}
          className="transition-[color,scale] duration-100 text-gray-900 dark:text-quaternary hover:text-secondary-light hover:scale-120"
          onClick={() => handlePage(PAGES.SETTINGS)}
        />

        {/* Toggle Theme */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-[41px]  bg-gray-300 dark:bg-secondary rounded-full p-0.5 transition-colors duration-300"
        >
          <div
            className={`rounded-full shadow-md transform transition-transform duration-300 m-0.5  ${
              isDarkMode ? "translate-x-[10.5px]" : "  -translate-x-[10.5px] bg-white"
            }`}
          >
            {isDarkMode ? (
              <LuSun className="text-quaternary " size={ICON_TOP_BAR_SIZE} />
            ) : (
              <LuMoon className="text-gray-500 " size={ICON_TOP_BAR_SIZE} />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}

export default TopBar;
