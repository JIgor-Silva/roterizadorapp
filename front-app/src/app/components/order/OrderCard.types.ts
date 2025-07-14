import type { Order } from '../../types';
import type { BadgeProps } from '../badge/Badge';

export interface OrderCardProps {
  order: Order;
  onOrderSelect: (order: Order) => void;
  onUpdateStatus: (orderId: number, newStatus: string) => void;
}

type OrderStatusStyle = {
  text: string;
  variant: BadgeProps['variant'];
};

export interface OrderCardComponentProps {
    order: Order;
    onOrderSelect: (order: Order) => void;
    onUpdateStatus: (orderId: number, newStatus: string) => void;
}
