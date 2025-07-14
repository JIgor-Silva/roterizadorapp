import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181b',
    marginBottom: 8,
  },
  formLabelError: {
    color: themeColors.destructive,
  },
  formControlError: {
    borderColor: themeColors.destructive,
  },
  formDescription: {
    fontSize: 12,
    color: themeColors.mutedForeground,
    marginTop: 4,
  },
  formMessage: {
    fontSize: 12,
    fontWeight: '500',
    color: themeColors.destructive,
    marginTop: 4,
  },
});
