import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "@/app/types/type-note";

interface NoteState {
  notes: Note[];
  noteDetail: Note | null;
  actived_modal_detail: boolean;
  actived_modal_create: boolean;
  actived_modal_update: boolean;
  id: string;
}
const initialState: NoteState = {
  notes: [],
  noteDetail: null,
  actived_modal_detail: false,
  actived_modal_create: false,
  actived_modal_update: false,
  id: "",
};

export const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    toggleModal: (
      state,
      action: PayloadAction<{
        modal: "detail" | "create" | "update";
        value: boolean;
      }>
    ) => {
      const { modal, value } = action.payload;
      switch (modal) {
        case "detail":
          state.actived_modal_detail = value;
          break;
        case "create":
          state.actived_modal_create = value;
          break;
        case "update":
          state.actived_modal_update = value;
          break;
        default:
          break;
      }
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },

    clearId: (state) => {
      state.id = "";
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
    },
    setNoteDetail: (state, action: PayloadAction<Note>) => {
      state.noteDetail = action.payload
    },
    clearNoteDetail: (state) => {
      state.noteDetail = null
    }
  },
});

export const { toggleModal, setId, clearId, setNotes, setNoteDetail, clearNoteDetail } = noteSlice.actions;

export default noteSlice.reducer;
