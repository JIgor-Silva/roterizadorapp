import { StyleSheet } from 'react-native';

export const themeColors = {
    background: '#ffffff',
    accent: '#f4f4f5',
    input: '#e4e4e7',
};

export const toggleVariants = {
    base: { alignItems: 'center' as 'center', justifyContent: 'center' as 'center', borderRadius: 6 },
    variants: {
        default: { backgroundColor: 'transparent', selected: { backgroundColor: themeColors.accent } },
        outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: themeColors.input, selected: { backgroundColor: themeColors.accent } },
    },
    sizes: {
        default: { height: 40, paddingHorizontal: 12 },
        sm: { height: 36, paddingHorizontal: 10 },
        lg: { height: 44, paddingHorizontal: 16 },
    },
};

export const styles = StyleSheet.create({
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
