import { StyleSheet } from 'react-native';

export const themeColors = {
  background: '#ffffff',
  foreground: '#09090b',
  border: '#e4e4e7',
  primary: '#18181b',
  primaryForeground: '#fafafa',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
  destructive: '#ef4444',
  destructiveForeground: '#fafafa',
  success: '#16a34a',
};

export const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: themeColors.background,
    borderWidth: 1,
    borderColor: themeColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  destructiveToast: {
      backgroundColor: themeColors.destructive,
      borderColor: themeColors.destructive,
  },
  icon: {
      marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: themeColors.foreground,
  },
  description: {
    fontSize: 13,
    color: themeColors.mutedForeground,
    marginTop: 2,
  },
  destructiveText: {
      color: themeColors.destructiveForeground,
  },
  actionButton: {
      marginLeft: 16,
      backgroundColor: themeColors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
  },
  actionButtonText: {
      color: themeColors.primaryForeground,
      fontWeight: '500',
  }
});
