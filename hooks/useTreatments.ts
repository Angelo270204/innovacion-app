// hooks/useTreatments.ts
// Custom hook para manejar la lógica de tratamientos y dosis

import { useState, useEffect, useCallback } from 'react';
import { Treatment, Dose, TreatmentFormData, DoseStatus } from '@/types';
import StorageService from '@/services/storage.service';

export const useTreatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [doses, setDoses] = useState<Dose[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Cargar todos los tratamientos desde AsyncStorage
   */
  const loadTreatments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StorageService.getTreatments();
      setTreatments(data);
    } catch (err) {
      setError('Error al cargar tratamientos');
      console.error('Error loading treatments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cargar todas las dosis desde AsyncStorage
   */
  const loadDoses = useCallback(async () => {
    try {
      setError(null);
      const data = await StorageService.getDoses();
      setDoses(data);
    } catch (err) {
      setError('Error al cargar dosis');
      console.error('Error loading doses:', err);
    }
  }, []);

  /**
   * Cargar datos iniciales
   */
  useEffect(() => {
    loadTreatments();
    loadDoses();
  }, [loadTreatments, loadDoses]);

  /**
   * Crear un nuevo tratamiento
   */
  const createTreatment = useCallback(async (formData: TreatmentFormData): Promise<boolean> => {
    try {
      setError(null);
      
      const now = new Date().toISOString();
      const treatmentId = `treatment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newTreatment: Treatment = {
        id: treatmentId,
        medicationName: formData.medicationName,
        dose: formData.dose,
        frequency: formData.frequency,
        schedules: formData.schedules.map((s, index) => ({
          id: `schedule_${Date.now()}_${index}`,
          time: s.time,
          enabled: true,
        })),
        patientId: `patient_${Date.now()}`,
        patientName: formData.patientName,
        startDate: formData.startDate,
        endDate: formData.endDate,
        notes: formData.notes,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };

      const success = await StorageService.saveTreatment(newTreatment);
      
      if (success) {
        // Generar dosis para los próximos días
        await generateDosesForTreatment(newTreatment);
        await loadTreatments();
        await loadDoses();
      }
      
      return success;
    } catch (err) {
      setError('Error al crear tratamiento');
      console.error('Error creating treatment:', err);
      return false;
    }
  }, [loadTreatments, loadDoses]);

  /**
   * Actualizar un tratamiento existente
   */
  const updateTreatment = useCallback(async (
    id: string,
    updates: Partial<Treatment>
  ): Promise<boolean> => {
    try {
      setError(null);
      const success = await StorageService.updateTreatment(id, updates);
      
      if (success) {
        await loadTreatments();
      }
      
      return success;
    } catch (err) {
      setError('Error al actualizar tratamiento');
      console.error('Error updating treatment:', err);
      return false;
    }
  }, [loadTreatments]);

  /**
   * Eliminar un tratamiento
   */
  const deleteTreatment = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await StorageService.deleteTreatment(id);
      
      if (success) {
        await loadTreatments();
        await loadDoses();
      }
      
      return success;
    } catch (err) {
      setError('Error al eliminar tratamiento');
      console.error('Error deleting treatment:', err);
      return false;
    }
  }, [loadTreatments, loadDoses]);

  /**
   * Generar dosis para un tratamiento (próximos 30 días)
   */
  const generateDosesForTreatment = useCallback(async (
    treatment: Treatment,
    daysAhead: number = 30
  ): Promise<void> => {
    try {
      const startDate = new Date(treatment.startDate);
      const endDate = treatment.endDate ? new Date(treatment.endDate) : null;
      const generatedDoses: Dose[] = [];

      for (let day = 0; day < daysAhead; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);

        // Si hay fecha de fin y ya la pasamos, detenemos
        if (endDate && currentDate > endDate) {
          break;
        }

        // Generar dosis para cada horario del día
        treatment.schedules.forEach((schedule) => {
          if (!schedule.enabled) return;

          const [hours, minutes] = schedule.time.split(':').map(Number);
          const scheduledTime = new Date(currentDate);
          scheduledTime.setHours(hours, minutes, 0, 0);

          const dose: Dose = {
            id: `dose_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            treatmentId: treatment.id,
            medicationName: treatment.medicationName,
            dose: treatment.dose,
            scheduledTime: scheduledTime.toISOString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          generatedDoses.push(dose);
        });
      }

      // Guardar todas las dosis generadas
      for (const dose of generatedDoses) {
        await StorageService.saveDose(dose);
      }
    } catch (err) {
      console.error('Error generating doses:', err);
    }
  }, []);

  /**
   * Marcar una dosis como tomada
   */
  const markDoseAsTaken = useCallback(async (
    doseId: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const success = await StorageService.markDoseAsTaken(doseId, notes);
      
      if (success) {
        await loadDoses();
      }
      
      return success;
    } catch (err) {
      setError('Error al marcar dosis como tomada');
      console.error('Error marking dose as taken:', err);
      return false;
    }
  }, [loadDoses]);

  /**
   * Marcar una dosis como omitida
   */
  const markDoseAsMissed = useCallback(async (
    doseId: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const success = await StorageService.markDoseAsMissed(doseId, notes);
      
      if (success) {
        await loadDoses();
      }
      
      return success;
    } catch (err) {
      setError('Error al marcar dosis como omitida');
      console.error('Error marking dose as missed:', err);
      return false;
    }
  }, [loadDoses]);

  /**
   * Marcar una dosis como saltada
   */
  const markDoseAsSkipped = useCallback(async (
    doseId: string,
    notes?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const success = await StorageService.markDoseAsSkipped(doseId, notes);
      
      if (success) {
        await loadDoses();
      }
      
      return success;
    } catch (err) {
      setError('Error al marcar dosis como saltada');
      console.error('Error marking dose as skipped:', err);
      return false;
    }
  }, [loadDoses]);

  /**
   * Obtener tratamientos activos
   */
  const getActiveTreatments = useCallback((): Treatment[] => {
    return treatments.filter(t => t.isActive);
  }, [treatments]);

  /**
   * Obtener dosis pendientes de hoy
   */
  const getTodayPendingDoses = useCallback((): Dose[] => {
    const today = new Date().toISOString().split('T')[0];
    
    return doses
      .filter(d => {
        const doseDate = new Date(d.scheduledTime).toISOString().split('T')[0];
        return doseDate === today && d.status === 'pending';
      })
      .sort((a, b) => 
        new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
      );
  }, [doses]);

  /**
   * Obtener próximas dosis (hoy y siguientes días)
   */
  const getUpcomingDoses = useCallback((days: number = 7): Dose[] => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return doses
      .filter(d => {
        const doseDate = new Date(d.scheduledTime);
        return doseDate >= now && doseDate <= futureDate && d.status === 'pending';
      })
      .sort((a, b) => 
        new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
      );
  }, [doses]);

  /**
   * Obtener historial de dosis
   */
  const getDosesHistory = useCallback((limit?: number): Dose[] => {
    const history = doses
      .filter(d => d.status !== 'pending')
      .sort((a, b) => {
        const dateA = new Date(a.takenAt || a.scheduledTime).getTime();
        const dateB = new Date(b.takenAt || b.scheduledTime).getTime();
        return dateB - dateA; // Más reciente primero
      });
    
    return limit ? history.slice(0, limit) : history;
  }, [doses]);

  /**
   * Calcular estadísticas de adherencia para un tratamiento
   */
  const getAdherenceStats = useCallback((treatmentId: string) => {
    const treatmentDoses = doses.filter(d => d.treatmentId === treatmentId);
    const totalDoses = treatmentDoses.length;
    const takenDoses = treatmentDoses.filter(d => d.status === 'taken').length;
    const missedDoses = treatmentDoses.filter(d => d.status === 'missed').length;
    const adherencePercentage = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

    return {
      totalDoses,
      takenDoses,
      missedDoses,
      adherencePercentage: Math.round(adherencePercentage),
    };
  }, [doses]);

  /**
   * Refrescar datos
   */
  const refresh = useCallback(async () => {
    await loadTreatments();
    await loadDoses();
  }, [loadTreatments, loadDoses]);

  return {
    // Estado
    treatments,
    doses,
    loading,
    error,
    
    // Operaciones de tratamientos
    createTreatment,
    updateTreatment,
    deleteTreatment,
    
    // Operaciones de dosis
    markDoseAsTaken,
    markDoseAsMissed,
    markDoseAsSkipped,
    
    // Consultas
    getActiveTreatments,
    getTodayPendingDoses,
    getUpcomingDoses,
    getDosesHistory,
    getAdherenceStats,
    
    // Utilidades
    refresh,
    loadTreatments,
    loadDoses,
  };
};

export default useTreatments;