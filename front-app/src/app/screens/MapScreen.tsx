import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigation';
import api from '../api/api'; 
import { Linking, Platform } from 'react-native';

interface RouteDetails {
  id: number;
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  glassEffect: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1 },
  textWhite: { color: '#ffffff', fontSize: 14 },
  textGray: { color: '#9ca3af', fontSize: 12 },
  routeInfoText: { color: '#000000', fontSize: 14 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, backgroundColor: '#0f172a' },
  backButton: { padding: 8, borderRadius: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: '#d1d5db' },
  mapContainer: { flex: 1, position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  routeInfoOverlay: { position: 'absolute', top: 9, left: 16, right: 16 },
  card: { borderRadius: 6, padding: 12 },
  routeStat: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bottomSheet: { padding: 16, gap: 16},
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingBottom: 8 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  detailsGrid: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginVertical: 12 },
  detailItem: { alignItems: 'center', gap: 6 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
  navButton: { flexDirection: 'row', height: 52, width: '100%', borderRadius: 12, justifyContent: 'center', alignItems: 'center', gap: 8 },
  navButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 10 },
  errorMessage: { color: '#ef4444', fontSize: 16, textAlign: 'center' },
});

const MapScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const order = route.params.order;

  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [polylineCoords, setPolylineCoords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!order?.id) {
        setError('ID do pedido não encontrado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/orders/${order.id}/route_details`);
        const data: RouteDetails = response.data;
        setRouteDetails(data);

        if (data.polyline && data.polyline.length > 0) {
          const coords = data.polyline.map(([longitude, latitude]) => ({
            latitude,
            longitude,
          }));
          setPolylineCoords(coords);
        }
      } catch (e: any) {
        console.error("Erro ao buscar detalhes da rota:", e);
        setError(e.message || 'Não foi possível carregar os detalhes da rota.');
      } finally {
        setLoading(false);
      }
    };

    fetchRouteDetails();
  }, [order?.id]);

  useEffect(() => {
    if (routeDetails && polylineCoords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(polylineCoords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [routeDetails, polylineCoords]);

  const handleStartNavigation = () => {
    if (routeDetails) {
      const destinationLat = routeDetails.destination_latitude;
      const destinationLon = routeDetails.destination_longitude;
      let url = '';

      if (Platform.OS === 'ios') {
        url = `maps://app?daddr=${destinationLat},${destinationLon}&dirflg=d`;
      } else {
        url = `https://www.google.com/maps/dir/?api=1&destination=${destinationLat},${destinationLon}`;
      }

      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }
  };

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
        <View style={[styles.header, styles.glassEffect]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Erro de Rota</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-triangle" size={50} color="#ef4444" />
          <Text style={styles.errorMessage}>{error || 'Não foi possível carregar os detalhes da rota.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const deliveryFee = (routeDetails.distance / 1000) * 2.25;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, styles.glassEffect]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Pedido #{order.id}</Text>
          <Text style={styles.headerSubtitle}>{order.client.name}</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <MapView ref={mapRef} style={styles.map} mapType="satellite" initialRegion={{
            latitude: routeDetails.origin_latitude,
            longitude: routeDetails.origin_longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }}>
          <Marker coordinate={{ latitude: routeDetails.origin_latitude, longitude: routeDetails.origin_longitude }} title="Loja" pinColor="green" />
          <Marker coordinate={{ latitude: routeDetails.destination_latitude, longitude: routeDetails.destination_longitude }} title="Cliente" description={order.address} pinColor="red" />
          {polylineCoords.length > 0 && <Polyline coordinates={polylineCoords} strokeColor="#007BFF" strokeWidth={4} />}
        </MapView>
        <View style={styles.routeInfoOverlay}>
          <View style={[styles.card, styles.glassEffect, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={styles.routeStat}>
              <Feather name="navigation" size={20} color="#0D0D0D" />
              <View>
                <Text style={styles.routeInfoText}>{((routeDetails.distance || 0) / 1000).toFixed(2)} km</Text>
                <Text style={[styles.textGray, { color: '#0D0D0D' }]}>Distância</Text>
              </View>
            </View>
            <View style={styles.routeStat}>
              <Feather name="clock" size={20} color="#0D0D0D" />
              <View>
                <Text style={styles.routeInfoText}>{Math.round((routeDetails.duration || 0) / 60)} min</Text>
                <Text style={[styles.textGray, { color: '#0D0D0D' }]}>Duração</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.bottomSheet, styles.glassEffect]}>
        <View style={[styles.card, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
          <View style={styles.cardHeader}>
            <Feather name="file-text" size={20} color="#34d399" />
            <Text style={styles.cardTitle}>Detalhes da Entrega</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Feather name="navigation" size={16} color="#9ca3af" />
              <Text style={styles.textWhite}>{((routeDetails.distance || 0) / 1000).toFixed(2)} km</Text>
              <Text style={styles.textGray}>Distância</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="clock" size={16} color="#9ca3af" />
              <Text style={styles.textWhite}>{Math.round((routeDetails.duration || 0) / 60)} min</Text>
              <Text style={styles.textGray}>Duração</Text>
            </View>
            <View style={styles.detailItem}>
              <Feather name="dollar-sign" size={16} color="#9ca3af" />
              <Text style={styles.textWhite}>R$ {deliveryFee.toFixed(2)}</Text>
              <Text style={styles.textGray}>Taxa de Entrega</Text>
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.textGray}>Total do Pedido:</Text>
            <Text style={[styles.textWhite, { fontSize: 18, fontWeight: 'bold' }]}>R$ {(Number(order.total) || 0).toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleStartNavigation}>
          <View style={[styles.navButton, {position: 'relative', overflow: 'hidden'}]}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#34d399', opacity: 0.5 }} />
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#10b981', opacity: 0.5 }} />
            <Feather name="navigation" size={22} color="#fff" />
            <Text style={styles.navButtonText}>Gerar Rota no seu Mapa</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

MapScreen.displayName = "MapScreen";

export default MapScreen;
