export interface Client {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'in_route' | 'delivered' | 'canceled' | 'ready_for_pickup';

export interface Order {
  status: string;
  client: Client;
  id: number;
  customerName: string;
  address: string; 
  customer_phone: string;
  items?: OrderItem[];
  total: string;
  created_at: string;
  estimated_delivery: string;
  distance?: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  is_late: boolean;
  store: any;
  delivery_person: any;
  route: any;
}

// Para a navegação
export type RootStackParamList = {
  Login: undefined;
  Orders: undefined;
  Map: { order: Order };
  Dashboard: undefined;
  AdminPanel: undefined;
};
