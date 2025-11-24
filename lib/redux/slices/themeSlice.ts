import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setItem } from '../../utils/storage';

interface ThemeState {
  current: 'light' | 'dark';
}

const initialState: ThemeState = {
  current: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.current = state.current === 'light' ? 'dark' : 'light';
      setItem('theme', state.current);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.current = action.payload;
      setItem('theme', state.current);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;