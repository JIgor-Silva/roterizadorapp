import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Image, ScrollView, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { fetchWeather } from '../../../services/weatherService';
import { styles } from './WeatherDisplay.styles';
import { WeatherDisplayProps, WeatherDataType } from './WeatherDisplay.types';

const { width } = Dimensions.get('window');

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ clientLocation, clientOrderId, clientName }) => {
  const [deliveryPersonWeather, setDeliveryPersonWeather] = useState<WeatherDataType | null>(null);
  const [clientWeather, setClientWeather] = useState<WeatherDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentTitle, setCurrentTitle] = useState('Carregando Clima...');
  const [usingDestination, setUsingDestination] = useState(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      setUsingDestination(false);
      const hasClient = !!(clientLocation && clientLocation.latitude && clientLocation.longitude);
      let coords: { latitude: number; longitude: number } | null = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
        }
      } catch {
        coords = null;
      }
      try {
        if (coords) {
          setDeliveryPersonWeather(await fetchWeather(coords.latitude, coords.longitude));
          if (hasClient && clientLocation) {
            setClientWeather(await fetchWeather(clientLocation.latitude, clientLocation.longitude));
          } else {
            setClientWeather(null);
          }
        } else if (hasClient && clientLocation) {
          setDeliveryPersonWeather(await fetchWeather(clientLocation.latitude, clientLocation.longitude));
          setClientWeather(null);
          setUsingDestination(true);
        } else {
          setError('Localização indisponível.');
        }
      } catch {
        setError('Não foi possível carregar o clima.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [clientLocation]);


  useEffect(() => {
    const totalCards = clientWeather ? 4 : 3;

    if (!deliveryPersonWeather) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalCards;
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: nextIndex * (width - 48 + 16), animated: true });
        }
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [deliveryPersonWeather, clientWeather]);

  useEffect(() => {
    if (loading) {
      setCurrentTitle('Carregando Clima...');
    } else if (error) {
      setCurrentTitle('Erro ao carregar clima');
    } else if (deliveryPersonWeather && activeIndex === 0) {
      setCurrentTitle(`${usingDestination ? 'Clima no Destino' : 'Seu Clima Atual'} (${deliveryPersonWeather.location.name})`);
    } else if (deliveryPersonWeather && activeIndex === 1) {
      setCurrentTitle(`Temperatura Atual (${deliveryPersonWeather.location.name})`);
    } else if (deliveryPersonWeather && activeIndex === 2) {
      setCurrentTitle(`Precipitação Hoje (${deliveryPersonWeather.location.name})`);
    } else if (clientWeather && activeIndex === 3) {
      setCurrentTitle(`Clima do Cliente ${clientOrderId ? `(Pedido #${clientOrderId})` : ''} (${clientName || 'Destino'})`);
    } else {
      setCurrentTitle('Nenhum dado de clima disponível.');
    }
  }, [activeIndex, loading, error, deliveryPersonWeather, clientWeather, clientOrderId, clientName, usingDestination]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Carregando dados do clima...</Text>
      </View>
    );
  }

  if (error) {
    return null;
  }

  const renderWeatherCardContent = (weather: WeatherDataType, type: 'date' | 'temp' | 'rain' | 'client') => {
    const date = new Date(weather.location.localtime_epoch * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'long' });
    const weatherIcon = `https:${weather.current.condition.icon}`;
    const precipitationChance = weather.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0;

    switch (type) {
      case 'date':
        return (
          <View style={styles.cardContentCentered}>
            <Text style={styles.cardMainMetric}>{`${day}/${month}/${year}`}</Text>
            <Text style={styles.cardSecondaryMetric}>{dayOfWeek}</Text>
            <Text style={styles.cardSmallText}>{weather.location.name}</Text>
          </View>
        );
      case 'temp':
        return (
          <View style={styles.cardContentCentered}>
            <Image source={{ uri: weatherIcon }} style={styles.weatherIconLarge} />
            <Text style={styles.cardMainMetric}>{weather.current.temp_c.toFixed(0)}°C</Text>
            <Text style={styles.cardSmallText}>{weather.current.condition.text}</Text>
          </View>
        );
      case 'rain':
        return (
          <View style={styles.cardContentCentered}>
            <Text style={styles.cardMainMetric}>{precipitationChance}%</Text>
            <Text style={styles.cardSecondaryMetric}>Chance de Chuva</Text>
            <Text style={styles.cardSmallText}>{weather.current.condition.text}</Text>
          </View>
        );
      case 'client':
        return (
          <View style={styles.cardContentCentered}>
            <Text style={styles.cardMainMetric}>{weather.current.temp_c.toFixed(0)}°C</Text>
            <Image source={{ uri: weatherIcon }} style={styles.weatherIconLarge} />
            <Text style={styles.cardSecondaryMetric}>Chance de Chuva: {precipitationChance}%</Text>
            <Text style={styles.cardSmallText}>{weather.current.condition.text}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const totalCards = clientWeather ? 4 : 3;

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>{currentTitle}</Text>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carouselContainer}
        contentContainerStyle={styles.carouselContentContainer}
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const newIndex = Math.round(contentOffsetX / (width - 48 + 16));
          setActiveIndex(newIndex);
        }}
      >
        {deliveryPersonWeather && (
          <>
            <View style={styles.carouselCard}>
              {renderWeatherCardContent(deliveryPersonWeather, 'date')}
            </View>
            <View style={styles.carouselCard}>
              {renderWeatherCardContent(deliveryPersonWeather, 'temp')}
            </View>
            <View style={styles.carouselCard}>
              {renderWeatherCardContent(deliveryPersonWeather, 'rain')}
            </View>
          </>
        )}
        {clientWeather && (
          <View style={styles.carouselCard}>
            {renderWeatherCardContent(clientWeather, 'client')}
          </View>
        )}
      </ScrollView>

      {!deliveryPersonWeather && !clientWeather && (
        <View style={styles.container}>
          <Text style={styles.noDataText}>Nenhum dado de clima disponível.</Text>
        </View>
      )}
    </View>
  );
};

export default WeatherDisplay;
