// app/(auth)/welcome.tsx
// Pantalla de bienvenida de Receta Segura

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import { Colors, Typography, BorderRadius, Spacing, Layout } from '@/constants/theme';

export default function WelcomeScreen() {
  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y título */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={64} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Receta Segura</Text>
          <Text style={styles.subtitle}>
            Tu aliado para gestionar medicamentos y tratamientos de forma segura
          </Text>
        </View>

        {/* Imagen ilustrativa */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="medical" size={120} color={Colors.primary} opacity={0.2} />
          </View>
        </View>

        {/* Características */}
        <View style={styles.features}>
          <FeatureItem
            icon="document-text-outline"
            title="Digitaliza tus recetas médicas"
            description="Guarda y organiza todas tus prescripciones en un solo lugar"
          />
          <FeatureItem
            icon="notifications-outline"
            title="Recordatorios inteligentes"
            description="Nunca olvides tomar tus medicamentos a tiempo"
          />
          <FeatureItem
            icon="people-outline"
            title="Comparte con cuidadores"
            description="Permite que tu familia acompañe tu tratamiento"
          />
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <CustomButton
            title="Registrarse"
            onPress={handleRegister}
            variant="primary"
            size="large"
            fullWidth
          />
          <CustomButton
            title="Iniciar sesión"
            onPress={handleLogin}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Al continuar, aceptas nuestros términos y condiciones
        </Text>
      </ScrollView>
    </View>
  );
}

// Componente para cada característica
interface FeatureItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={24} color={Colors.primary} />
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Layout.screenPaddingVertical * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  imagePlaceholder: {
    width: 280,
    height: 200,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryLight + '15',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  features: {
    marginBottom: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  featureTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  footer: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});