// components/FormInput.tsx
// Input reutilizable para formularios de Receta Segura

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Layout } from '@/constants/theme';

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  icon,
  helperText,
  containerStyle,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = !!error;
  const isSecureEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          multiline && styles.inputContainerMultiline,
        ]}
      >
        {/* Icon (si existe) */}
        {icon && (
          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={20}
              color={hasError ? Colors.error : isFocused ? Colors.primary : Colors.textSecondary}
            />
          </View>
        )}

        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            icon && styles.inputWithIcon,
            secureTextEntry && styles.inputWithSecureToggle,
            inputStyle,
          ]}
          placeholderTextColor={Colors.textLight}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={isSecureEntry}
          {...textInputProps}
        />

        {/* Toggle password visibility */}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.secureToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Helper Text o Error */}
      {(helperText || error) && (
        <View style={styles.helperContainer}>
          {error ? (
            <>
              <Ionicons name="alert-circle" size={14} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </>
          ) : (
            <Text style={styles.helperText}>{helperText}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelContainer: {
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    minHeight: Layout.inputHeight,
  },
  inputContainerFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundLight,
  },
  inputContainerError: {
    borderColor: Colors.error,
  },
  inputContainerMultiline: {
    minHeight: Layout.inputHeight * 1.5,
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    paddingVertical: 0,
  },
  inputMultiline: {
    paddingVertical: Spacing.xs,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputWithSecureToggle: {
    paddingRight: 0,
  },
  secureToggle: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 4,
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
  },
});

export default FormInput;