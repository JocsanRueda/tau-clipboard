import { BaseContentFileProps } from "./base-content-file.type";
import { fileType } from "./file.type";

/* eslint-disable no-unused-vars */
export type ContentCardProps   = BaseContentFileProps & {
  fixed: boolean;
  showMenu:boolean;
  activeEdit:boolean;
  type:fileType;
  handleMenu: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
  handleSave: (newText: string) => void;
  handleFixed: () => void;
  handleCopy: (text?: string) => void;

}
