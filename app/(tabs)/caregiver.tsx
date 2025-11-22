// app/(tabs)/caregiver.tsx
// Pantalla de vista para cuidadores - Supervisar tratamientos y adherencia

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TreatmentCard from '@/components/TreatmentCard';
import { useTreatments } from '@/hooks/useTreatments';
import { Treatment } from '@/types';
import { Colors, Typography, BorderRadius, Spacing, Layout, Shadows } from '@/constants/theme';

export default function CaregiverScreen() {
  const {
    treatments,
    doses,
    loading,
    getActiveTreatments,
    getTodayPendingDoses,
    getAdherenceStats,
    refresh,
  } = useTreatments();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Recargar datos cuando la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  // Obtener lista de pacientes únicos
  const patients = Array.from(
    new Set(treatments.map((t) => t.patientName))
  ).map((name) => ({
    name,
    treatments: treatments.filter((t) => t.patientName === name),
  }));

  // Filtrar tratamientos por paciente seleccionado
  const filteredTreatments = selectedPatient
    ? treatments.filter((t) => t.patientName === selectedPatient)
    : treatments;

  // Calcular estadísticas generales
  const todayDoses = getTodayPendingDoses();
  const activeTreatments = getActiveTreatments();

  const allDosesToday = doses.filter((d) => {
    const doseDate = new Date(d.scheduledTime).toDateString();
    const today = new Date().toDateString();
    return doseDate === today;
  });

  const overallStats = {
    totalTreatments: activeTreatments.length,
    pendingDoses: todayDoses.length,
    completedToday: allDosesToday.filter((d) => d.status === 'taken').length,
    missedToday: allDosesToday.filter((d) => d.status === 'missed').length,
    totalPatients: patients.length,
  };

  // Calcular adherencia general
  const calculateOverallAdherence = (): number => {
    if (activeTreatments.length === 0) return 0;
    
    const adherences = activeTreatments.map((t) => {
      const stats = getAdherenceStats(t.id);
      return stats.adherencePercentage;
    });

    const total = adherences.reduce((sum, val) => sum + val, 0);
    return Math.round(total / adherences.length);
  };

  const overallAdherence = calculateOverallAdherence();

  const handleNotifyPatient = () => {
    Alert.alert(
      'Enviar recordatorio',
      'Esta funcionalidad estará disponible próximamente para enviar recordatorios personalizados.',
      [{ text: 'OK' }]
    );
  };

  const handleViewDetails = (treatment: Treatment) => {
    const stats = getAdherenceStats(treatment.id);
    Alert.alert(
      treatment.medicationName,
      `Paciente: ${treatment.patientName}\n` +
        `Dosis: ${treatment.dose}\n` +
        `Adherencia: ${stats.adherencePercentage}%\n` +
        `Tomadas: ${stats.takenDoses}\n` +
        `Omitidas: ${stats.missedDoses}`,
      [{ text: 'Cerrar' }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vista de Cuidador</Text>
          <Text style={styles.headerSubtitle}>
            Supervisando {overallStats.totalPatients}{' '}
            {overallStats.totalPatients === 1 ? 'paciente' : 'pacientes'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notifyButton} onPress={handleNotifyPatient}>
          <Ionicons name="notifications-outline" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Resumen general */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Resumen del día</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.primary + '20' }]}>
                  <Ionicons name="medical" size={24} color={Colors.primary} />
                </View>
                <Text style={styles.summaryValue}>{overallStats.totalTreatments}</Text>
                <Text style={styles.summaryLabel}>Tratamientos activos</Text>
              </View>

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.warning + '20' }]}>
                  <Ionicons name="time" size={24} color={Colors.warning} />
                </View>
                <Text style={styles.summaryValue}>{overallStats.pendingDoses}</Text>
                <Text style={styles.summaryLabel}>Pendientes hoy</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.success + '20' }]}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                </View>
                <Text style={styles.summaryValue}>{overallStats.completedToday}</Text>
                <Text style={styles.summaryLabel}>Completadas</Text>
              </View>

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.error + '20' }]}>
                  <Ionicons name="close-circle" size={24} color={Colors.error} />
                </View>
                <Text style={styles.summaryValue}>{overallStats.missedToday}</Text>
                <Text style={styles.summaryLabel}>Omitidas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Adherencia general */}
        <View style={styles.adherenceSection}>
          <View style={styles.adherenceCard}>
            <View style={styles.adherenceHeader}>
              <Ionicons name="analytics" size={24} color={Colors.primary} />
              <Text style={styles.adherenceTitle}>Adherencia general</Text>
            </View>
            <View style={styles.adherenceContent}>
              <Text style={styles.adherencePercentage}>{overallAdherence}%</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${overallAdherence}%`,
                      backgroundColor:
                        overallAdherence >= 80
                          ? Colors.success
                          : overallAdherence >= 50
                          ? Colors.warning
                          : Colors.error,
                    },
                  ]}
                />
              </View>
              <Text style={styles.adherenceDescription}>
                {overallAdherence >= 80
                  ? '¡Excelente adherencia al tratamiento!'
                  : overallAdherence >= 50
                  ? 'Adherencia aceptable, se puede mejorar'
                  : 'Se necesita mejorar la adherencia'}
              </Text>
            </View>
          </View>
        </View>

        {/* Selector de pacientes */}
        {patients.length > 1 && (
          <View style={styles.patientSelectorSection}>
            <Text style={styles.sectionTitle}>Filtrar por paciente</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.patientSelector}
            >
              <TouchableOpacity
                style={[
                  styles.patientChip,
                  selectedPatient === null && styles.patientChipActive,
                ]}
                onPress={() => setSelectedPatient(null)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.patientChipText,
                    selectedPatient === null && styles.patientChipTextActive,
                  ]}
                >
                  Todos
                </Text>
              </TouchableOpacity>

              {patients.map((patient) => (
                <TouchableOpacity
                  key={patient.name}
                  style={[
                    styles.patientChip,
                    selectedPatient === patient.name && styles.patientChipActive,
                  ]}
                  onPress={() => setSelectedPatient(patient.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.patientChipContent}>
                    <Ionicons
                      name="person"
                      size={16}
                      color={
                        selectedPatient === patient.name ? Colors.textWhite : Colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.patientChipText,
                        selectedPatient === patient.name && styles.patientChipTextActive,
                      ]}
                    >
                      {patient.name}
                    </Text>
                    <View
                      style={[
                        styles.patientBadge,
                        selectedPatient === patient.name && styles.patientBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.patientBadgeText,
                          selectedPatient === patient.name && styles.patientBadgeTextActive,
                        ]}
                      >
                        {patient.treatments.length}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Lista de tratamientos */}
        <View style={styles.treatmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedPatient ? `Tratamientos de ${selectedPatient}` : 'Todos los tratamientos'}
            </Text>
            <Text style={styles.sectionCount}>{filteredTreatments.length}</Text>
          </View>

          {filteredTreatments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="medical-outline" size={60} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>No hay tratamientos</Text>
              <Text style={styles.emptyText}>
                {selectedPatient
                  ? 'Este paciente no tiene tratamientos activos'
                  : 'No hay tratamientos registrados'}
              </Text>
            </View>
          ) : (
            filteredTreatments.map((treatment) => {
              const stats = getAdherenceStats(treatment.id);
              return (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onPress={() => handleViewDetails(treatment)}
                  showStatus={true}
                  adherencePercentage={stats.adherencePercentage}
                />
              );
            })
          )}
        </View>

        {/* Alertas y recomendaciones */}
        {overallStats.missedToday > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertCard}>
              <View style={styles.alertHeader}>
                <Ionicons name="warning" size={24} color={Colors.error} />
                <Text style={styles.alertTitle}>Atención requerida</Text>
              </View>
              <Text style={styles.alertText}>
                Hay {overallStats.missedToday} {overallStats.missedToday === 1 ? 'dosis omitida' : 'dosis omitidas'} hoy.
                Considera contactar al paciente para recordarle sus medicamentos.
              </Text>
              <TouchableOpacity style={styles.alertButton} onPress={handleNotifyPatient}>
                <Text style={styles.alertButtonText}>Enviar recordatorio</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Consejos para cuidadores */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={24} color={Colors.secondary} />
              <Text style={styles.tipsTitle}>Consejos para cuidadores</Text>
            </View>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={styles.tipText}>
                  Revisa diariamente el estado de las tomas
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={styles.tipText}>
                  Mantén comunicación constante con el paciente
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.success} />
                <Text style={styles.tipText}>
                  Coordina con el médico en caso de problemas
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Layout.screenPaddingVertical + 40,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  notifyButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
  },
  summarySection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  summaryCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.lg,
    ...Shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  adherenceSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
  },
  adherenceCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  adherenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  adherenceTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
  },
  adherenceContent: {
    alignItems: 'center',
  },
  adherencePercentage: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  adherenceDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  patientSelectorSection: {
    paddingTop: Spacing.xl,
  },
  patientSelector: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    gap: Spacing.sm,
  },
  patientChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  patientChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  patientChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  patientChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  patientChipTextActive: {
    color: Colors.textWhite,
  },
  patientBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    minWidth: 20,
    alignItems: 'center',
  },
  patientBadgeActive: {
    backgroundColor: Colors.textWhite + '30',
  },
  patientBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  patientBadgeTextActive: {
    color: Colors.textWhite,
  },
  treatmentsSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionCount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  alertSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
  },
  alertCard: {
    backgroundColor: Colors.error + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  alertTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
  },
  alertText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
    marginBottom: Spacing.md,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  alertButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.primary,
  },
  tipsSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingTop: Spacing.xl,
  },
  tipsCard: {
    backgroundColor: Colors.secondary + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tipsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
  },
  tipsList: {
    gap: Spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
  },
});