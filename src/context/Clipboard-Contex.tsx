import { initStore, } from "@/hooks/useInitStore";
import { ItemClipboard } from "@/types/item-clipboard.type";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ClipboardCtx = {
  dataList: ItemClipboard[];
  setDataList: React.Dispatch<React.SetStateAction<ItemClipboard[]>>;
};

const ClipboardContext = createContext<ClipboardCtx | undefined>(undefined);

export const ClipboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataList, setDataList] = useState<ItemClipboard[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { dataList: initialData } = await initStore();
        if (!mounted) return;
        setDataList(initialData ?? []);
      } catch (e) {
        console.error("initStore failed", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ dataList, setDataList }),
    [dataList]
  );

  return <ClipboardContext.Provider value={value}>{children}</ClipboardContext.Provider>;
};

export const useClipboardContext = () => {
  const ctx = useContext(ClipboardContext);
  if (!ctx) throw new Error("useClipboardContext must be used inside ClipboardProvider");
  return ctx;
};
