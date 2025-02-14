import { configureStore } from "@reduxjs/toolkit";
import noteReducer from "@/redux/features/noteSlice";
import userReducer from "@/redux/features/userSlice";
import tagReducer from "@/redux/features/tagSlice";
import { noteApi } from "./services/notesApi";
import { userApi } from "./services/usersApi";
import { tagApi } from "./services/tagsApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    noteReducer,
    userReducer,
    tagReducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [tagApi.reducerPath]: tagApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      noteApi.middleware,
      userApi.middleware,
      tagApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
