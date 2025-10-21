import { createSlice } from '@reduxjs/toolkit';

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    checkoutData: null,
  },
  reducers: {
    setCheckoutData: (state, action) => {
      state.checkoutData = action.payload;
    },
  }
});

export const { setCheckoutData } = checkoutSlice.actions;

export default checkoutSlice.reducer;