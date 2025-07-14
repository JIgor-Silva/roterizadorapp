import { StyleSheet, Platform } from 'react-native';
import { themeColors } from '../../styles/theme';

export const styles = StyleSheet.create({
    contentContainer: {
        minWidth: 220,
        backgroundColor: themeColors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: themeColors.border,
        padding: 4,
        ...Platform.select({
          ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
          android: { elevation: 5 },
        }),
    },
    menuOption: {
        borderRadius: 6,
    },
    item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10, borderRadius: 6 },
    itemText: { fontSize: 14, color: themeColors.primaryForeground, flex: 1 },
    itemInset: { paddingLeft: 32 },
    itemIndicator: { position: 'absolute', left: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
    subTrigger: { justifyContent: 'space-between' },
    label: { paddingHorizontal: 8, paddingVertical: 6, fontSize: 12, fontWeight: '600', color: themeColors.primaryForeground },
    separator: { height: 1, backgroundColor: themeColors.mutedForeground, marginVertical: 4, marginHorizontal: -4 },
    shortcut: { marginLeft: 'auto', fontSize: 12, color: themeColors.mutedForeground },
});
