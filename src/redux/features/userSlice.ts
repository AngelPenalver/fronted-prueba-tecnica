"use client"; 
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userData: {
    userId: string;
    email: string;
    token: string;
  };
}

const initialState: UserState = {
  userData: { userId: "", email: "", token: "" },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<{ userId: string; email: string; token: string }>
    ) => {
      state.userData = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("userData", JSON.stringify(action.payload));
      }
    },
    clearUserData: (state) => {
      state.userData = { userId: "", email: "", token: "" };
      if (typeof window !== "undefined") {
        localStorage.removeItem("userData");
      }
    },
    initializeUserData: (state) => {
      if (typeof window !== "undefined") {
        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          state.userData = JSON.parse(storedUserData);
        }
      }
    },
  },
});

export const { setUserData, clearUserData, initializeUserData } =
  userSlice.actions;

export default userSlice.reducer;