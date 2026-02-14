import { ItemClipboard } from "@/types/item-clipboard.type";
import { newItemPayload } from "@/types/new-item-payload";
import { normalizeString } from "./string";

export function alreadyExists(array: ItemClipboard[], text: string): boolean {
  const normalizedText = normalizeString(text);
  return array.some(item => item.value === normalizedText && item.type === "text");
}

export function getIndexByValue(array: ItemClipboard[], text: string): number {
  const normalizedText = normalizeString(text);
  return array.findIndex(item => item.value === normalizedText && item.type === "text");
}

export function getOtherIndexEqual(array: ItemClipboard[],text:string, index: number): number {

  const normalizedText = normalizeString(text);
  return array.findIndex((item, idx)=> item.value === normalizedText &&  idx !== index) ;

}

export function addUnique(array: ItemClipboard[], text: string): ItemClipboard[] {

  const newItem: ItemClipboard = {
    id: window.crypto.randomUUID(),
    value: normalizeString(text),
    type: "text",
    path: "",
    fixed: false,
  };

  if (!alreadyExists(array, text)) {
    return [...array, newItem];
  }

  return array;
}

export function add(array: ItemClipboard[], item: newItemPayload): ItemClipboard[] {

  const newItemClipboard: ItemClipboard = {
    id:  item.id,
    value: normalizeString(item.value),
    type: item.type,
    path: item.path,
    fixed: false,
  };

  return [...array, newItemClipboard];
}
