import { StyleSheet } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  handleIndicator: { backgroundColor: themeColors.mutedForeground },
  bottomSheetBackground: { backgroundColor: themeColors.background, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  contentContainer: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e4e4e7', marginTop: 'auto' },
  title: { fontSize: 18, fontWeight: '600', color: themeColors.foreground, textAlign: 'center' },
  description: { fontSize: 14, color: themeColors.mutedForeground, textAlign: 'center', marginTop: 4 },
});
