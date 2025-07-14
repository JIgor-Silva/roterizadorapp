import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tooltipContainer: {
    backgroundColor: 'transparent',
  },
  arrow: {
    width: 0,
    height: 0,
  },
  content: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  contentText: {
    color: '#f9fafb',
    fontSize: 14,
  },
});
