import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/navigation';
import api from '../api/api';

interface RouteDetails {
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  polyline: number[][];
  distance: number;
  duration: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Map'>;
type RouteProps = RouteProp<RootStackParamList, 'Map'>;

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const order = route.params.order;
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!order?.id) {
        setError('ID do pedido não encontrado.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/orders/${order.id}/route_details`);
        setRouteDetails(response.data);
      } catch (e: any) {
        setError(e.message || 'Não foi possível carregar os detalhes da rota.');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [order?.id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  if (error || !routeDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Erro de Rota</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error || 'Não foi possível carregar os detalhes da rota.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${routeDetails.destination_longitude - 0.03}%2C${routeDetails.destination_latitude - 0.02}%2C${routeDetails.destination_longitude + 0.03}%2C${routeDetails.destination_latitude + 0.02}&layer=mapnik&marker=${routeDetails.destination_latitude}%2C${routeDetails.destination_longitude}`;
  const deliveryFee = (routeDetails.distance / 1000) * 2.25;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Pedido #{order.id}</Text>
          <Text style={styles.headerSubtitle}>{order.client?.name}</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        {React.createElement('iframe', {
          src: mapSrc,
          title: 'Mapa da entrega',
          style: { border: 0, width: '100%', height: '100%' },
        })}
      </View>
      <View style={styles.bottomSheet}>
        <Text style={styles.textWhite}>
          {((routeDetails.distance || 0) / 1000).toFixed(2)} km · {Math.round((routeDetails.duration || 0) / 60)} min · Taxa R$ {deliveryFee.toFixed(2)}
        </Text>
        <Text style={[styles.textWhite, { fontWeight: 'bold', fontSize: 18 }]}>
          Total R$ {(Number(order.total) || 0).toFixed(2)}
        </Text>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${routeDetails.destination_latitude},${routeDetails.destination_longitude}`
            )
          }
        >
          <Text style={styles.navButtonText}>Abrir no Google Maps</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#d1d5db' },
  mapContainer: { flex: 1 },
  bottomSheet: { padding: 16, gap: 12 },
  textWhite: { color: '#fff', fontSize: 14 },
  navButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorMessage: { color: '#ef4444', fontSize: 16, textAlign: 'center' },
});

export default MapScreen;
