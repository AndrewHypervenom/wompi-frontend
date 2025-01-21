import { configureStore } from '@reduxjs/toolkit';
import pagoReducer from './slices/pagoSlice';

export const store = configureStore({
  reducer: {
    pago: pagoReducer
  },
});