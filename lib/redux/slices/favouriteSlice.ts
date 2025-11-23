// lib/redux/slices/favouriteSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { setItem, getItem } from '../../utils/storage';

const slice = createSlice({
  name: 'favourites',
  initialState: { items: [] as any[] },
  reducers: {
    addFavourite(state, action) {
      state.items.push(action.payload);
      setItem('favourites', state.items);
    },
    removeFavourite(state, action) {
      state.items = state.items.filter(i => i.name !== action.payload);
      setItem('favourites', state.items);
    },
    setFavourites(state, action) {
      state.items = action.payload;
    }
  }
});

export const { addFavourite, removeFavourite, setFavourites } = slice.actions;
export default slice.reducer;
