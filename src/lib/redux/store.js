import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './loginForm';
import menuSlice from './menuItem';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productSlice from './products';
import checkoutSlice from './checkout';

// Define the root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  prod: productSlice,
  menu: menuSlice,
  checkout: checkoutSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    });
  }
});

// Persist the store
persistStore(store);

// Export the store
export { store };
