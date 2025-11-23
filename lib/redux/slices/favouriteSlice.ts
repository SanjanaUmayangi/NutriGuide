// // lib/redux/slices/favouriteSlice.ts
// import { createSlice } from '@reduxjs/toolkit';
// import { setItem, getItem } from '../../utils/storage';

// const slice = createSlice({
//   name: 'favourites',
//   initialState: { items: [] as any[] },
//   reducers: {
//     addFavourite(state, action) {
//       state.items.push(action.payload);
//       setItem('favourites', state.items);
//     },
//     removeFavourite(state, action) {
//       state.items = state.items.filter(i => i.name !== action.payload);
//       setItem('favourites', state.items);
//     },
//     setFavourites(state, action) {
//       state.items = action.payload;
//     }
//   }
// });

// export const { addFavourite, removeFavourite, setFavourites } = slice.actions;
// export default slice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setItem, getItem } from '../../utils/storage';
import { FoodItem } from '../../../types/food';

interface FavouriteState {
  items: FoodItem[];
}

const initialState: FavouriteState = {
  items: [],
};

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    // Add to favourites
    addFavourite: (state, action: PayloadAction<FoodItem>) => {
      const existingItem = state.items.find(item => item.name === action.payload.name);
      if (!existingItem) {
        state.items.push(action.payload);
        setItem('favourites', state.items);
      }
    },
    
    // Remove from favourites
    removeFavourite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.name !== action.payload);
      setItem('favourites', state.items);
    },
    
    // Clear all favourites
    clearFavourites: (state) => {
      state.items = [];
      setItem('favourites', state.items);
    },
    
    // Load favourites from storage (for app startup)
    setFavourites: (state, action: PayloadAction<FoodItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { 
  addFavourite, 
  removeFavourite, 
  clearFavourites, 
  setFavourites 
} = favouriteSlice.actions;

export default favouriteSlice.reducer;