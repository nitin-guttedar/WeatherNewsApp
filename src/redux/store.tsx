import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherSlice';
import newsReducer from './newsSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    news: newsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
