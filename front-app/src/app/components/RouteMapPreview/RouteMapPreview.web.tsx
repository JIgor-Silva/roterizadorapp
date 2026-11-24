import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouteDetails, RouteDetails, LatLng } from './useRouteDetails';

export interface RouteMapPreviewProps {
  orderId: number;
}

function buildLeafletHtml(details: RouteDetails, coords: LatLng[]): string {
  return `
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      html,body,#map{margin:0;height:100%;}
    </style>
    <div id="map"></div>
    <script>
      const route = ${JSON.stringify(coords.map((c) => [c.latitude, c.longitude]))};
      const origin = [${details.origin_latitude}, ${details.origin_longitude}];
      const dest = [${details.destination_latitude}, ${details.destination_longitude}];
      const map = L.map('map', { zoomControl: false });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
      L.circleMarker(origin, { radius: 7, color: '#22c55e', fillOpacity: 1 }).addTo(map).bindTooltip('Loja');
      L.circleMarker(dest, { radius: 7, color: '#ef4444', fillOpacity: 1 }).addTo(map).bindTooltip('Cliente');
      if (route.length > 0) { 
        const line = L.polyline(route, { color: '#3b82f6', weight: 4 }).addTo(map); 
        map.fitBounds(line.getBounds(), { padding: [20, 20] }); 
      } else { 
        map.fitBounds([origin, dest], { padding: [20, 20] }); 
      }
    </script>
  `;
}

export default function RouteMapPreview({ orderId }: RouteMapPreviewProps) {
  const { details, coords, loading, error } = useRouteDetails(orderId);
  const html = useMemo(() => (details ? buildLeafletHtml(details, coords) : ''), [details, coords]);

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
      {React.createElement('iframe', { srcDoc: html, title: 'Rota do pedido', style: { border: 0, width: '100%', height: 220 } })}
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
    overflow: 'hidden',
  },
  info: {
    color: '#d1d5db',
    fontSize: 13,
    paddingVertical: 8,
    textAlign: 'center',
  },
  error: {
    color: '#f87171',
    marginTop: 12,
    textAlign: 'center',
  },
  loading: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
