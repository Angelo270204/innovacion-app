// app/(auth)/login.tsx
// Pantalla de inicio de sesión (simulada - sin backend)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import FormInput from '@/components/FormInput';
import StorageService from '@/services/storage.service';
import SeedDataService from '@/services/seed-data.service';
import { Colors, Typography, BorderRadius, Spacing, Layout } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    // Validar email
    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }

    // Validar contraseña
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simular llamada a API (2 segundos)
    setTimeout(async () => {
      try {
        // En un caso real, aquí validarías contra un backend
        // Por ahora, aceptamos cualquier email/contraseña válida
        
        // Verificar si hay datos, si no, generar datos de prueba
        const hasData = await SeedDataService.hasData();
        if (!hasData) {
          console.log('📦 Generando datos de prueba...');
          await SeedDataService.seedAll();
        }
        
        // Marcar onboarding como completado
        await StorageService.completeOnboarding();

        // Navegar a la app principal
        router.replace('/(tabs)');
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudo iniciar sesión. Por favor, intenta nuevamente.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Recuperar contraseña',
      'Esta funcionalidad estará disponible próximamente.',
      [{ text: 'OK' }]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <CustomButton
            title="Volver"
            onPress={handleGoBack}
            variant="text"
            size="small"
            icon={<Ionicons name="arrow-back" size={20} color={Colors.primary} />}
          />
        </View>

        {/* Logo y título */}
        <View style={styles.titleContainer}>
          <View style={styles.logoContainer}>
            <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Bienvenido de nuevo</Text>
          <Text style={styles.subtitle}>
            Ingresa tus datos para acceder a tu cuenta
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <FormInput
            label="Correo electrónico"
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: undefined });
              }
            }}
            error={errors.email}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            required
          />

          <FormInput
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: undefined });
              }
            }}
            error={errors.password}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            required
          />

          <CustomButton
            title="¿Olvidaste tu contraseña?"
            onPress={handleForgotPassword}
            variant="text"
            size="small"
            style={styles.forgotButton}
          />
        </View>

        {/* Botón de login */}
        <View style={styles.actions}>
          <CustomButton
            title="Iniciar sesión"
            onPress={handleLogin}
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={loading}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Registro */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
          <CustomButton
            title="Registrarse"
            onPress={() => router.push('/(auth)/register')}
            variant="text"
            size="small"
          />
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={16} color={Colors.success} />
            <Text style={styles.infoText}>Tus datos están seguros</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="lock-closed-outline" size={16} color={Colors.success} />
            <Text style={styles.infoText}>Encriptación de extremo a extremo</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Layout.screenPaddingVertical,
  },
  header: {
    marginBottom: Spacing.md,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '20',
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
  },
  form: {
    marginBottom: Spacing.lg,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -Spacing.sm,
  },
  actions: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.textLight,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  registerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  infoContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});