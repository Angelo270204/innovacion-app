// app/(auth)/_layout.tsx
// Layout para las pantallas de autenticación

import { Stack } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="welcome" 
        options={{
          title: 'Bienvenida',
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          title: 'Iniciar sesión',
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          title: 'Registrarse',
        }}
      />
    </Stack>
  );
}