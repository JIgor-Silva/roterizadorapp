import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: themeColors.border,
  },
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
});
