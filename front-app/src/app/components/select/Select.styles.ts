import { StyleSheet, Platform } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  trigger: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themeColors.input,
    backgroundColor: themeColors.background,
    paddingHorizontal: 12,
  },
  valueText: {
    fontSize: 16,
    color: themeColors.foreground,
  },
  placeholderText: {
    color: themeColors.mutedForeground,
  },
  contentContainer: {
    maxHeight: 384,
    minWidth: 250,
    backgroundColor: themeColors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: themeColors.border,
    padding: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 14,
    color: themeColors.foreground,
    flex: 1,
  },
  itemIndicator: {
    position: 'absolute',
    left: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '600',
    color: themeColors.mutedForeground,
  },
  separator: {
    height: 1,
    backgroundColor: themeColors.input,
    marginVertical: 4,
  },
});
