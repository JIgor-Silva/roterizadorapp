import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Order, OrderStatus } from '../types/index';
import { getStatusStyles } from '../components/order/OrderCard.helpers';
import { Badge } from '../components/badge/Badge';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import DashboardStats from './DashboardStats';
import WeatherDisplay from '../components/WeatherDisplay/WeatherDisplay';
import { WeatherDisplayProps } from '../components/WeatherDisplay/WeatherDisplay.types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const DashboardScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const navigation = useNavigation<NavigationProp>();
  const { logout, user } = useAuth();

  const urgentClient = useMemo(() => {
    return orders.find(order => order.status === 'in_route' && order.coordinates?.latitude && order.coordinates?.longitude);
  }, [orders]);

  console.log('User role:', user?.role);
  console.log('Orders loaded:', orders);
  
  console.log('Status counts:', {
    all: orders.length,
    in_route: orders.filter(o => o.status === 'in_route').length,
    canceled: orders.filter(o => o.status === 'canceled').length,
    delivered: orders.filter(o => o.status === 'delivered').length
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const endpoint = user?.role === 'delivery_person' ? `/orders/delivery_person/${user.id}` : '/orders';
        const response = await api.get(endpoint);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, [user]);
  
  const handleLogout = () => {
    logout();
  };

  const filteredOrders = useMemo(() => {
    if (!user || !orders.length) return [];
    
    if (selectedStatus === 'all') {
      return orders;
    }
    
    return orders.filter(order => order.status === selectedStatus);
  }, [orders, selectedStatus, user]);

  const statusTranslations: { [key in OrderStatus | 'all']: string } = {
    all: 'Todos',
    pending: 'Pendentes',
    in_route: 'Em Rota',
    delivered: 'Entregues',
    canceled: 'Cancelados',
    ready_for_pickup: 'Pronto para Retirada',
  };

  const getListHeader = () => {
    if (user?.role === 'delivery_person' && selectedStatus === 'all') {
      return 'Pedidos Prontos para Retirada';
    }
    return `Pedidos ${statusTranslations[selectedStatus]}`;
  };

  const renderOrderItem = (order: Order) => {
    const status = getStatusStyles(order);
    const deliveryPersonName = order.delivery_person?.email.split('.')[0] || 'N/A';

    return (
      <View key={order.id} style={[styles.orderCard, styles.glassEffect]}>
        <View style={styles.orderCardTop}>
          <View style={styles.orderMainInfo}>
            <Text style={styles.orderId}>Pedido #{order.id}</Text>
            <View style={styles.detailItem}>
              <Feather name="user" size={14} color="#d1d5db" />
              <Text style={styles.customerName}>{order.client.name}</Text>
            </View>
          </View>
          <View style={styles.orderStatusInfo}>
            <Badge variant={status.variant}>{status.text}</Badge>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.detailItem}>
            <Feather name="shopping-bag" size={14} color="#9ca3af" />
            <Text style={styles.storeName}>Loja: {order.store.name}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="truck" size={14} color="#9ca3af" />
            <Text style={styles.deliveryPerson}>Entregador: {deliveryPersonName}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="map-pin" size={14} color="#9ca3af" />
            <Text style={styles.storeName} numberOfLines={1}>Destino: {order.client.address}</Text>
          </View>
        </View>

        {(user?.role === 'delivery_person' || user?.role === 'admin') && order.status === 'in_route' && (
          <TouchableOpacity style={styles.viewRouteButton} onPress={() => navigation.navigate('Map', { order })}>
            <Feather name="navigation" size={16} color="#fff" />
            <Text style={styles.viewRouteButtonText}>Ver Rota</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{color: '#fff', marginTop: 10}}>Carregando dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerWelcome}>Bem-vindo,</Text>
          <Text style={styles.headerUserName}>{user?.name?.split('.')[0] || 'Usuário'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <DashboardStats user={user} orders={orders} onSelectStatus={setSelectedStatus} />
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 0 }}>
        <WeatherDisplay clientLocation={urgentClient?.coordinates} clientOrderId={urgentClient?.id} clientName={urgentClient?.client.name} />
      </View>

      <Text style={[styles.listHeader, { paddingHorizontal: 16 }]}>
        {getListHeader()}
      </Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredOrders.length === 0 && !isLoading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum pedido encontrado</Text>
            </View>
          ) : null}
          {filteredOrders.map(renderOrderItem)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40, paddingHorizontal: 16 },
  glassEffect: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)', borderWidth: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerWelcome: {
    fontSize: 16,
    color: '#9ca3af',
  },
  headerUserName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 16, color: '#9ca3af', marginTop: 4 },
  logoutButtonText: { color: '#fff' },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
    minHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 12
  },
  statCard: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', gap: 8 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#9ca3af' },
  listHeader: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 8, marginTop: 16 },
  orderCard: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 10,
  },
  orderCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderMainInfo: { flex: 1, gap: 4 },
  orderId: { color: '#fff', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
  customerName: { color: '#d1d5db', fontSize: 14 },
  storeName: { color: '#9ca3af', fontSize: 14 },
  orderStatusInfo: { alignItems: 'flex-end' },
  deliveryPerson: { color: '#9ca3af', fontSize: 14 },
  orderDetails: {
    gap: 8,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distance: { color: '#9ca3af', fontSize: 12 },
  lateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  lateText: { color: '#fef2f2', fontSize: 10, fontWeight: '600' },
  viewRouteButton: {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#34d399',
    marginTop: 5,
  },
  viewRouteButtonText: {
    color: '#fff', 
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default DashboardScreen;
