import { getHistoryItems } from "@/utils/store";
// This hook initializes the store and loads existing data into the state.
// It sets up the store reference and populates the data list and toggle actions.
// It should be used in components that need to access or modify the clipboard history.

export const  initStore =async (
) => {

  const storedData = await getHistoryItems();

  return {dataList:storedData};

};

