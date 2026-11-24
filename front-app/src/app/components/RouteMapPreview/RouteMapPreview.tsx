import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRouteDetails } from './useRouteDetails';

export interface RouteMapPreviewProps {
  orderId: number;
}

export default function RouteMapPreview({ orderId }: RouteMapPreviewProps) {
  const { details, coords, loading, error } = useRouteDetails(orderId);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (coords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 30, right: 30, bottom: 30, left: 30 },
        animated: true
      });
    }
  }, [coords]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  if (error || !details) {
    return (
      <Text style={styles.error}>
        {error ?? 'Rota indisponível.'}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: details.origin_latitude,
          longitude: details.origin_longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
      >
        <Marker
          coordinate={{ latitude: details.origin_latitude, longitude: details.origin_longitude }}
          title="Loja"
          pinColor="green"
        />
        <Marker
          coordinate={{ latitude: details.destination_latitude, longitude: details.destination_longitude }}
          title="Cliente"
        />
        {coords.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeColor="#3b82f6"
            strokeWidth={4}
          />
        )}
      </MapView>
      <Text style={styles.info}>
        {(details.distance / 1000).toFixed(1)} km · {Math.round(details.duration / 60)} min
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden'
  },
  map: {
    width: '100%',
    height: 220
  },
  info: {
    color: '#d1d5db',
    fontSize: 13,
    paddingVertical: 8,
    textAlign: 'center'
  },
  error: {
    color: '#f87171',
    marginTop: 12,
    textAlign: 'center'
  },
  loading: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
