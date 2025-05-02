// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../userSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// 👇 Các kiểu Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
