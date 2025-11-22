// components/CustomButton.tsx
// Botón personalizado reutilizable para Receta Segura

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, BorderRadius, Layout, Shadows } from '@/constants/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  // Determinar estilos según la variante
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...getSizeStyle(),
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? Colors.border : Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? Colors.border : Colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: isDisabled ? Colors.border : Colors.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          ...Shadows.small,
          elevation: 0,
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: isDisabled ? Colors.border : Colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          height: Layout.buttonHeightSmall,
          paddingHorizontal: 16,
        };
      case 'medium':
        return {
          height: Layout.buttonHeight,
          paddingHorizontal: 24,
        };
      case 'large':
        return {
          height: Layout.buttonHeight + 8,
          paddingHorizontal: 32,
        };
      default:
        return {
          height: Layout.buttonHeight,
          paddingHorizontal: 24,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.buttonText,
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return {
          ...baseStyle,
          color: isDisabled ? Colors.textLight : Colors.textWhite,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: isDisabled ? Colors.textLight : Colors.primary,
        };
      case 'text':
        return {
          ...baseStyle,
          color: isDisabled ? Colors.textLight : Colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? Colors.primary : Colors.textWhite}
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    gap: 8,
    ...Shadows.small,
  },
  buttonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    textAlign: 'center',
  },
});

export default CustomButton;