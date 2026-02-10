import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCaretUpFill, BsCheckLg } from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { DropdownProps } from "../../types/dropdown-type";
import { Virtuoso } from "react-virtuoso";
import { DEFAULT_FONT } from "@/constants/constant";

export const Item = ({ index,value,onClick,selectedValue }: { index: number, value: string, onClick: () => void, selectedValue: string }) => {

  return(
    <li key={index}>
      <button
        onClick={onClick}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-secondary dark:hover:text-white min-w-0 max-w-full truncate" style={{
          fontFamily: value
        }}
      >
        {value}
        {selectedValue === value && (
          <BsCheckLg className="inline-block w-4 h-4 ms-2" />
        )}
      </button>
    </li>
  );
};

export function SearchInput({ options, onSelect, selectedValue, isOpen, onToggle, dropUp }: DropdownProps) {

  console.log("SearchInput rendered with selectedValue:", selectedValue);
  const { t } = useTranslation();
  const [filter, setFilter] = useState("");

  const handleOptionClick = (value: string | number) => {
    onSelect(value);
    onToggle();
  };

  const filteredOptions = useMemo(() => options.filter(option =>
    t(option.label).toLowerCase().includes(filter.toLowerCase())
  ), [options, filter, t]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="font-light text-black dark:text-white bg-gray-300 dark:bg-secondary-light border-solid border-width-selected rounded-lg px-3 py-2.5 text-center inline-flex items-center border-gray-400 dark:border-tertiary-dark max-w-full truncate"
        type="button"
      >

        {selectedValue===DEFAULT_FONT ? t(DEFAULT_FONT) : selectedValue}
        <BsCaretUpFill
          className={`w-3 h-3 ms-3 transition-transform ${!isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-56 dark:bg-primary border-width-selected border-gray-300 dark:border-tertiary-dark mt-1 ${dropUp ? "-translate-y-[110%]" : ""}`}
        >
          <div className="p-2">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <FaMagnifyingGlass className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-secondary dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("search") + "..."}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-48 overflow-y-auto" style={{height:"200px"}}>

            <Virtuoso
              data={filteredOptions}
              style={{
                height:"100%"
              }}
              totalCount={filteredOptions.length}
              itemContent={(index, option) => <Item index={index} value={option.value as string===DEFAULT_FONT ? t(DEFAULT_FONT) : option.value as string} onClick={() => handleOptionClick(option.value as string)} selectedValue={selectedValue as string} />}

            />
            {/* {filteredOptions.map((option, index) => (
              <li key={index}>
                <button
                  onClick={() => handleOptionClick(option.value as string)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-secondary dark:hover:text-white min-w-0 max-w-full truncate" style={{
                    fontFamily: option.value as string
                  }}
                >
                  {t(option.label)}
                  {selectedValue === option.value && (
                    <BsCheckLg className="inline-block w-4 h-4 ms-2" />
                  )}
                </button>
              </li>
            ))} */}
          </ul>
        </div>
      )}
    </div>
  );
}
