// app/(tabs)/history.tsx
// Pantalla de historial de tomas de medicamentos

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DoseCard from '@/components/DoseCard';
import { useTreatments } from '@/hooks/useTreatments';
import { Dose } from '@/types';
import { Colors, Typography, BorderRadius, Spacing, Layout, Shadows } from '@/constants/theme';

export default function HistoryScreen() {
  const { doses, loading, getDosesHistory, refresh } = useTreatments();

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'taken' | 'missed' | 'skipped'>('all');
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

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

  // Filtrar dosis por estado
  const getFilteredDoses = (): Dose[] => {
    let filtered = getDosesHistory();

    // Filtrar por estado
    if (filter !== 'all') {
      filtered = filtered.filter((dose) => dose.status === filter);
    }

    // Filtrar por período
    const now = new Date();
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(
        (dose) =>
          new Date(dose.takenAt || dose.scheduledTime) >= weekAgo
      );
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(
        (dose) =>
          new Date(dose.takenAt || dose.scheduledTime) >= monthAgo
      );
    }

    return filtered;
  };

  const filteredDoses = getFilteredDoses();

  // Agrupar dosis por fecha
  const groupedDoses = filteredDoses.reduce((groups, dose) => {
    const date = new Date(dose.takenAt || dose.scheduledTime);
    const dateKey = date.toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(dose);
    return groups;
  }, {} as Record<string, Dose[]>);

  // Calcular estadísticas
  const stats = {
    total: filteredDoses.length,
    taken: filteredDoses.filter((d) => d.status === 'taken').length,
    missed: filteredDoses.filter((d) => d.status === 'missed').length,
    skipped: filteredDoses.filter((d) => d.status === 'skipped').length,
  };

  const adherencePercentage =
    stats.total > 0
      ? Math.round((stats.taken / (stats.taken + stats.missed)) * 100)
      : 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Historial</Text>
          <Text style={styles.headerSubtitle}>
            {filteredDoses.length} {filteredDoses.length === 1 ? 'registro' : 'registros'}
          </Text>
        </View>
      </View>

      {/* Estadísticas de adherencia */}
      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.adherenceCircle}>
            <Text style={styles.adherencePercentage}>{adherencePercentage}%</Text>
            <Text style={styles.adherenceLabel}>Adherencia</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: Colors.doseTaken }]} />
              <Text style={styles.statValue}>{stats.taken}</Text>
              <Text style={styles.statLabel}>Tomadas</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: Colors.doseMissed }]} />
              <Text style={styles.statValue}>{stats.missed}</Text>
              <Text style={styles.statLabel}>Omitidas</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statDot, { backgroundColor: Colors.doseSkipped }]} />
              <Text style={styles.statValue}>{stats.skipped}</Text>
              <Text style={styles.statLabel}>Saltadas</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filtros de período */}
      <View style={styles.periodFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.periodFilters}
        >
          <TouchableOpacity
            style={[styles.periodChip, period === 'week' && styles.periodChipActive]}
            onPress={() => setPeriod('week')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>
              Última semana
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodChip, period === 'month' && styles.periodChipActive]}
            onPress={() => setPeriod('month')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>
              Último mes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.periodChip, period === 'all' && styles.periodChipActive]}
            onPress={() => setPeriod('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.periodText, period === 'all' && styles.periodTextActive]}>
              Todo
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Filtros de estado */}
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
              Todas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'taken' && styles.filterChipActive]}
            onPress={() => setFilter('taken')}
            activeOpacity={0.7}
          >
            <View style={styles.filterChipContent}>
              <View style={[styles.filterDot, { backgroundColor: Colors.doseTaken }]} />
              <Text style={[styles.filterText, filter === 'taken' && styles.filterTextActive]}>
                Tomadas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'missed' && styles.filterChipActive]}
            onPress={() => setFilter('missed')}
            activeOpacity={0.7}
          >
            <View style={styles.filterChipContent}>
              <View style={[styles.filterDot, { backgroundColor: Colors.doseMissed }]} />
              <Text style={[styles.filterText, filter === 'missed' && styles.filterTextActive]}>
                Omitidas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, filter === 'skipped' && styles.filterChipActive]}
            onPress={() => setFilter('skipped')}
            activeOpacity={0.7}
          >
            <View style={styles.filterChipContent}>
              <View style={[styles.filterDot, { backgroundColor: Colors.doseSkipped }]} />
              <Text style={[styles.filterText, filter === 'skipped' && styles.filterTextActive]}>
                Saltadas
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de dosis */}
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
        {filteredDoses.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="calendar-outline" size={80} color={Colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No hay registros</Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'No hay dosis registradas en este período'
                : 'No hay dosis con este estado en el período seleccionado'}
            </Text>
          </View>
        ) : (
          <>
            {Object.entries(groupedDoses).map(([date, dateDoses]) => (
              <View key={date} style={styles.dateGroup}>
                <View style={styles.dateHeader}>
                  <Ionicons name="calendar" size={16} color={Colors.primary} />
                  <Text style={styles.dateText}>{date}</Text>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeText}>{dateDoses.length}</Text>
                  </View>
                </View>

                {dateDoses.map((dose) => (
                  <DoseCard key={dose.id} dose={dose} showActions={false} compact={false} />
                ))}
              </View>
            ))}
          </>
        )}

        {/* Información adicional */}
        {filteredDoses.length > 0 && (
          <View style={styles.infoCard}>
            <Ionicons name="analytics-outline" size={24} color={Colors.success} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Resumen</Text>
              <Text style={styles.infoText}>
                Tu adherencia al tratamiento es del {adherencePercentage}%.
                {adherencePercentage >= 80
                  ? ' ¡Excelente trabajo!'
                  : adherencePercentage >= 50
                  ? ' Sigue así, puedes mejorar.'
                  : ' Intenta no omitir tus medicamentos.'}
              </Text>
            </View>
          </View>
        )}
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
  statsContainer: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.lg,
  },
  statsCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.medium,
  },
  adherenceCircle: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  adherencePercentage: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  adherenceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statDot: {
    width: 12,
    height: 12,
    borderRadius: BorderRadius.full,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  periodFiltersContainer: {
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  periodFilters: {
    paddingHorizontal: Layout.screenPaddingHorizontal,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  periodChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  periodChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  periodText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text,
  },
  periodTextActive: {
    color: Colors.textWhite,
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
  },
  dateGroup: {
    marginTop: Spacing.lg,
    paddingHorizontal: Layout.screenPaddingHorizontal,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  dateText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    textTransform: 'capitalize',
  },
  dateBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  dateBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.success + '10',
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
});