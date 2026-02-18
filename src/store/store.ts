import { configureStore } from "@reduxjs/toolkit";
import equipperReducer from "./slices/equipperSlice";

export const store = configureStore({
  reducer: {
    equipper: equipperReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
