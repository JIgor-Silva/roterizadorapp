import { StyleSheet } from 'react-native';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

export const styles = StyleSheet.create({
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    shadowColor: 'transparent',
    elevation: 0,
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 14,
  },
  textGray: {
    color: '#ffffff',
    fontSize: 13,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    height: 36,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingHorizontal: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  loadingCard: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 192,
    borderRadius: 24,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deliveryText: {
    fontSize: 12,
    color: '#fff',
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  actionButtonBg1: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#34d399',
    opacity: 0.5,
  },
  actionButtonBg2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#10b981',
    opacity: 0.5,
  },
  statusBadge: {
    marginTop: 10, // ou experimente 6, 8 etc. para mais espaçamento
    backgroundColor: '#ffffff'
  },
});
