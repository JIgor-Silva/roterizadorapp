import type { Order } from '../../types';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export interface OrdersListProps {
  orders: Order[];
  onOrderSelect: (order: Order) => void;
  onEndReached: (info: {
    distanceFromEnd: number;
  }) => void;
  loading: boolean;
}
