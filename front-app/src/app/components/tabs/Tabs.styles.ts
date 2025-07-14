import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    height: 40,
    backgroundColor: '#f1f5f9', 
    borderRadius: 8,
    padding: 4,
  },
  trigger: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  triggerActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  triggerTextActive: {
    color: '#020617',
  },
  content: {
    marginTop: 8,
  },
});
