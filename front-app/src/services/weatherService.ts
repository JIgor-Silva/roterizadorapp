import axios from 'axios';

const API_BASE_URL = 'http://192.168.2.23:3000/api/v1';

export const fetchWeather = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather`, {
      params: { latitude, longitude },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
