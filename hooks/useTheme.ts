import { useAppSelector, useAppDispatch } from '../lib/redux/hooks';
import { toggleTheme } from '../lib/redux/slices/themeSlice';

export default function useTheme() {
  const dispatch = useAppDispatch();
  const { current: themeName } = useAppSelector(state => state.theme);
  
  const theme = themeName === 'dark' ? 
    require('../lib/themes/dark').default : 
    require('../lib/themes/light').default;
  
  const isDark = themeName === 'dark';
  
  const toggleThemeMode = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    isDark,
    themeName,
    toggleTheme: toggleThemeMode,
  };
}