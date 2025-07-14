import React from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native';
import { TriangleAlert } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Alert, AlertTitle, AlertDescription } from './components';

export default function HomeScreen() {
  const isApiConfigured = false;

  return (
    <View className="flex-1 bg-red-500">
      <SafeAreaView className="flex-1 bg-black/30 items-center p-6">
        <StatusBar barStyle="light-content" />
        <View className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
          <BlurView intensity={50} tint="light">
            <View className="p-6">
              <Text className="text-2xl font-bold text-zinc-900 mb-4 text-center">
                Painel do Roteirizador 🗺️
              </Text>
              {!isApiConfigured && (
                <Alert variant="destructive" className="mb-4">
                  <TriangleAlert />
                  <AlertTitle>Ação Necessária</AlertTitle>
                  <AlertDescription>
                    A chave da API do OpenRouteService ainda não foi configurada.
                  </AlertDescription>
                </Alert>
              )}
            </View>
          </BlurView>
        </View>
      </SafeAreaView>
    </View>
  );
}
