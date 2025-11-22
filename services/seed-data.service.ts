// services/seed-data.service.ts
// Servicio para generar datos de prueba (desarrollo)

import StorageService from './storage.service';
import { Treatment, Dose, Patient } from '@/types';

/**
 * Servicio para poblar la base de datos local con datos de prueba
 */
class SeedDataService {
  /**
   * Generar datos de prueba completos
   */
  async seedAll(): Promise<void> {
    console.log('🌱 Generando datos de prueba...');

    try {
      // Limpiar datos existentes
      await StorageService.clearAll();

      // Generar pacientes
      const patients = await this.generatePatients();
      console.log(`✅ ${patients.length} pacientes creados`);

      // Generar tratamientos
      const treatments = await this.generateTreatments(patients);
      console.log(`✅ ${treatments.length} tratamientos creados`);

      // Generar dosis para los tratamientos
      await this.generateDosesForTreatments(treatments);
      console.log('✅ Dosis generadas');

      console.log('🎉 Datos de prueba generados exitosamente');
    } catch (error) {
      console.error('❌ Error al generar datos de prueba:', error);
      throw error;
    }
  }

  /**
   * Generar pacientes de prueba
   */
  private async generatePatients(): Promise<Patient[]> {
    const patients: Patient[] = [
      {
        id: 'patient_1',
        name: 'María García',
        age: 68,
        notes: 'Paciente con hipertensión y diabetes',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'patient_2',
        name: 'Juan Pérez',
        age: 45,
        notes: 'Tratamiento post-operatorio',
        createdAt: new Date().toISOString(),
      },
    ];

    for (const patient of patients) {
      await StorageService.savePatient(patient);
    }

    return patients;
  }

  /**
   * Generar tratamientos de prueba
   */
  private async generateTreatments(patients: Patient[]): Promise<Treatment[]> {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 7); // Comenzó hace 7 días

    const treatments: Treatment[] = [
      // Tratamientos para María García
      {
        id: 'treatment_1',
        medicationName: 'Losartán',
        dose: '50mg',
        frequency: 'daily',
        schedules: [
          {
            id: 'schedule_1_1',
            time: '08:00',
            enabled: true,
          },
          {
            id: 'schedule_1_2',
            time: '20:00',
            enabled: true,
          },
        ],
        patientId: patients[0].id,
        patientName: patients[0].name,
        startDate: startDate.toISOString(),
        endDate: undefined,
        notes: 'Para controlar la presión arterial',
        isActive: true,
        createdAt: startDate.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'treatment_2',
        medicationName: 'Metformina',
        dose: '850mg',
        frequency: 'daily',
        schedules: [
          {
            id: 'schedule_2_1',
            time: '07:30',
            enabled: true,
          },
          {
            id: 'schedule_2_2',
            time: '19:30',
            enabled: true,
          },
        ],
        patientId: patients[0].id,
        patientName: patients[0].name,
        startDate: startDate.toISOString(),
        endDate: undefined,
        notes: 'Para control de diabetes. Tomar con alimentos',
        isActive: true,
        createdAt: startDate.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'treatment_3',
        medicationName: 'Atorvastatina',
        dose: '20mg',
        frequency: 'daily',
        schedules: [
          {
            id: 'schedule_3_1',
            time: '22:00',
            enabled: true,
          },
        ],
        patientId: patients[0].id,
        patientName: patients[0].name,
        startDate: startDate.toISOString(),
        endDate: undefined,
        notes: 'Para control del colesterol. Tomar antes de dormir',
        isActive: true,
        createdAt: startDate.toISOString(),
        updatedAt: now.toISOString(),
      },
      // Tratamientos para Juan Pérez
      {
        id: 'treatment_4',
        medicationName: 'Amoxicilina',
        dose: '500mg',
        frequency: 'daily',
        schedules: [
          {
            id: 'schedule_4_1',
            time: '09:00',
            enabled: true,
          },
          {
            id: 'schedule_4_2',
            time: '15:00',
            enabled: true,
          },
          {
            id: 'schedule_4_3',
            time: '21:00',
            enabled: true,
          },
        ],
        patientId: patients[1].id,
        patientName: patients[1].name,
        startDate: startDate.toISOString(),
        endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Antibiótico post-operatorio por 14 días',
        isActive: true,
        createdAt: startDate.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'treatment_5',
        medicationName: 'Ibuprofeno',
        dose: '400mg',
        frequency: 'as_needed',
        schedules: [
          {
            id: 'schedule_5_1',
            time: '10:00',
            enabled: true,
          },
          {
            id: 'schedule_5_2',
            time: '18:00',
            enabled: true,
          },
        ],
        patientId: patients[1].id,
        patientName: patients[1].name,
        startDate: startDate.toISOString(),
        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Para el dolor. Solo si es necesario',
        isActive: true,
        createdAt: startDate.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    for (const treatment of treatments) {
      await StorageService.saveTreatment(treatment);
    }

    return treatments;
  }

  /**
   * Generar dosis para los tratamientos
   */
  private async generateDosesForTreatments(treatments: Treatment[]): Promise<void> {
    const now = new Date();

    for (const treatment of treatments) {
      const startDate = new Date(treatment.startDate);
      const endDate = treatment.endDate ? new Date(treatment.endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Generar dosis desde startDate hasta endDate o 30 días
      const daysToGenerate = Math.min(
        Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)),
        30
      );

      for (let day = 0; day < daysToGenerate; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);

        for (const schedule of treatment.schedules) {
          if (!schedule.enabled) continue;

          const [hours, minutes] = schedule.time.split(':').map(Number);
          const scheduledTime = new Date(currentDate);
          scheduledTime.setHours(hours, minutes, 0, 0);

          // Determinar el estado de la dosis
          let status: 'pending' | 'taken' | 'missed' | 'skipped' = 'pending';
          let takenAt: string | undefined;

          if (scheduledTime < now) {
            // La dosis ya pasó
            const random = Math.random();
            if (random < 0.75) {
              // 75% de probabilidad de haber sido tomada
              status = 'taken';
              // Simular que fue tomada dentro de 1 hora del horario programado
              const takenTime = new Date(scheduledTime.getTime() + Math.random() * 60 * 60 * 1000);
              takenAt = takenTime.toISOString();
            } else if (random < 0.90) {
              // 15% de probabilidad de haber sido omitida
              status = 'missed';
            } else {
              // 10% de probabilidad de haber sido saltada
              status = 'skipped';
            }
          }

          const dose: Dose = {
            id: `dose_${treatment.id}_${day}_${schedule.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            treatmentId: treatment.id,
            medicationName: treatment.medicationName,
            dose: treatment.dose,
            scheduledTime: scheduledTime.toISOString(),
            status,
            takenAt,
            createdAt: scheduledTime.toISOString(),
            updatedAt: takenAt || scheduledTime.toISOString(),
          };

          await StorageService.saveDose(dose);
        }
      }
    }
  }

  /**
   * Verificar si hay datos de prueba
   */
  async hasData(): Promise<boolean> {
    const treatments = await StorageService.getTreatments();
    return treatments.length > 0;
  }

  /**
   * Limpiar todos los datos
   */
  async clearAll(): Promise<void> {
    await StorageService.clearAll();
    console.log('🗑️  Todos los datos han sido eliminados');
  }
}

// Exportar una instancia única
export default new SeedDataService();