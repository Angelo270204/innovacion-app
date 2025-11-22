// app/(tabs)/index.tsx
// Pantalla de inicio - Muestra las próximas tomas del día

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
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DoseCard from '@/components/DoseCard';
import CustomButton from '@/components/CustomButton';
import Snackbar from '@/components/Snackbar';
import { useTreatments } from '@/hooks/useTreatments';
import { useSnackbar } from '@/hooks/useSnackbar';
import SeedDataService from '@/services/seed-data.service';
import DevConfig from '@/constants/dev-config';
import { Colors, Typography, BorderRadius, Spacing, Layout, Shadows } from '@/constants/theme';

export default function HomeScreen() {
  const {
    doses,
    loading,
    getTodayPendingDoses,
    getActiveTreatments,
    markDoseAsTaken,
    markDoseAsMissed,
    markDoseAsSkipped,
    refresh,
  } = useTreatments();

  const { snackbar, showSuccess, showError, hideSnackbar } = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);

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

  const handleMarkAsTaken = async (doseId: string) => {
    try {
      const dose = doses.find(d => d.id === doseId);
      await markDoseAsTaken(doseId);
      showSuccess(
        dose 
          ? `¡${dose.medicationName} marcada como tomada! 💊`
          : '¡Dosis marcada como tomada! 💊',
        {
          label: 'Deshacer',
          onPress: async () => {
            // Revertir a pendiente
            if (dose) {
              await markDoseAsSkipped(doseId);
              await refresh();
            }
          }
        }
      );
    } catch (error) {
      showError('Error al marcar la dosis');
    }
  };

  const handleMarkAsMissed = async (doseId: string) => {
    try {
      const dose = doses.find(d => d.id === doseId);
      await markDoseAsMissed(doseId);
      showError(
        dose 
          ? `${dose.medicationName} marcada como omitida ⚠️`
          : 'Dosis marcada como omitida ⚠️'
      );
    } catch (error) {
      showError('Error al marcar la dosis');
    }
  };

  const handleMarkAsSkipped = async (doseId: string) => {
    try {
      const dose = doses.find(d => d.id === doseId);
      await markDoseAsSkipped(doseId);
      showSuccess(
        dose 
          ? `${dose.medicationName} saltada correctamente ⏭️`
          : 'Dosis saltada correctamente'
      );
    } catch (error) {
      showError('Error al saltar la dosis');
    }
  };

  const todayDoses = getTodayPendingDoses();
  const activeTreatments = getActiveTreatments();

  // Obtener la próxima dosis
  const nextDose = todayDoses.length > 0 ? todayDoses[0] : null;

  // Función para generar datos de prueba (solo desarrollo)
  const handleGenerateSampleData = async () => {
    Alert.alert(
      'Generar datos de prueba',
      '¿Deseas generar datos de prueba? Esto reemplazará todos los datos existentes.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Generar',
          onPress: async () => {
            try {
              await SeedDataService.seedAll();
              await refresh();
              Alert.alert('Éxito', 'Datos de prueba generados correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron generar los datos de prueba');
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Limpiar datos',
      '¿Estás seguro de eliminar todos los datos? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await SeedDataService.clearAll();
              await refresh();
              Alert.alert('Éxito', 'Todos los datos han sido eliminados');
            } catch (error) {
              Alert.alert('Error', 'No se pudieron eliminar los datos');
            }
          },
        },
      ]
    );
  };

  // Calcular estadísticas del día
  const todayStats = {
    total: doses.filter(d => {
      const doseDate = new Date(d.scheduledTime).toDateString();
      const today = new Date().toDateString();
      return doseDate === today;
    }).length,
    taken: doses.filter(d => {
      const doseDate = new Date(d.scheduledTime).toDateString();
      const today = new Date().toDateString();
      return doseDate === today && d.status === 'taken';
    }).length,
    pending: todayDoses.length,
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola!</Text>
          <Text style={styles.headerTitle}>Tus medicamentos de hoy</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
          <Ionicons name="person-circle-outline" size={40} color={Colors.primary} />
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
        {/* Estadísticas del día */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={[styles.statItem, styles.statItemBorder]}>
              <Text style={styles.statValue}>{todayStats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statItem, styles.statItemBorder]}>
              <Text style={[styles.statValue, { color: Colors.success }]}>
                {todayStats.taken}
              </Text>
              <Text style={styles.statLabel}>Tomadas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.warning }]}>
                {todayStats.pending}
              </Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
          </View>
        </View>

        {/* Próxima dosis destacada */}
        {nextDose && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alarm" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Próxima toma</Text>
            </View>
            <DoseCard
              dose={nextDose}
              onMarkAsTaken={handleMarkAsTaken}
              onMarkAsMissed={handleMarkAsMissed}
              onMarkAsSkipped={handleMarkAsSkipped}
              showActions={true}
            />
          </View>
        )}

        {/* Lista de dosis pendientes del día */}
        {todayDoses.length > 1 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={20} color={Colors.textSecondary} />
              <Text style={styles.sectionTitle}>Siguientes tomas</Text>
            </View>
            {todayDoses.slice(1).map((dose) => (
              <DoseCard
                key={dose.id}
                dose={dose}
                onMarkAsTaken={handleMarkAsTaken}
                onMarkAsMissed={handleMarkAsMissed}
                onMarkAsSkipped={handleMarkAsSkipped}
                showActions={true}
              />
            ))}
          </View>
        )}

        {/* Si no hay dosis pendientes */}
        {todayDoses.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
            </View>
            <Text style={styles.emptyTitle}>¡Todo al día!</Text>
            <Text style={styles.emptyText}>
              {todayStats.total > 0
                ? 'Has completado todas tus tomas de hoy'
                : 'No tienes medicamentos programados para hoy'}
            </Text>
          </View>
        )}

        {/* Tratamientos activos */}
        {activeTreatments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medical" size={20} color={Colors.textSecondary} />
              <Text style={styles.sectionTitle}>Tratamientos activos</Text>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/treatments')}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>Ver todos</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.treatmentsList}>
              {activeTreatments.slice(0, 3).map((treatment) => (
                <View key={treatment.id} style={styles.treatmentItem}>
                  <View style={styles.treatmentIcon}>
                    <Ionicons name="medical" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.treatmentInfo}>
                    <Text style={styles.treatmentName}>{treatment.medicationName}</Text>
                    <Text style={styles.treatmentDose}>{treatment.dose}</Text>
                  </View>
                  <View style={styles.activeBadge}>
                    <View style={styles.activeDot} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Si no hay tratamientos */}
        {activeTreatments.length === 0 && todayDoses.length === 0 && (
          <View style={styles.section}>
            <View style={styles.emptyTreatments}>
              <Ionicons name="add-circle-outline" size={60} color={Colors.primary} />
              <Text style={styles.emptyTreatmentsTitle}>
                Comienza a gestionar tus medicamentos
              </Text>
              <Text style={styles.emptyTreatmentsText}>
                Agrega tu primer tratamiento para recibir recordatorios personalizados
              </Text>
              <CustomButton
                title="Agregar tratamiento"
                onPress={() => router.push('/(tabs)/treatments')}
                variant="primary"
                size="medium"
                icon={<Ionicons name="add" size={20} color={Colors.textWhite} />}
                style={styles.addButton}
              />
            </View>
          </View>
        )}

        {/* Accesos rápidos */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Accesos rápidos</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/treatments')}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={32} color={Colors.primary} />
              <Text style={styles.quickActionText}>Nuevo tratamiento</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/history')}
              activeOpacity={0.7}
            >
              <Ionicons name="stats-chart" size={32} color={Colors.secondary} />
              <Text style={styles.quickActionText}>Ver historial</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botones de desarrollo - Solo para testing */}
        {__DEV__ && DevConfig.SHOW_DEV_TOOLS && (
          <View style={styles.devSection}>
            <Text style={styles.devTitle}>🛠️ Modo desarrollo</Text>
            <View style={styles.devButtons}>
              <CustomButton
                title="Generar datos de prueba"
                onPress={handleGenerateSampleData}
                variant="secondary"
                size="small"
                icon={<Ionicons name="flask" size={16} color={Colors.textWhite} />}
              />
              <CustomButton
                title="Limpiar todos los datos"
                onPress={handleClearAllData}
                variant="danger"
                size="small"
                icon={<Ionicons name="trash" size={16} color={Colors.textWhite} />}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={hideSnackbar}
        action={snackbar.action}
      />
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
  greeting: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  profileButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  statsContainer: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.lg,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemBorder: {
    borderRightWidth: 1,
    borderRightColor: Colors.divider,
  },
  statValue: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  sectionTitle: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
  },
  treatmentsList: {
    gap: Spacing.sm,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.small,
  },
  treatmentIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  treatmentDose: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  activeBadge: {
    marginLeft: Spacing.sm,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
  },
  emptyTreatments: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    ...Shadows.small,
  },
  emptyTreatmentsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyTreatmentsText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.lg,
  },
  addButton: {
    marginTop: Spacing.sm,
  },
  quickActions: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    marginTop: Spacing.lg,
  },
  quickActionsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    ...Shadows.small,
  },
  quickActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  devSection: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    marginTop: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.lg,
    marginHorizontal: Layout.screenPaddingHorizontal,
  },
  devTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  devButtons: {
    gap: Spacing.sm,
  },
});