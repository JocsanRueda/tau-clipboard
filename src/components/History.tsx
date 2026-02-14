import { deleteAllClipboardItems, fixedClipboardItem, removeClipboardItem, updateClipboardItem, writeClipboardImage } from "@/api/tauri/clipboard";
import { orderItemsOptions } from "@/constants/system-options";
import { useClipboardContext } from "@/context/Clipboard-Contex";
import { useSystemSettingsContext } from "@/context/System-Settings-Context";
import { useClipboardWatcher } from "@/hooks/useClipboardWatcher";

import { ItemClipboard } from "@/types/item-clipboard.type";
import { newItemPayload } from "@/types/new-item-payload";
import { add, getOtherIndexEqual } from "@/utils/array";
import { clear, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ContentCard from "./Content-Card";
import TopBar from "./TopBar";

import { COPY_COLDOWN_TIME } from "@/constants/constant";
import { MenuState } from "@/types/item-action-menu.type";
import { normalizeString } from "@/utils/string";
import { NoResult } from "./Not-Result";

export const History = () => {

  const {dataList,setDataList} = useClipboardContext();

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const {settings} = useSystemSettingsContext();

  const [filter, setFilter] = useState<string>("");

  const [fixedCounter, setFixedCounter] = useState<number>(0);

  const copyCoolDownRef=useRef<Record<string,number>>({});

  const { t } = useTranslation();

  const [menuState, setMenuState] = useState<MenuState>({
    menuId: null,
    editId: null,
  });

  // Save the dataList to the store whenever it changes
  useClipboardWatcher((newText) => {
    updateClipboardDataList(newText);

  });

  // Function to update the clipboard data list with new text
  const updateClipboardDataList = (newItem: newItemPayload) => {

    const newDataList = add(dataList, newItem);

    // Check if the new data list is different from the current one
    if (newDataList.length !== dataList.length) {
      setDataList(newDataList);

    }
  };

  //data list content originall data

  const handleToggleMenu = (id: string ) => {

    // dataList[index].showMenu = !dataList[index].showMenu;
    // setDataList([...dataList]);

    setMenuState((prevState) => ({
      editId: null,
      menuId: prevState.menuId===id?null:id,
    }));

    // const newToggleActions = Array((dataList.length)).fill(defaultItemClipboard);
    // newToggleActions[index] = { showMenu: !toggleActions[index].showMenu, activeEdit: false };
    // setToggleActions(newToggleActions);
  };

  //save new text after edit
  const handleSave = async (index: number, newText: string) => {

    const newTextNormalized= normalizeString(newText);

    const length = dataList.length-1;

    if (newTextNormalized !== finalData[index].value) {;

      const newDataList = updateDataList(index, { value: newTextNormalized });

      await updateClipboardItem(index, newTextNormalized);

      if (index === length) {
      // write the new text to the clipboard
        await writeText(newTextNormalized);
      }

      const indexValue= getOtherIndexEqual(newDataList,newTextNormalized,index);

      if(indexValue!==-1 ){

        await handleDelete(indexValue,newDataList);
      }
    }

    resetMenuState();

    // updateToggleActions(index, { showMenu: false, activeEdit: false });

  };

  //toggle edit mode
  const handleEdit = (id: string) => {

    setMenuState((prevState) => ({
      ...prevState,
      editId: prevState.editId===id?null:id,
    }));

    // updateToggleActions(index, { activeEdit: !dataList[index].activeEdit });
  };

  const resetMenuState = () => {
    setMenuState({
      menuId: null,
      editId: null,
    });
  };

  //delete item from data list
  const handleDelete = async (index: number,list?:ItemClipboard[]) => {

    if (dataList.length ===0 ) return;

    const lenght = dataList.length-1;

    const newDataList = (list ?? dataList ?? []).filter((_, i) => i !== index);
    setDataList(newDataList);

    // If the index is the last one, clear the clipboard
    if (index===lenght) {

      await clear();
    }

    // Remove the item from the store
    await removeClipboardItem(index);

    if (index===currentIndex) {
      setCurrentIndex(null);
    }

    return newDataList;

  };

  //toggle fixed state
  const handleFixed = async (index: number) => {

    updateDataList(index, { fixed: !dataList[index].fixed });

    await fixedClipboardItem(index,(!dataList[index].fixed));

    setFixedCounter(fixedCounter + (dataList[index].fixed ? -1 : 1));
  };

  // Update dataList state for a specific index

  const updateDataList = (index: number, updates: Partial<ItemClipboard>,list?:ItemClipboard[]) => {
    const newDataList = [...(list ?? dataList ?? [])];
    newDataList[index] = { ...newDataList[index], ...updates };

    setDataList(newDataList);

    return newDataList;

  };

  const deleteAllItem=async()=>{

    if (fixedCounter === dataList.length) return;
    resetMenuState();

    setDataList(dataList.filter((item) => item.fixed));

    await clear();

    await deleteAllClipboardItems();

  };

  //filter and order data list
  const finalData = useMemo(() => {
    const list = dataList ?? [];
    const q = (filter || "").toLowerCase().trim();

    // Filter once
    let res = q ? list.filter(item => item.value.toLowerCase().startsWith(q)) : list;

    // Order (don't mutate original)
    if (settings.item_order !== orderItemsOptions.items[0].value) {
      res = res.slice().reverse();

    }

    return res;
  }, [dataList, filter, settings.item_order]);

  const calcIndex = useCallback((index: number) => {
    if (settings.item_order === orderItemsOptions.items[0].value) {
      return index;
    }

    return finalData.length - index-1;

  }, [settings.item_order, finalData.length]);

  console.log("render history",{finalData});

  const handleMenuClick = (id: string) => () => handleToggleMenu(id);
  const handleDeleteClick = (index: number) => () => handleDelete(index);
  const handleEditClick = (id: string) => () => handleEdit(id);
  const handleSaveClick = (index: number) => (newText: string) => handleSave(index, newText);
  const handleFixedClick = (index: number) => () => handleFixed(index);

  const handleCopyClick = (index: number) => async () => {

    if (currentIndex === index) return;

    setCurrentIndex(index);

    const item = dataList[index];
    const {type,value,path} = item;

    const key = `${type}-${value}`;
    const now = Date.now();
    const lastCopyTime = copyCoolDownRef.current[key] || 0;
    if (now - lastCopyTime <  COPY_COLDOWN_TIME) return;

    copyCoolDownRef.current[key] = now;

    try{

      if(type==="text"){

        await writeText(value);

      }else{
        await clear();
        await writeClipboardImage(path??"");

      }
    }finally{

      // eslint-disable-next-line no-undef
      setTimeout(()=>{
        delete copyCoolDownRef.current[key];
      },COPY_COLDOWN_TIME);
    }

  };

  console.log("menu state",menuState);

  return (

    <div className="flex flex-col h-full bg-gray-200 dark:bg-primary">

      <TopBar deleteFunction={deleteAllItem} setFilter={setFilter} filter={filter} />

      <div className="flex-1 overflow-y-auto  flex flex-col">
        <h2 className="text-gray-900 dark:text-quaternary font-light tracking-tight mx-3 select-none">
          {t("history")}
        </h2>

        <section className="flex flex-col gap-2 my-2 mx-1 flex-1">
          {finalData.length > 0 ?
            finalData.map((item, index) => {

              const newIndex = calcIndex(index);

              return (
                <ContentCard
                  key={item.id}
                  text={item.value}
                  fixed={item.fixed}
                  type={item.type}
                  url={item.path}
                  handleMenu={handleMenuClick(item.id)}
                  handleDelete={handleDeleteClick(newIndex)}
                  handleEdit={handleEditClick(item.id)}
                  handleSave={handleSaveClick(newIndex)}
                  handleFixed={handleFixedClick(newIndex)}
                  handleCopy={handleCopyClick(newIndex)}
                  showMenu={menuState.menuId===item.id}
                  activeEdit={menuState.editId===item.id}
                />
              );
            }):
            <NoResult />
          }
        </section>
      </div>

    </div>

  );
};

export default History;
