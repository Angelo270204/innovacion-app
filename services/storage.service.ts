// services/storage.service.ts
// Servicio para manejar el almacenamiento local con AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Treatment, Dose, Patient, AppSettings } from '@/types';

// Claves para AsyncStorage
const STORAGE_KEYS = {
  TREATMENTS: '@receta_segura:treatments',
  DOSES: '@receta_segura:doses',
  PATIENTS: '@receta_segura:patients',
  SETTINGS: '@receta_segura:settings',
  USER: '@receta_segura:user',
  ONBOARDING_COMPLETED: '@receta_segura:onboarding_completed',
};

/**
 * Clase para manejar todas las operaciones de almacenamiento
 */
class StorageService {
  // ==================== TRATAMIENTOS ====================

  /**
   * Obtener todos los tratamientos
   */
  async getTreatments(): Promise<Treatment[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TREATMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener tratamientos:', error);
      return [];
    }
  }

  /**
   * Obtener un tratamiento por ID
   */
  async getTreatmentById(id: string): Promise<Treatment | null> {
    try {
      const treatments = await this.getTreatments();
      return treatments.find(t => t.id === id) || null;
    } catch (error) {
      console.error('Error al obtener tratamiento:', error);
      return null;
    }
  }

  /**
   * Guardar un nuevo tratamiento
   */
  async saveTreatment(treatment: Treatment): Promise<boolean> {
    try {
      const treatments = await this.getTreatments();
      treatments.push(treatment);
      await AsyncStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatments));
      return true;
    } catch (error) {
      console.error('Error al guardar tratamiento:', error);
      return false;
    }
  }

  /**
   * Actualizar un tratamiento existente
   */
  async updateTreatment(id: string, updates: Partial<Treatment>): Promise<boolean> {
    try {
      const treatments = await this.getTreatments();
      const index = treatments.findIndex(t => t.id === id);
      
      if (index === -1) {
        return false;
      }

      treatments[index] = {
        ...treatments[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatments));
      return true;
    } catch (error) {
      console.error('Error al actualizar tratamiento:', error);
      return false;
    }
  }

  /**
   * Eliminar un tratamiento
   */
  async deleteTreatment(id: string): Promise<boolean> {
    try {
      const treatments = await this.getTreatments();
      const filtered = treatments.filter(t => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(filtered));
      
      // También eliminar las dosis asociadas
      await this.deleteDosesByTreatment(id);
      
      return true;
    } catch (error) {
      console.error('Error al eliminar tratamiento:', error);
      return false;
    }
  }

  /**
   * Obtener tratamientos activos
   */
  async getActiveTreatments(): Promise<Treatment[]> {
    try {
      const treatments = await this.getTreatments();
      return treatments.filter(t => t.isActive);
    } catch (error) {
      console.error('Error al obtener tratamientos activos:', error);
      return [];
    }
  }

  // ==================== DOSIS ====================

  /**
   * Obtener todas las dosis
   */
  async getDoses(): Promise<Dose[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DOSES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener dosis:', error);
      return [];
    }
  }

  /**
   * Guardar una nueva dosis
   */
  async saveDose(dose: Dose): Promise<boolean> {
    try {
      const doses = await this.getDoses();
      doses.push(dose);
      await AsyncStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
      return true;
    } catch (error) {
      console.error('Error al guardar dosis:', error);
      return false;
    }
  }

  /**
   * Actualizar el estado de una dosis
   */
  async updateDose(id: string, updates: Partial<Dose>): Promise<boolean> {
    try {
      const doses = await this.getDoses();
      const index = doses.findIndex(d => d.id === id);
      
      if (index === -1) {
        return false;
      }

      doses[index] = {
        ...doses[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(doses));
      return true;
    } catch (error) {
      console.error('Error al actualizar dosis:', error);
      return false;
    }
  }

  /**
   * Marcar una dosis como tomada
   */
  async markDoseAsTaken(id: string, notes?: string): Promise<boolean> {
    return this.updateDose(id, {
      status: 'taken',
      takenAt: new Date().toISOString(),
      notes,
    });
  }

  /**
   * Marcar una dosis como omitida
   */
  async markDoseAsMissed(id: string, notes?: string): Promise<boolean> {
    return this.updateDose(id, {
      status: 'missed',
      notes,
    });
  }

  /**
   * Marcar una dosis como saltada (omitida intencionalmente)
   */
  async markDoseAsSkipped(id: string, notes?: string): Promise<boolean> {
    return this.updateDose(id, {
      status: 'skipped',
      notes,
    });
  }

  /**
   * Obtener dosis de un tratamiento específico
   */
  async getDosesByTreatment(treatmentId: string): Promise<Dose[]> {
    try {
      const doses = await this.getDoses();
      return doses.filter(d => d.treatmentId === treatmentId);
    } catch (error) {
      console.error('Error al obtener dosis del tratamiento:', error);
      return [];
    }
  }

  /**
   * Obtener dosis pendientes para hoy
   */
  async getTodayPendingDoses(): Promise<Dose[]> {
    try {
      const doses = await this.getDoses();
      const today = new Date().toISOString().split('T')[0];
      
      return doses.filter(d => {
        const doseDate = new Date(d.scheduledTime).toISOString().split('T')[0];
        return doseDate === today && d.status === 'pending';
      }).sort((a, b) => 
        new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
      );
    } catch (error) {
      console.error('Error al obtener dosis pendientes:', error);
      return [];
    }
  }

  /**
   * Obtener dosis próximas (hoy y los siguientes días)
   */
  async getUpcomingDoses(days: number = 7): Promise<Dose[]> {
    try {
      const doses = await this.getDoses();
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);
      
      return doses.filter(d => {
        const doseDate = new Date(d.scheduledTime);
        return doseDate >= now && doseDate <= futureDate && d.status === 'pending';
      }).sort((a, b) => 
        new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
      );
    } catch (error) {
      console.error('Error al obtener dosis próximas:', error);
      return [];
    }
  }

  /**
   * Obtener historial de dosis (tomadas, omitidas, saltadas)
   */
  async getDosesHistory(limit?: number): Promise<Dose[]> {
    try {
      const doses = await this.getDoses();
      const history = doses
        .filter(d => d.status !== 'pending')
        .sort((a, b) => {
          const dateA = new Date(a.takenAt || a.scheduledTime).getTime();
          const dateB = new Date(b.takenAt || b.scheduledTime).getTime();
          return dateB - dateA; // Más reciente primero
        });
      
      return limit ? history.slice(0, limit) : history;
    } catch (error) {
      console.error('Error al obtener historial de dosis:', error);
      return [];
    }
  }

  /**
   * Eliminar dosis de un tratamiento
   */
  async deleteDosesByTreatment(treatmentId: string): Promise<boolean> {
    try {
      const doses = await this.getDoses();
      const filtered = doses.filter(d => d.treatmentId !== treatmentId);
      await AsyncStorage.setItem(STORAGE_KEYS.DOSES, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar dosis del tratamiento:', error);
      return false;
    }
  }

  // ==================== PACIENTES ====================

  /**
   * Obtener todos los pacientes
   */
  async getPatients(): Promise<Patient[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      return [];
    }
  }

  /**
   * Guardar un nuevo paciente
   */
  async savePatient(patient: Patient): Promise<boolean> {
    try {
      const patients = await this.getPatients();
      patients.push(patient);
      await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      return true;
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      return false;
    }
  }

  // ==================== CONFIGURACIÓN ====================

  /**
   * Obtener configuración de la app
   */
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Guardar configuración de la app
   */
  async saveSettings(settings: AppSettings): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      return false;
    }
  }

  /**
   * Obtener configuración por defecto
   */
  private getDefaultSettings(): AppSettings {
    return {
      notificationsEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
      reminderMinutesBefore: 5,
      theme: 'auto',
      language: 'es',
    };
  }

  // ==================== ONBOARDING ====================

  /**
   * Verificar si el onboarding fue completado
   */
  async isOnboardingCompleted(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      return data === 'true';
    } catch (error) {
      console.error('Error al verificar onboarding:', error);
      return false;
    }
  }

  /**
   * Marcar onboarding como completado
   */
  async completeOnboarding(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      return true;
    } catch (error) {
      console.error('Error al marcar onboarding:', error);
      return false;
    }
  }

  // ==================== UTILIDADES ====================

  /**
   * Limpiar todos los datos (para desarrollo o cerrar sesión)
   */
  async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TREATMENTS,
        STORAGE_KEYS.DOSES,
        STORAGE_KEYS.PATIENTS,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.USER,
      ]);
      return true;
    } catch (error) {
      console.error('Error al limpiar datos:', error);
      return false;
    }
  }

  /**
   * Exportar todos los datos (para backup)
   */
  async exportData(): Promise<string | null> {
    try {
      const treatments = await this.getTreatments();
      const doses = await this.getDoses();
      const patients = await this.getPatients();
      const settings = await this.getSettings();

      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {
          treatments,
          doses,
          patients,
          settings,
        },
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      return null;
    }
  }
}

// Exportar una instancia única del servicio (Singleton)
export default new StorageService();