import { StyleSheet, Platform } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pressableOverlay: { ...StyleSheet.absoluteFillObject },
  overlay: { flex: 1, backgroundColor: 'black' },
  content: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: themeColors.background,
    borderRadius: 12,
    padding: 24,
    ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
        android: { elevation: 10 },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    borderRadius: 99,
  },
  header: { gap: 6, marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 24 },
  title: { fontSize: 18, fontWeight: '600', color: themeColors.foreground, lineHeight: 24 },
  description: { fontSize: 14, color: themeColors.mutedForeground, lineHeight: 20 },
});
