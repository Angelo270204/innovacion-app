// app/(tabs)/treatments.tsx
// Pantalla de lista de tratamientos

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
import TreatmentCard from '@/components/TreatmentCard';
import CustomButton from '@/components/CustomButton';
import { useTreatments } from '@/hooks/useTreatments';
import { Treatment } from '@/types';
import { Colors, Typography, BorderRadius, Spacing, Layout, Shadows } from '@/constants/theme';

export default function TreatmentsScreen() {
  const {
    treatments,
    loading,
    deleteTreatment,
    getAdherenceStats,
    refresh,
  } = useTreatments();

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

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

  const handleAddTreatment = () => {
    // TODO: Navegar a pantalla de creación de tratamiento
    Alert.alert(
      'Próximamente',
      'La funcionalidad de agregar tratamiento estará disponible pronto.',
      [{ text: 'OK' }]
    );
  };

  const handleTreatmentPress = (treatment: Treatment) => {
    // TODO: Navegar a pantalla de detalle/edición
    Alert.alert(
      treatment.medicationName,
      `Dosis: ${treatment.dose}\nPaciente: ${treatment.patientName}`,
      [
        {
          text: 'Editar',
          onPress: () => {
            Alert.alert('Editar', 'Funcionalidad próximamente');
          },
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleDeleteTreatment(treatment),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleDeleteTreatment = (treatment: Treatment) => {
    Alert.alert(
      'Eliminar tratamiento',
      `¿Estás seguro de eliminar "${treatment.medicationName}"? Esta acción no se puede deshacer.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTreatment(treatment.id);
            if (success) {
              Alert.alert('Éxito', 'Tratamiento eliminado correctamente');
            } else {
              Alert.alert('Error', 'No se pudo eliminar el tratamiento');
            }
          },
        },
      ]
    );
  };

  // Filtrar tratamientos según el filtro seleccionado
  const filteredTreatments = treatments.filter((treatment) => {
    if (filter === 'active') return treatment.isActive;
    if (filter === 'inactive') return !treatment.isActive;
    return true;
  });

  // Agrupar tratamientos por paciente
  const groupedTreatments = filteredTreatments.reduce((groups, treatment) => {
    const patientName = treatment.patientName;
    if (!groups[patientName]) {
      groups[patientName] = [];
    }
    groups[patientName].push(treatment);
    return groups;
  }, {} as Record<string, Treatment[]>);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tratamientos</Text>
          <Text style={styles.headerSubtitle}>
            {filteredTreatments.length} {filteredTreatments.length === 1 ? 'tratamiento' : 'tratamientos'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTreatment}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={40} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
            onPress={() => setFilter('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'active' && styles.filterChipActive]}
            onPress={() => setFilter('active')}
            activeOpacity={0.7}
          >
            <View style={styles.filterChipContent}>
              <View style={[styles.filterDot, { backgroundColor: Colors.success }]} />
              <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
                Activos
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'inactive' && styles.filterChipActive]}
            onPress={() => setFilter('inactive')}
            activeOpacity={0.7}
          >
            <View style={styles.filterChipContent}>
              <View style={[styles.filterDot, { backgroundColor: Colors.textLight }]} />
              <Text style={[styles.filterText, filter === 'inactive' && styles.filterTextActive]}>
                Inactivos
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de tratamientos */}
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
        {filteredTreatments.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name={filter === 'all' ? 'medical-outline' : 'filter-outline'}
                size={80}
                color={Colors.textLight}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {filter === 'all'
                ? 'No hay tratamientos'
                : filter === 'active'
                ? 'No hay tratamientos activos'
                : 'No hay tratamientos inactivos'}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Agrega tu primer tratamiento para comenzar'
                : 'Cambia el filtro para ver otros tratamientos'}
            </Text>
            {filter === 'all' && (
              <CustomButton
                title="Agregar tratamiento"
                onPress={handleAddTreatment}
                variant="primary"
                size="medium"
                icon={<Ionicons name="add" size={20} color={Colors.textWhite} />}
                style={styles.emptyButton}
              />
            )}
          </View>
        ) : (
          <>
            {/* Agrupados por paciente */}
            {Object.entries(groupedTreatments).map(([patientName, patientTreatments]) => (
              <View key={patientName} style={styles.patientGroup}>
                <View style={styles.patientHeader}>
                  <Ionicons name="person" size={20} color={Colors.primary} />
                  <Text style={styles.patientName}>{patientName}</Text>
                  <View style={styles.patientBadge}>
                    <Text style={styles.patientBadgeText}>
                      {patientTreatments.length}
                    </Text>
                  </View>
                </View>

                {patientTreatments.map((treatment) => {
                  const stats = getAdherenceStats(treatment.id);
                  return (
                    <TreatmentCard
                      key={treatment.id}
                      treatment={treatment}
                      onPress={() => handleTreatmentPress(treatment)}
                      showStatus={true}
                      adherencePercentage={stats.adherencePercentage}
                    />
                  );
                })}
              </View>
            ))}
          </>
        )}

        {/* Información adicional */}
        {filteredTreatments.length > 0 && (
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Consejos</Text>
              <Text style={styles.infoText}>
                • Mantén tus tratamientos actualizados{'\n'}
                • Revisa regularmente tu adherencia{'\n'}
                • Consulta con tu médico ante cualquier duda
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón flotante para agregar */}
      {filteredTreatments.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddTreatment}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={32} color={Colors.textWhite} />
        </TouchableOpacity>
      )}
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
  addButton: {
    padding: 4,
  },
  filtersContainer: {
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  filters: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  filterTextActive: {
    color: Colors.textWhite,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing['4xl'],
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
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
  patientGroup: {
    marginTop: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  patientName: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
  },
  patientBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  patientBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Layout.screenPaddingHorizontal,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Layout.screenPaddingHorizontal,
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.large,
  },
});