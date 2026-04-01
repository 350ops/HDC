import { useTheme } from './ThemeContext';

export const useThemeColors = () => {
  const { isDark } = useTheme();

  return {
    // HMC palette
    icon: isDark ? '#FFFFFF' : '#0D131A',
    bg: isDark ? '#0D131A' : '#FFFFFF',
    invert: isDark ? '#000000' : '#ffffff',
    secondary: isDark ? '#1F2937' : '#F3F4F6',
    state: isDark ? 'rgba(255, 255, 255, 0.28)' : 'rgba(13, 19, 26, 0.22)',
    sheet: isDark ? '#1F2937' : '#FFFFFF',
    highlight: '#3AB24E',
    highlightAlt: '#139C50',
    lightDark: isDark ? '#1F2937' : '#FFFFFF',
    border: isDark ? 'rgba(255,255,255,0.14)' : '#E5E7EB',
    text: isDark ? '#FFFFFF' : '#0D131A',
    subtext: isDark ? '#9CA3AF' : '#6B7280',
    placeholder: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(13,19,26,0.40)',
    switch: isDark ? 'rgba(255,255,255,0.35)' : '#D1D5DB',
    chatBg: isDark ? '#111827' : '#F3F4F6',
    isDark
  };
};

export default useThemeColors;