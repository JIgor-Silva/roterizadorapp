import type { Order } from '../../types';
import type { BadgeProps } from '../badge/Badge';

type OrderStatusStyle = {
  text: string;
  variant: BadgeProps['variant'];
};

export const getStatusStyles = (order: Order): OrderStatusStyle => {
  if (!order || !order.status) {
    console.warn(`Pedido ou status indefinido: ${order}`);
    return { text: 'Desconhecido', variant: 'default' };
  }

  if (order.is_late) {
    return { text: 'Atrasado', variant: 'destructive' };
  }

  switch (order.status) {
    case 'pending':
      return { text: 'Pendente', variant: 'default' };
    case 'ready_for_pickup':
      return { text: 'Pronto para Retirada', variant: 'default' };
    case 'in_route':
      return { text: 'Em Rota', variant: 'outline' };
    case 'delivered':
      return { text: 'Entregue', variant: 'secondary' };
    case 'canceled':
      return { text: 'Cancelado', variant: 'destructive' };
    default:
      console.warn(`Status desconhecido para o pedido ${order.id}: ${order.status}`);
      return { text: 'Desconhecido', variant: 'default' };
  }
};
