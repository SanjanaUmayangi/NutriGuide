// lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import foodReducer from './slices/foodSlice';
// import favouriteReducer from './slices/favouriteSlice';
// import calorieReducer from './slices/calorieSlice';
// import tipsReducer from './slices/tipsSlice';
// import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // foods: foodReducer,
    // favourites: favouriteReducer,
    // calories: calorieReducer,
    // tips: tipsReducer,
    // theme: themeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
