import { useAppSelector } from '../lib/redux/hooks';
import lightTheme from '../lib/themes/light';
import darkTheme from '../lib/themes/dark';

export default function useTheme() {
  const { current: themeName } = useAppSelector(state => state.theme);
  
  const theme = themeName === 'dark' ? darkTheme : lightTheme;
  const isDark = themeName === 'dark';
  
  return {
    theme,
    isDark,
    themeName,
  };
}