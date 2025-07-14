import { StyleSheet } from 'react-native';

export const themeColors = {
  background: '#ffffff',
  foreground: '#09090b',
  input: '#e4e4e7',
  ring: '#2563eb',
  mutedForeground: '#71717a',
};

export const styles = StyleSheet.create({
  base: {
    minHeight: 80,
    width: '100%',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themeColors.input,
    backgroundColor: themeColors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: themeColors.foreground,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: themeColors.ring,
    borderWidth: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
