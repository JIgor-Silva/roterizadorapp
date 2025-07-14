import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';
import { themeColors } from '../../styles/theme';
import { Side } from './Sheet.types';

type SheetStyles = {
  overlay: ViewStyle;
  contentBase: ViewStyle;
  closeButton: ViewStyle;
  header: ViewStyle;
  footer: ViewStyle;
  title: TextStyle;
  description: TextStyle;
} & { [key in Side]: ViewStyle }; 

export const styles = StyleSheet.create<SheetStyles>({
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  contentBase: {
    position: 'absolute',
    backgroundColor: themeColors.background,
    padding: 24,
    gap: 16,
    ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: -2, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
        android: { elevation: 20 },
    }),
  },
  top: { top: 0, left: 0, right: 0, borderBottomWidth: 1, borderColor: themeColors.border },
  bottom: { bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderColor: themeColors.border },
  left: { left: 0, top: 0, bottom: 0, height: '100%', width: '75%', maxWidth: 400, borderRightWidth: 1, borderColor: themeColors.border },
  right: { right: 0, top: 0, bottom: 0, height: '100%', width: '75%', maxWidth: 400, borderLeftWidth: 1, borderColor: themeColors.border },
  closeButton: { position: 'absolute', top: 16, right: 16, padding: 4, borderRadius: 99 },
  header: { gap: 4, paddingBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingTop: 16 },
  title: { fontSize: 18, fontWeight: '600', color: themeColors.foreground },
  description: { fontSize: 14, color: themeColors.mutedForeground, marginTop: 4 },
});
