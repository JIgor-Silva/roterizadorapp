import { StyleSheet } from 'react-native';

export const themeColors = {
  border: '#e4e4e7',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
};

export const styles = StyleSheet.create({
  tableWrapper: { width: '100%' },
  table: { width: '100%', minWidth: '100%' },
  header: { borderBottomWidth: 1, borderColor: themeColors.border },
  footer: { borderTopWidth: 1, borderColor: themeColors.border, backgroundColor: themeColors.muted },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: themeColors.border },
  rowPressed: { backgroundColor: themeColors.muted },
  rowSelected: { backgroundColor: themeColors.muted },
  rowLast: { borderBottomWidth: 0 },
  cell: { padding: 16, alignItems: 'flex-start', justifyContent: 'center' },
  head: { height: 48 },
  headText: { fontSize: 12, fontWeight: '500', color: themeColors.mutedForeground },
  cellText: { fontSize: 14, color: '#09090b' },
  caption: { marginTop: 16, fontSize: 14, color: themeColors.mutedForeground },
});
