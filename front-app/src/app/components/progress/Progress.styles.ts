import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    height: 10,
    width: '100%',
    backgroundColor: themeColors.accent,
    borderRadius: 5,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: themeColors.primary,
  },
});
