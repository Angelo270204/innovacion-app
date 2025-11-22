// app/index.tsx
// Pantalla inicial que siempre redirige a la bienvenida

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/constants/theme';
import DevConfig from '@/constants/dev-config';
import StorageService from '@/services/storage.service';
import SeedDataService from '@/services/seed-data.service';

export default function IndexScreen() {
  const [loadingMessage, setLoadingMessage] = useState('Cargando...');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Verificar si existen datos
        const treatments = await StorageService.getTreatments();
        
        // Lógica para cargar datos de prueba en desarrollo
        if (__DEV__) {
          if (DevConfig.FORCE_RELOAD_DATA) {
            // SIEMPRE recargar datos (cada vez que se abre la app)
            setLoadingMessage('Recargando datos de prueba...');
            await SeedDataService.seedAll();
            setLoadingMessage('¡Datos recargados! ✅');
          } else if (DevConfig.LOAD_DATA_IF_EMPTY && treatments.length === 0) {
            // Solo cargar si no hay datos
            setLoadingMessage('Generando datos de prueba...');
            await SeedDataService.seedAll();
            setLoadingMessage('¡Datos generados! ✅');
          }
        }
        
        // Navegar a la pantalla de bienvenida
        setTimeout(() => {
          router.replace('/(auth)/welcome');
        }, 500);
      } catch (error) {
        console.error('Error al inicializar la app:', error);
        // Navegar de todos modos
        setTimeout(() => {
          router.replace('/(auth)/welcome');
        }, 500);
      }
    };

    initializeApp();
  }, []);

  return (
    <View style={styles.container}>
      {/* App Logo/Icon */}
      <View style={styles.logoContainer}>
        <Ionicons name="medical" size={80} color={Colors.primary} />
      </View>
      
      {/* App Name */}
      <Text style={styles.appName}>Receta Segura</Text>
      <Text style={styles.appTagline}>Tu gestor de medicamentos</Text>
      
      {/* Loading Indicator */}
      <ActivityIndicator 
        size="large" 
        color={Colors.primary} 
        style={styles.loader}
      />
      
      {/* Loading Message */}
      <Text style={styles.loadingText}>{loadingMessage}</Text>
      
      {/* Dev Mode Badge */}
      {__DEV__ && (
        <View style={styles.devBadge}>
          <Text style={styles.devBadgeText}>Modo Desarrollo</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  appTagline: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  loader: {
    marginVertical: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textLight,
    fontWeight: Typography.fontWeight.medium,
  },
  devBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  devBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.warning,
    fontWeight: Typography.fontWeight.semiBold,
  },
});