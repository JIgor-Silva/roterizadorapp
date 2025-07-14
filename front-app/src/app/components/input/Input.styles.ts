import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    shadowColor: 'transparent',
    elevation: 0,
  },
  base: {
    height: 44,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themeColors.input,
    backgroundColor: themeColors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: themeColors.foreground,
  },
  focused: {
    borderColor: themeColors.ring,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  placeholderTextColor: {
    color: themeColors.mutedForeground,
  },
});
