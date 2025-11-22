// app/_layout.tsx
// Layout raíz de la aplicación

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/theme';

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Ocultar splash screen después de un pequeño delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
        {/* Pantalla inicial de carga */}
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Receta Segura',
          }}
        />

        {/* Grupo de autenticación */}
        <Stack.Screen 
          name="(auth)" 
          options={{
            headerShown: false,
          }}
        />

        {/* Grupo de tabs (app principal) */}
        <Stack.Screen 
          name="(tabs)" 
          options={{
            headerShown: false,
          }}
        />

        {/* Modal general */}
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            title: 'Modal',
          }} 
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}