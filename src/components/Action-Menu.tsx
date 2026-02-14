import { ActionMenuProps } from "@/types/action-menu.type";
import { BiSolidPencil } from "react-icons/bi";
import { CgTrash } from "react-icons/cg";
import { FaSave } from "react-icons/fa";
function ActionMenu({
  toggleMenu,
  handleDelete,
  disabledEdit,
  editText,
  handleEdit,
  handleSave,
  fixed
}: ActionMenuProps) {

  const handleOption = () => {
    if (editText && !disabledEdit) {
      handleSave();
    } else {
      handleEdit();
    }
  };

  const handleDeleteInternal=()=>{
    if (fixed) return;

    handleDelete();
  };

  const getIcon = () => {
    if (editText && !disabledEdit) {
      return (
        <FaSave
          className="text-gray-900 transition-scale duration-100 dark:text-gray-300 hover:scale-120 m-3"
        />
      );
    }

    return (
      <BiSolidPencil
        className="text-gray-900 transition-scale duration-100 dark:text-gray-300 hover:scale-120 m-3"
      />
    );
  };

  return (
    <div
      className={`flex flex-row gap-2 transition-all  duration-300 ease-in-out    ${
        toggleMenu ? "max-w-full opacity-100" : "max-w-0 opacity-0 "
      }`}
    >
      {/* Edit/Save Button */}
      {
        !disabledEdit && (
          <section
            className="bg-gray-200 dark:bg-secondary p-2 rounded-md hover:shadow-lg border-width-selected border-gray-300 dark:border-tertiary-dark hover:border-gray-400 hover:dark:border-tertiary  transition-border duration-200 flex items-center"
            onClick={handleOption}
          >
            {getIcon() }
          </section>
        )
      }

      {/* Delete Button */}

      {!editText &&
      <section className="bg-gray-200 dark:bg-secondary p-2  rounded-md hover:shadow-lg border-width-selected border-gray-300 dark:border-tertiary-dark hover:border-gray-400 hover:darK:border-tertiary transition-border duration-200 flex items-center">
        <CgTrash
          className="transition-[color,scale] duration-100 text-gray-900 dark:text-white hover:text-red-500 hover:dark:text-white m-3 hover:scale-135 scale-120 "
          onClick={handleDeleteInternal}
        />
      </section>
      }
    </div>
  );
}

export default ActionMenu;
