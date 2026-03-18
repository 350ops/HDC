import { useTheme } from './ThemeContext';

export const useThemeColors = () => {
  const { isDark } = useTheme();

  return {
    icon: isDark ? 'white' : 'black',
    bg: isDark ? '#0F172A' : '#ffffff',
    invert: isDark ? '#000000' : '#ffffff',
    secondary: isDark ? '#1E293B' : '#F1F5F9',
    state: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
    sheet: isDark ? '#1E293B' : '#ffffff',
    highlight: '#39A845',
    accent: '#2D8E38',
    lightDark: isDark ? '#1E293B' : 'white',
    border: isDark ? '#334155' : '#E2E8F0',
    text: isDark ? 'white' : '#0F172A',
    placeholder: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
    switch: isDark ? 'rgba(255,255,255,0.4)' : '#ccc',
    chatBg: isDark ? '#1E293B' : '#F1F5F9',
    isDark
  };
};

export default useThemeColors;