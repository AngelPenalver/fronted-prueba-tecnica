import { Tag } from "./type-tag";

export type Note = {
    id: string;
    description: string;
    title: string | null;
    archived:boolean;
    createAt: Date;
    updateAt: Date;
    tag: Tag;
    userId: string;
    delete: Date;
  };

  export type NoteForm = {
    userId: string;
    description: string;
    title?: string;
    tag_name?: string;
  }
  