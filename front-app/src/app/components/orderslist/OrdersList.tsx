import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  UIManager,
  Platform,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { AutoSkeletonView } from '../auto-skeleton-view/AutoSkeletonView';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import type { Order } from '../../types';
import { RootStackParamList } from '../../navigation/navigation';
import { OrderCard } from '../order/OrderCard';
import { styles } from './OrdersList.styles';
import type { OrdersListProps } from './OrdersList.types';
import { Animated } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const placeholderOrder: Order = {
  id: 0,
  customerName: 'Carregando Cliente...',
  customer_phone: '(...).....-....',
  address: 'Carregando endereço do cliente, por favor aguarde um momento...',
  items: [],
  total: '0',
  status: 'pending',
  created_at: '',
  estimatedDelivery: '..:..',
  coordinates: { latitude: 0, longitude: 0 },
};


const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      let endpoint = '/orders';
      if (user?.role === 'delivery_person' && user.id) {
        endpoint = `/orders/delivery_person/${user.id}`;
      }
      const response = await api.get(endpoint);
      setOrders(response.data);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  const handleOrderSelect = (order: Order) => {
    console.log('Navigating to Map with order:', order.id);
    navigation.navigate('Map', { order });
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await api.patch(`/orders/${orderId}`, { order: { status: newStatus, delivery_person_id: user?.id } });
      fetchOrders();
    } catch (error) {
      console.error(`Erro ao atualizar status do pedido ${orderId}:`, error);
      // Tratar erro
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderSkeleton = () => (
    <Animated.View
      style={{
        width: '100%',
        height: 200,
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#E0E0E0',
        elevation: 2,
        opacity: opacityAnim,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#4B4B4B' }}>Carregando Pedido</Text>
          <Text style={{ fontSize: 14, color: '#4B4B4B' }}>Preparando</Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4B4B4B' }}>R$ Carregando...</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <ActivityIndicator size="small" color="#166534" />
            <Text style={{ fontSize: 14, color: '#166534', marginLeft: 4 }}>Carregando...</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <ActivityIndicator size="small" color="#166534" />
          <Text style={{ fontSize: 14, color: '#4B4B4B', marginLeft: 8 }}>Carregando Cliente...</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#166534" />
          <Text style={{ fontSize: 14, color: '#4B4B4B', marginLeft: 8, flex: 1 }}>
            Carregando endereço do cliente, por favor aguarde um momento...
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pedidos</Text>
          <Text style={styles.subtitle}>{user?.store_name}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.subtitle}>{user?.name}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <FlatList
          data={Array.from({ length: 3 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          removeClippedSubviews={false}
          renderItem={() => renderSkeleton()}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <OrderCard order={item} onOrderSelect={handleOrderSelect} onUpdateStatus={handleUpdateStatus} />
          )}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          ListEmptyComponent={<View><Text style={styles.title}>Nenhum pedido encontrado</Text></View>}
          extraData={orders}
        />
      )}
    </SafeAreaView>
  );
};

OrdersList.displayName = 'OrdersList';

export default OrdersList;
