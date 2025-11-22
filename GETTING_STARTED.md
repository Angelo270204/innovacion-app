# 🚀 Receta Segura - Guía de Inicio Rápido

## 📱 Descripción

**Receta Segura** es una aplicación móvil para mejorar la adherencia a tratamientos médicos. Permite digitalizar recetas, programar recordatorios de medicación, y llevar un control completo de tratamientos.

---

## ✅ Estado Actual del Proyecto

### Funcionalidades Implementadas

- ✅ **Autenticación simulada** (sin backend)
- ✅ **Pantalla de Inicio**: Próximas tomas del día con estadísticas
- ✅ **Gestión de Tratamientos**: Lista, visualización y eliminación
- ✅ **Historial de Tomas**: Con filtros por período y estado
- ✅ **Vista de Cuidador**: Supervisión de pacientes y adherencia general
- ✅ **Almacenamiento local** con AsyncStorage
- ✅ **Datos de prueba automáticos** para desarrollo
- ✅ **Componentes reutilizables** (Botones, Cards, Forms)
- ✅ **Tema personalizado** con colores de la marca

### Por Implementar

- ⏳ Formulario de creación/edición de tratamientos
- ⏳ Notificaciones locales
- ⏳ Captura de recetas con cámara
- ⏳ Exportar/Importar datos
- ⏳ Modo oscuro

---

## 🛠️ Instalación y Configuración

### Requisitos Previos

- **Node.js** (v16 o superior)
- **npm** o **yarn**
- **Expo Go** (app móvil para testing)
- Opcional: **Android Studio** o **Xcode** para emuladores

### Paso 1: Instalar Dependencias

```bash
cd innovacion-app
npm install
```

### Paso 2: Iniciar el Servidor de Desarrollo

```bash
npm start
# o
npx expo start
```

### Paso 3: Abrir la App

**Opción A: Usando Expo Go (Recomendado para inicio)**

1. Instala **Expo Go** desde:
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Escanea el código QR que aparece en la terminal

**Opción B: Usando Emulador**

- **Android**: Presiona `a` en la terminal
- **iOS** (solo Mac): Presiona `i` en la terminal
- **Web**: Presiona `w` en la terminal

---

## 📂 Estructura del Proyecto

```
innovacion-app/
├── app/                          # Rutas (Expo Router)
│   ├── (auth)/                   # Autenticación
│   │   ├── welcome.tsx          # Pantalla de bienvenida
│   │   ├── login.tsx            # Login
│   │   └── register.tsx         # Registro
│   ├── (tabs)/                   # Navegación principal
│   │   ├── index.tsx            # Home - Próximas tomas
│   │   ├── treatments.tsx       # Lista de tratamientos
│   │   ├── history.tsx          # Historial
│   │   └── caregiver.tsx        # Vista cuidador
│   └── index.tsx                # Splash/Router inicial
│
├── components/                   # Componentes reutilizables
│   ├── CustomButton.tsx         # Botón personalizado
│   ├── TreatmentCard.tsx        # Card de tratamiento
│   ├── DoseCard.tsx             # Card de dosis
│   ├── FormInput.tsx            # Input de formulario
│   └── DebugInfo.tsx            # Info de debug
│
├── services/                     # Lógica de negocio
│   ├── storage.service.ts       # AsyncStorage wrapper
│   └── seed-data.service.ts     # Datos de prueba
│
├── hooks/                        # Custom hooks
│   └── useTreatments.ts         # Hook de tratamientos
│
├── types/                        # TypeScript interfaces
│   └── index.ts                 # Todos los tipos
│
├── constants/                    # Constantes
│   └── theme.ts                 # Tema (colores, tipografía)
│
└── assets/                       # Recursos estáticos
    ├── images/
    └── logo-innovacion.png
```

---

## 🎯 Flujo de Uso de la App

### Primera Vez

1. **Pantalla de Bienvenida** → Ver las características de la app
2. **Registro o Login** → Crear cuenta (simulado, sin backend)
3. **Generación de Datos** → Se crean automáticamente datos de prueba
4. **Home** → Ver medicamentos del día

### Uso Diario

1. **Home**: Ver próximas tomas → Marcar como tomada/omitida
2. **Tratamientos**: Ver todos los tratamientos activos
3. **Historial**: Revisar adherencia histórica
4. **Cuidador**: Supervisar pacientes (si eres cuidador)

---

## 🧪 Datos de Prueba

La app genera automáticamente datos de prueba al registrarte o hacer login por primera vez:

### Pacientes de Prueba
- **María García** (68 años) - Hipertensión y diabetes
- **Juan Pérez** (45 años) - Post-operatorio

### Tratamientos de Prueba
1. **Losartán** - 50mg (María) - 2 tomas/día
2. **Metformina** - 850mg (María) - 2 tomas/día
3. **Atorvastatina** - 20mg (María) - 1 toma/día
4. **Amoxicilina** - 500mg (Juan) - 3 tomas/día
5. **Ibuprofeno** - 400mg (Juan) - 2 tomas/día

### Gestionar Datos de Prueba

En **modo desarrollo**, verás botones en la pantalla de inicio para:

- **Generar datos de prueba**: Crea nuevos datos de ejemplo
- **Limpiar todos los datos**: Elimina toda la información

---

## 🎨 Personalización del Tema

Los colores y estilos están centralizados en `/constants/theme.ts`:

```typescript
export const Colors = {
  primary: '#00A67E',      // Verde principal
  secondary: '#6C5CE7',    // Morado
  success: '#00D68F',      // Verde éxito
  error: '#FF3B30',        // Rojo error
  warning: '#FFAA00',      // Amarillo advertencia
  // ...más colores
};
```

Para cambiar el color principal:
1. Abre `constants/theme.ts`
2. Modifica `Colors.primary`
3. La app se actualizará automáticamente

---

## 🐛 Debug y Desarrollo

### Consola de Debug

En modo desarrollo (`__DEV__`), tienes acceso a:

- **Botones de gestión de datos** en Home
- **React Native Debugger** (Cmd+D / Ctrl+D)
- **Console logs** en la terminal

### Comandos Útiles

```bash
# Limpiar caché
npx expo start -c

# Ver logs de Android
npx react-native log-android

# Ver logs de iOS
npx react-native log-ios

# Reiniciar servidor
Presiona 'r' en la terminal
```

### Solución de Problemas Comunes

**Error: "Cannot read property..."**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install
npx expo start -c
```

**La app no carga**
```bash
# Verificar que el servidor esté corriendo
npm start
```

**AsyncStorage no guarda datos**
```bash
# Limpiar storage de la app
# En Expo Go: Settings > Clear app data
```

---

## 📝 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Abrir en Android
npm run android

# Abrir en iOS (solo Mac)
npm run ios

# Abrir en web
npm run web

# Limpiar proyecto
npm run reset-project
```

---

## 🔑 Credenciales de Prueba

Como no hay backend, puedes usar **cualquier email y contraseña válidos**:

- **Email**: `test@example.com`
- **Password**: `123456` (mínimo 6 caracteres)

O registrarte con cualquier dato válido.

---

## 📚 Tecnologías Utilizadas

- **React Native** - Framework móvil
- **Expo** - Toolchain y SDK
- **Expo Router** - Navegación basada en archivos
- **TypeScript** - Tipado estático
- **AsyncStorage** - Almacenamiento local
- **Expo Vector Icons** - Iconografía

---

## 🎓 Recursos de Aprendizaje

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Guide](https://react-native-async-storage.github.io/async-storage/)

---

## 🤝 Contribuir

Este es un proyecto educativo MVP. Para mejoras:

1. Crea un branch con tu feature
2. Implementa tu cambio
3. Prueba en múltiples dispositivos
4. Documenta los cambios

---

## 📧 Contacto y Soporte

Si encuentras problemas o tienes preguntas, revisa:

1. **Console logs** en la terminal
2. **Red screen** en el dispositivo (errores de runtime)
3. **Documentación** de Expo/React Native

---

## 🎉 ¡Listo para Empezar!

```bash
# 1. Instala dependencias
npm install

# 2. Inicia el servidor
npm start

# 3. Escanea el QR con Expo Go

# 4. Regístrate en la app

# 5. ¡Explora las funcionalidades!
```

---

**Versión**: 1.0.0 (MVP)  
**Última actualización**: Diciembre 2024  
**Estado**: En desarrollo activo

---

¡Gracias por usar Receta Segura! 💊📱