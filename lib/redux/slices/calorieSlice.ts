// lib/redux/slices/calorieSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { setItem } from '../../utils/storage';

const slice = createSlice({
  name: 'calories',
  initialState: { items: [] as any[] },
  reducers: {
    addToTracker(state, action) {
      state.items.push(action.payload);
      setItem('tracker', state.items);
    },
    clearTracker(state) {
      state.items = [];
      setItem('tracker', state.items);
    },
    setTracker(state, action) {
      state.items = action.payload;
    }
  }
});

export const { addToTracker, clearTracker, setTracker } = slice.actions;
export default slice.reducer;
