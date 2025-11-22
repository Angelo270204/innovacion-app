// types/index.ts
// Tipos de datos para la aplicación Receta Segura

/**
 * Representa un paciente en el sistema
 */
export interface Patient {
  id: string;
  name: string;
  age?: number;
  notes?: string;
  createdAt: string;
}

/**
 * Frecuencia de toma del medicamento
 */
export type Frequency = 'daily' | 'every_hours' | 'weekly' | 'as_needed';

/**
 * Representa un horario específico de toma
 */
export interface Schedule {
  id: string;
  time: string; // Formato HH:mm (ej: "08:00")
  enabled: boolean;
}

/**
 * Representa un tratamiento médico completo
 */
export interface Treatment {
  id: string;
  medicationName: string;
  dose: string; // ej: "500mg", "2 tabletas"
  frequency: Frequency;
  schedules: Schedule[]; // Horarios del día
  patientId: string;
  patientName: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string (opcional para tratamientos indefinidos)
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Estado de una toma de medicamento
 */
export type DoseStatus = 'pending' | 'taken' | 'missed' | 'skipped';

/**
 * Representa una toma individual de medicamento
 */
export interface Dose {
  id: string;
  treatmentId: string;
  medicationName: string;
  dose: string;
  scheduledTime: string; // ISO string con fecha y hora exacta
  status: DoseStatus;
  takenAt?: string; // ISO string - momento real en que se tomó
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Representa una notificación/recordatorio programado
 */
export interface Reminder {
  id: string;
  treatmentId: string;
  scheduleId: string;
  notificationId?: string; // ID de la notificación del sistema
  time: string; // Formato HH:mm
  enabled: boolean;
  daysOfWeek?: number[]; // 0-6 (domingo-sábado)
}

/**
 * Estadísticas de adherencia para un tratamiento
 */
export interface AdherenceStats {
  treatmentId: string;
  totalDoses: number;
  takenDoses: number;
  missedDoses: number;
  adherencePercentage: number;
  lastSevenDays: {
    date: string;
    taken: number;
    missed: number;
  }[];
}

/**
 * Datos del usuario/cuidador
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'patient' | 'caregiver';
  createdAt: string;
}

/**
 * Formulario para crear/editar un tratamiento
 */
export interface TreatmentFormData {
  medicationName: string;
  dose: string;
  frequency: Frequency;
  schedules: { time: string }[];
  patientName: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

/**
 * Configuración de la aplicación
 */
export interface AppSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderMinutesBefore: number;
  theme: 'light' | 'dark' | 'auto';
  language: 'es' | 'en';
}