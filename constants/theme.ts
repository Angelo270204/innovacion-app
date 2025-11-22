// constants/theme.ts
// Tema y constantes de diseño para Receta Segura

export const Colors = {
  // Colores principales de la marca (basados en tu diseño)
  primary: '#00A67E', // Verde principal (del logo)
  primaryDark: '#008A68',
  primaryLight: '#33B896',
  
  // Colores secundarios
  secondary: '#6C5CE7', // Morado (para iconos y detalles)
  secondaryLight: '#A29BFE',
  
  // Colores de estado
  success: '#00D68F',
  warning: '#FFAA00',
  error: '#FF3B30',
  info: '#0095FF',
  
  // Colores de fondo
  background: '#F8FAF9',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#E8EFED',
  
  // Colores de texto
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // Colores para estados de dosis
  dosePending: '#FFAA00',
  doseTaken: '#00D68F',
  doseMissed: '#FF3B30',
  doseSkipped: '#999999',
  
  // Colores de bordes y separadores
  border: '#E0E0E0',
  divider: '#F0F0F0',
  
  // Sombras
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const Typography = {
  // Familia de fuentes
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  
  // Tamaños de fuente
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  
  // Peso de fuente
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  
  // Altura de línea
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  // Márgenes de pantalla
  screenPadding: Spacing.md,
  screenPaddingHorizontal: Spacing.md,
  screenPaddingVertical: Spacing.lg,
  
  // Tamaños de componentes
  buttonHeight: 56,
  buttonHeightSmall: 44,
  inputHeight: 56,
  iconSize: 24,
  iconSizeLarge: 32,
  iconSizeSmall: 20,
  
  // Tamaños de tarjetas
  cardMinHeight: 100,
  cardPadding: Spacing.md,
  
  // Anchos máximos
  maxContentWidth: 600,
};

// Estilos de texto predefinidos
export const TextStyles = {
  h1: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['4xl'] * Typography.lineHeight.tight,
    color: Colors.text,
  },
  h2: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.tight,
    color: Colors.text,
  },
  h3: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.tight,
    color: Colors.text,
  },
  h4: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
    color: Colors.text,
  },
  body: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
    color: Colors.textLight,
  },
  button: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.tight,
    color: Colors.textWhite,
  },
};

// Configuración de animaciones
export const Animations = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
};

// Exportar todo como theme principal
export const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  layout: Layout,
  textStyles: TextStyles,
  animations: Animations,
};

export default theme;