import type { Order } from '../types';
import type { BadgeProps } from '../components/badge/Badge';

type OrderStatusStyle = {
  text: string;
  variant: BadgeProps['variant'];
};

export const getStatusStyles = (status: Order['status']): OrderStatusStyle => {
  switch (status) {
    case 'ready_for_pickup':
      return { text: 'Pronto para Retirada', variant: 'secondary' };
    case 'pending':
      return { text: 'Pendente', variant: 'destructive' };
    case 'in_route':
      return { text: 'Entregando', variant: 'outline' };
    case 'delivered':
      return { text: 'Entregue', variant: 'secondary' };
    default:
      return { text: 'Pendente', variant: 'destructive' };
  }
};
