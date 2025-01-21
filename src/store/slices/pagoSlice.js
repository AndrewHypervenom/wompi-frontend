import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  producto: null,
  datosPago: null,
  transaccion: null,
  error: null,
  loading: false
};

export const pagoSlice = createSlice({
  name: 'pago',
  initialState,
  reducers: {
    setProducto: (state, action) => {
      state.producto = action.payload;
    },
    setDatosPago: (state, action) => {
      state.datosPago = action.payload;
    },
    setTransaccion: (state, action) => {
      state.transaccion = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetEstado: (state) => {
      return initialState;
    }
  }
});

export const {
  setProducto,
  setDatosPago,
  setTransaccion,
  setLoading,
  setError,
  resetEstado
} = pagoSlice.actions;

export default pagoSlice.reducer;