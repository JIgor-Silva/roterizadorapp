import React, { ComponentType, useEffect, useRef } from 'react';
import { Bike } from 'lucide-react-native';
import { Animated, Dimensions, Easing } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import MapScreen from '../screens/MapScreen';

import DashboardScreen from '../screens/DashboardScreen';

const { width: screenWidth } = Dimensions.get('window');
const ICON_SIZE = 28; 

const AnimatedBikeIcon = () => {
  const translateX = useRef(new Animated.Value(-ICON_SIZE)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: screenWidth, 
          duration: 8000, 
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -ICON_SIZE,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <Bike color="#fff" size={ICON_SIZE} />
    </Animated.View>
  );
};

export type ScreenConfig = {
  name: string;
  component: ComponentType<any>;
  options?: any; // Opções de tela do React Navigation
};

// Telas acessíveis a todos (não autenticados)
const publicScreens: ScreenConfig[] = [
  { name: 'Login', component: LoginScreen, options: { headerShown: false, gestureEnabled: false } },
];

// Telas para usuários autenticados (admin e entregador)
const authenticatedScreens: ScreenConfig[] = [
  {
    name: 'Dashboard',
    component: DashboardScreen,
    options: {
      headerTitle: () => <AnimatedBikeIcon />,
      headerTitleAlign: 'center',
    },
  },
  { name: 'Map', component: MapScreen, options: { title: 'Mapa' } },
  // Adicione outras telas compartilhadas aqui
];

// Mapeamento de roles para suas respectivas telas
export const screenConfigByRole: Record<string, ScreenConfig[]> = {
  public: publicScreens,
  delivery_person: authenticatedScreens, // Chave alinhada com a API
  admin: authenticatedScreens,
};
