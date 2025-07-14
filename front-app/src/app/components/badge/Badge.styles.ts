import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

const styles = StyleSheet.create({
  baseContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  baseText: {
    fontSize: 12,
    fontWeight: '600', 
    letterSpacing: 0.2,
  },
  defaultContainer: {
    backgroundColor: themeColors.primary,
    borderColor: 'transparent',
  },
  defaultText: {
    color: themeColors.primaryForeground,
  },
  secondaryContainer: {
    backgroundColor: themeColors.secondary,
    borderColor: 'transparent',
  },
  secondaryText: {
    color: themeColors.secondaryForeground,
  },
  destructiveContainer: {
    backgroundColor: themeColors.destructive,
    borderColor: 'transparent',
  },
  destructiveText: {
    color: themeColors.destructiveForeground,
  },
  outlineContainer: {
    borderColor: themeColors.foreground,
    backgroundColor: 'transparent',
  },
  outlineText: {
    color: themeColors.foreground,
  },
});

export default styles;
