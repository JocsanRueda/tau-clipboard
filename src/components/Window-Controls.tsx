
import { ICON_WINDOW_CONTROL_SIZE } from "@/constants/constant";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { IoCloseSharp } from "react-icons/io5";
import { VscChromeMaximize, VscChromeMinimize } from "react-icons/vsc";

type WindowControlsProps= {
  roundedWindow: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsMaximized: (value: boolean)=> void;
};
export default function WindowControls({roundedWindow,setIsMaximized}: WindowControlsProps) {
  const window = getCurrentWindow();

  const handleClose = async () => {
    await window.close();
  };

  const handleMinimize = async () => {
    await window.minimize();
  };

  const handleMaximize = async () => {

    const isMaximized = await window.isMaximized();

    if (isMaximized){
      await window.unmaximize();
      setIsMaximized(false);
    }else{
      await window.maximize();
      setIsMaximized(true);
    }

  };

  return (
    <div
      id="titlebar"
      data-tauri-drag-region
      className={`w-full flex justify-end items-center bg-gray-300 dark:bg-secondary gap-1.5 z-100  px-2  py-1.5  overflow-hidden ${roundedWindow?" rounded-t-xl ":""}`}
    >

      <button
        onClick={handleMinimize}
      >
        <VscChromeMinimize size={ICON_WINDOW_CONTROL_SIZE} className="font-bold  mr-0.5 transition-colors duration-100 text-gray-900 dark:text-quaternary hover:text-gray-500 hover:dark:text-quaternary-dark" style={{strokeWidth:0.4}}/>
      </button>

      <button
        onClick={handleMaximize}
      >
        <VscChromeMaximize  size={ICON_WINDOW_CONTROL_SIZE} className="font-bold  transition-colors duration-100 text-gray-900 dark:text-quaternary hover:text-gray-500 hover:dark:text-quaternary-dark" style={{strokeWidth:0.4}}/>
      </button>
      <button
        onClick={handleClose}
      >
        <IoCloseSharp size={ICON_WINDOW_CONTROL_SIZE} className="font-bold transition-colors duration-100 text-gray-900 dark:text-quaternary hover:text-gray-500 hover:dark:text-quaternary-dark" />
      </button>
    </div>
  );
}
