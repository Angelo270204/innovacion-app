// app/(auth)/register.tsx
// Pantalla de registro (simulada - sin backend)

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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Validar nombre
    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

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

    // Validar confirmación de contraseña
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simular llamada a API (2 segundos)
    setTimeout(async () => {
      try {
        // En un caso real, aquí crearías el usuario en el backend
        // Por ahora, solo guardamos configuración inicial
        
        // Guardar configuración por defecto
        const defaultSettings = {
          notificationsEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          reminderMinutesBefore: 5,
          theme: 'auto' as const,
          language: 'es' as const,
        };
        
        await StorageService.saveSettings(defaultSettings);
        
        // Generar datos de prueba para nuevos usuarios
        console.log('📦 Generando datos de prueba...');
        await SeedDataService.seedAll();
        
        // Marcar onboarding como completado
        await StorageService.completeOnboarding();

        // Mostrar mensaje de éxito
        Alert.alert(
          '¡Registro exitoso!',
          'Tu cuenta ha sido creada correctamente',
          [
            {
              text: 'Continuar',
              onPress: () => {
                // Navegar a la app principal
                router.replace('/(tabs)');
              },
            },
          ]
        );
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudo crear la cuenta. Por favor, intenta nuevamente.',
          [{ text: 'OK' }]
        );
      } finally {
        setLoading(false);
      }
    }, 2000);
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
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>
            Completa tus datos para comenzar a usar Receta Segura
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <FormInput
            label="Nombre completo"
            placeholder="Juan Pérez"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            error={errors.name}
            icon="person-outline"
            autoCapitalize="words"
            required
          />

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
            placeholder="Mínimo 6 caracteres"
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
            helperText="Usa una contraseña segura con letras y números"
            required
          />

          <FormInput
            label="Confirmar contraseña"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: undefined });
              }
            }}
            error={errors.confirmPassword}
            icon="lock-closed-outline"
            secureTextEntry
            autoCapitalize="none"
            required
          />
        </View>

        {/* Términos y condiciones */}
        <View style={styles.termsContainer}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.termsText}>
            Al registrarte, aceptas nuestros{' '}
            <Text style={styles.termsLink}>términos y condiciones</Text>
            {' '}y{' '}
            <Text style={styles.termsLink}>política de privacidad</Text>
          </Text>
        </View>

        {/* Botón de registro */}
        <View style={styles.actions}>
          <CustomButton
            title="Registrarse"
            onPress={handleRegister}
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

        {/* Login */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
          <CustomButton
            title="Iniciar sesión"
            onPress={() => router.push('/(auth)/login')}
            variant="text"
            size="small"
          />
        </View>

        {/* Beneficios */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>¿Por qué registrarte?</Text>
          <View style={styles.benefitsList}>
            <BenefitItem
              icon="calendar-outline"
              text="Organiza todos tus tratamientos"
            />
            <BenefitItem
              icon="notifications-outline"
              text="Recibe recordatorios personalizados"
            />
            <BenefitItem
              icon="cloud-upload-outline"
              text="Sincroniza tus datos de forma segura"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Componente para cada beneficio
interface BenefitItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, text }) => {
  return (
    <View style={styles.benefitItem}>
      <Ionicons name={icon} size={16} color={Colors.primary} />
      <Text style={styles.benefitText}>{text}</Text>
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
    marginBottom: Spacing.md,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
    gap: Spacing.xs,
  },
  termsText: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.relaxed,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semiBold,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  loginText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  benefitsContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Layout.cardPadding,
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  benefitsList: {
    gap: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});