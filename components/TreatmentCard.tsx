// components/TreatmentCard.tsx
// Tarjeta para mostrar información de un tratamiento

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Treatment } from '@/types';
import { Colors, Typography, BorderRadius, Spacing, Shadows, Layout } from '@/constants/theme';

interface TreatmentCardProps {
  treatment: Treatment;
  onPress?: () => void;
  showStatus?: boolean;
  adherencePercentage?: number;
  style?: ViewStyle;
}

export const TreatmentCard: React.FC<TreatmentCardProps> = ({
  treatment,
  onPress,
  showStatus = true,
  adherencePercentage,
  style,
}) => {
  // Función para formatear la frecuencia
  const getFrequencyText = (): string => {
    switch (treatment.frequency) {
      case 'daily':
        return 'Diariamente';
      case 'every_hours':
        return 'Cada X horas';
      case 'weekly':
        return 'Semanalmente';
      case 'as_needed':
        return 'Según necesidad';
      default:
        return 'Personalizado';
    }
  };

  // Función para formatear los horarios
  const getSchedulesText = (): string => {
    if (treatment.schedules.length === 0) return 'Sin horarios';
    if (treatment.schedules.length === 1) return treatment.schedules[0].time;
    return `${treatment.schedules.length} tomas/día`;
  };

  // Obtener color de adherencia
  const getAdherenceColor = (): string => {
    if (!adherencePercentage) return Colors.textLight;
    if (adherencePercentage >= 80) return Colors.success;
    if (adherencePercentage >= 50) return Colors.warning;
    return Colors.error;
  };

  const CardContent = (
    <View style={[styles.card, style]}>
      {/* Header con nombre del medicamento */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="medical" size={24} color={Colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.medicationName} numberOfLines={1}>
            {treatment.medicationName}
          </Text>
          <Text style={styles.dose}>{treatment.dose}</Text>
        </View>
        {treatment.isActive && (
          <View style={styles.activeIndicator}>
            <View style={styles.activeDot} />
          </View>
        )}
      </View>

      {/* Información del paciente */}
      <View style={styles.patientInfo}>
        <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
        <Text style={styles.patientName}>{treatment.patientName}</Text>
      </View>

      {/* Detalles del tratamiento */}
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{getSchedulesText()}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="repeat-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.detailText}>{getFrequencyText()}</Text>
        </View>
      </View>

      {/* Fechas */}
      <View style={styles.dates}>
        <Text style={styles.dateText}>
          Inicio: {new Date(treatment.startDate).toLocaleDateString('es-PE')}
        </Text>
        {treatment.endDate && (
          <Text style={styles.dateText}>
            • Fin: {new Date(treatment.endDate).toLocaleDateString('es-PE')}
          </Text>
        )}
      </View>

      {/* Barra de adherencia (si se proporciona) */}
      {showStatus && adherencePercentage !== undefined && (
        <View style={styles.adherenceContainer}>
          <View style={styles.adherenceHeader}>
            <Text style={styles.adherenceLabel}>Adherencia</Text>
            <Text style={[styles.adherencePercentage, { color: getAdherenceColor() }]}>
              {adherencePercentage}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${adherencePercentage}%`,
                  backgroundColor: getAdherenceColor(),
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Notas (si existen) */}
      {treatment.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text-outline" size={14} color={Colors.textLight} />
          <Text style={styles.notes} numberOfLines={2}>
            {treatment.notes}
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Layout.cardPadding,
    marginVertical: Spacing.sm,
    ...Shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  medicationName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  dose: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  activeIndicator: {
    marginLeft: Spacing.sm,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.sm,
    gap: 6,
  },
  patientName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  dates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  dateText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
  },
  adherenceContainer: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  adherenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  adherenceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  adherencePercentage: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.backgroundDark,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 6,
  },
  notes: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
});

export default TreatmentCard;