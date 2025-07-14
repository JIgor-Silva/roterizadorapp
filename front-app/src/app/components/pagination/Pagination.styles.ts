import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: themeColors.background,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: themeColors.accent,
    borderRadius: 5,
  },
  buttonText: {
    color: themeColors.accentForeground,
    fontSize: 16,
  },
  pageText: {
    fontSize: 18,
    color: themeColors.foreground,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkBase: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  linkActive: {
    backgroundColor: themeColors.primary,
  },
  linkGhost: {
    backgroundColor: 'transparent',
  },
  linkPressed: {
    opacity: 0.7,
  },
  linkText: {
    color: themeColors.foreground,
    fontSize: 14,
  },
  linkTextActive: {
    color: themeColors.primaryForeground,
  },
  prevNext: {
    paddingHorizontal: 16,
  },
  ellipsis: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
