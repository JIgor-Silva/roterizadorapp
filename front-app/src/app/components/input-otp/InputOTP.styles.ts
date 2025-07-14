import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  hiddenInput: {
    width: 0,
    height: 0,
    position: 'absolute',
    opacity: 0,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slot: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    position: 'relative',
  },
  slotActive: {
    borderColor: '#2563eb',
    borderWidth: 2,
  },
  slotText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  slotInput: {
    ...StyleSheet.absoluteFillObject,
    color: 'transparent',
    textAlign: 'center',
    fontSize: 20,
  },
  separator: {
    marginHorizontal: 4,
  },
  separatorText: {
    fontSize: 24,
    color: '#6b7280',
    fontWeight: 'bold'
  },
});
