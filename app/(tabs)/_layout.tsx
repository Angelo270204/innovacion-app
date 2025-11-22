// app/(tabs)/_layout.tsx
// Layout de navegación por tabs de Receta Segura

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.backgroundLight,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="treatments"
        options={{
          title: 'Tratamientos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medical" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="caregiver"
        options={{
          title: 'Cuidador',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}