import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  footer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menu: {
    paddingVertical: 10,
  },
  menuItem: {
    paddingHorizontal: 10,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  menuButtonActive: {
    backgroundColor: '#007bff',
  },
  menuButtonText: {
    fontSize: 16,
    color: '#333',
  },
  menuButtonTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
