import api from '../app/api/api';
import { WeatherDataType } from '../app/components/WeatherDisplay/WeatherDisplay.types';

export const fetchWeather = async (latitude: number, longitude: number): Promise<WeatherDataType> => {
  const response = await api.get<WeatherDataType>('/weather', { params: { latitude, longitude } });
  if (!response.data?.current || !response.data?.location || !response.data?.forecast) {
    throw new Error('Resposta de clima inválida.');
  }
  return response.data;
};
