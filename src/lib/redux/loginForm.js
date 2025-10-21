import { createSlice } from '@reduxjs/toolkit';
import { logoutCookes } from '../api/axiosInstance';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLogin: false,
    token: '',
    userData: null,
    tempUserData: null,
  },
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload;
      localStorage.setItem('titanium-login', action.payload)
    },
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('titanium-token', action.payload)
    },
    setTempUserData: (state, action) => {
      state.tempUserData = action.payload;
    },
    handleLogin: (state, action) => {
      state.userData = action.payload
    },
    setLogout: (state, action) => {
      state.isLogin = false;
      localStorage.removeItem('titanium-token')
      localStorage.removeItem('titanium-login')
      state.tempUserData = null;
      state.token = '';
      state.userData = null;
      logoutCookes()
    }
  },
});

export const { setLogin, handleLogin,
  setPaymentDetail,
  setOrderData, setIsSubscribe, setWholeSaleData, setLogout, setToken, setTempUserData, setGiftCardData } = authSlice.actions;

export default authSlice.reducer;