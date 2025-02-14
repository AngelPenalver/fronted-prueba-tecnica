import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Tag } from "@/app/types/type-tag";

interface TagState {
  tags: Tag[];
}
const initialState: TagState = {
  tags: [],
};

export const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    setTags: (state, action: PayloadAction<Tag[]>) => {
      state.tags = action.payload;
    },
  },
});

export const { setTags } = tagSlice.actions;

export default tagSlice.reducer;
