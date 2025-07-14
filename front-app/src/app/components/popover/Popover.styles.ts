import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: themeColors.background,
    borderRadius: 5,
    padding: 10,
    shadowColor: themeColors.foreground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    width: 288,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themeColors.border,
    backgroundColor: themeColors.background,
    padding: 16,
    shadowColor: themeColors.foreground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
});
