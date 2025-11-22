// constants/dev-config.ts
// Configuración de desarrollo para la aplicación

/**
 * Configuración de desarrollo para Receta Segura
 * 
 * Este archivo controla el comportamiento de la app en modo desarrollo.
 * Los cambios aquí NO afectan la versión de producción.
 */

export const DevConfig = {
  /**
   * FORCE_RELOAD_DATA
   * 
   * true: SIEMPRE recarga los datos de prueba cada vez que se abre la app
   *       (útil para testing constante con datos frescos)
   * 
   * false: Solo carga datos si no existen
   *        (útil cuando quieres mantener cambios entre recargas)
   * 
   * Recomendación: Usa `true` durante desarrollo activo, `false` para testing de persistencia
   */
  FORCE_RELOAD_DATA: true,

  /**
   * LOAD_DATA_IF_EMPTY
   * 
   * true: Genera datos de prueba si la base de datos está vacía
   * false: Inicia con base de datos vacía
   * 
   * Solo aplica si FORCE_RELOAD_DATA es false
   */
  LOAD_DATA_IF_EMPTY: true,

  /**
   * SHOW_DEV_TOOLS
   * 
   * true: Muestra botones de desarrollo en la pantalla Home
   *       (generar/limpiar datos)
   * 
   * false: Oculta herramientas de desarrollo
   */
  SHOW_DEV_TOOLS: true,

  /**
   * SNACKBAR_DURATION
   * 
   * Duración en milisegundos que se muestra el Snackbar
   * Por defecto: 3000 (3 segundos)
   */
  SNACKBAR_DURATION: 3000,

  /**
   * AUTO_LOGIN
   * 
   * true: Salta la pantalla de login automáticamente
   * false: Muestra pantalla de login normal
   * 
   * Útil para desarrollo rápido sin tener que hacer login cada vez
   */
  AUTO_LOGIN: false,

  /**
   * LOG_STORAGE_OPERATIONS
   * 
   * true: Muestra logs detallados de operaciones de AsyncStorage
   * false: Solo muestra errores
   */
  LOG_STORAGE_OPERATIONS: true,

  /**
   * SEED_DATA_SETTINGS
   * 
   * Configuración de los datos de prueba generados
   */
  SEED_DATA: {
    // Número de pacientes a generar
    NUM_PATIENTS: 2,
    
    // Número de tratamientos por paciente
    NUM_TREATMENTS_PER_PATIENT: 3,
    
    // Días hacia atrás para generar historial de dosis
    HISTORY_DAYS: 7,
    
    // Días hacia adelante para generar dosis futuras
    FUTURE_DAYS: 7,
  },

  /**
   * DEBUG_MODE
   * 
   * Activa características de debugging adicionales
   */
  DEBUG_MODE: false,
};

export default DevConfig;