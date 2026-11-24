import { useEffect, useState } from 'react';
import api from '../../api/api';

export interface RouteDetails {
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  polyline: number[][];
  distance: number;
  duration: number;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export function useRouteDetails(orderId: number) {
  const [details, setDetails] = useState<RouteDetails | null>(null);
  const [coords, setCoords] = useState<LatLng[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchRouteDetails = async () => {
      try {
        const response = await api.get<RouteDetails>(`/orders/${orderId}/route_details`);
        if (active) {
          setDetails(response.data);
          setCoords(response.data.polyline.map(point => ({
            latitude: point[1],
            longitude: point[0]
          })));
          setLoading(false);
          setError(null);
        }
      } catch {
        if (active) {
          setError('Não foi possível carregar a rota.');
          setLoading(false);
        }
      }
    };

    fetchRouteDetails();

    return () => {
      active = false;
    };
  }, [orderId]);

  return { details, coords, loading, error };
}
