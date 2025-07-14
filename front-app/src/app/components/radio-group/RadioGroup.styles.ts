import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: themeColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: themeColors.primary,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: themeColors.background,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: themeColors.foreground,
  },
  groupContainer: {
    gap: 8,
  },
  item: {
    height: 20,
    width: 20,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: themeColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSelected: {
    borderColor: themeColors.primary,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 999,
    backgroundColor: themeColors.primary,
  },
});
