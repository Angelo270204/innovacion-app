// components/DoseCard.tsx
// Tarjeta para mostrar una dosis individual de medicamento

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dose, DoseStatus } from '@/types';
import { Colors, Typography, BorderRadius, Spacing, Shadows, Layout } from '@/constants/theme';

interface DoseCardProps {
  dose: Dose;
  onMarkAsTaken?: (doseId: string) => void;
  onMarkAsMissed?: (doseId: string) => void;
  onMarkAsSkipped?: (doseId: string) => void;
  onPress?: () => void;
  showActions?: boolean;
  compact?: boolean;
  style?: ViewStyle;
}

export const DoseCard: React.FC<DoseCardProps> = ({
  dose,
  onMarkAsTaken,
  onMarkAsMissed,
  onMarkAsSkipped,
  onPress,
  showActions = true,
  compact = false,
  style,
}) => {
  // Obtener el color según el estado
  const getStatusColor = (status: DoseStatus): string => {
    switch (status) {
      case 'pending':
        return Colors.dosePending;
      case 'taken':
        return Colors.doseTaken;
      case 'missed':
        return Colors.doseMissed;
      case 'skipped':
        return Colors.doseSkipped;
      default:
        return Colors.textLight;
    }
  };

  // Obtener el texto del estado
  const getStatusText = (status: DoseStatus): string => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'taken':
        return 'Tomada';
      case 'missed':
        return 'Omitida';
      case 'skipped':
        return 'Saltada';
      default:
        return 'Desconocido';
    }
  };

  // Obtener el ícono según el estado
  const getStatusIcon = (status: DoseStatus): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'taken':
        return 'checkmark-circle';
      case 'missed':
        return 'close-circle';
      case 'skipped':
        return 'remove-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  // Formatear la hora de la dosis
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Formatear la fecha completa
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateStr = date.toLocaleDateString('es-PE');
    const todayStr = today.toLocaleDateString('es-PE');
    const yesterdayStr = yesterday.toLocaleDateString('es-PE');

    let dayText = dateStr;
    if (dateStr === todayStr) {
      dayText = 'Hoy';
    } else if (dateStr === yesterdayStr) {
      dayText = 'Ayer';
    }

    return `${dayText} • ${formatTime(dateString)}`;
  };

  // Verificar si la dosis está vencida
  const isOverdue = (): boolean => {
    if (dose.status !== 'pending') return false;
    return new Date(dose.scheduledTime) < new Date();
  };

  const statusColor = getStatusColor(dose.status);

  const CardContent = (
    <View style={[styles.card, compact && styles.cardCompact, style]}>
      {/* Indicador de estado (barra lateral) */}
      <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: statusColor + '20' }]}>
              <Ionicons 
                name={getStatusIcon(dose.status)} 
                size={compact ? 20 : 24} 
                color={statusColor} 
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.medicationName} numberOfLines={1}>
                {dose.medicationName}
              </Text>
              <Text style={styles.doseAmount}>{dose.dose}</Text>
            </View>
          </View>

          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {getStatusText(dose.status)}
            </Text>
          </View>
        </View>

        {/* Información de tiempo */}
        <View style={styles.timeInfo}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.timeText}>
            {dose.status === 'taken' && dose.takenAt
              ? `Tomada: ${formatDateTime(dose.takenAt)}`
              : `Programada: ${formatDateTime(dose.scheduledTime)}`}
          </Text>
        </View>

        {/* Advertencia si está vencida */}
        {isOverdue() && (
          <View style={styles.overdueWarning}>
            <Ionicons name="warning" size={14} color={Colors.error} />
            <Text style={styles.overdueText}>Dosis vencida</Text>
          </View>
        )}

        {/* Notas */}
        {dose.notes && !compact && (
          <View style={styles.notesContainer}>
            <Ionicons name="document-text-outline" size={12} color={Colors.textLight} />
            <Text style={styles.notes} numberOfLines={2}>
              {dose.notes}
            </Text>
          </View>
        )}

        {/* Acciones */}
        {showActions && dose.status === 'pending' && !compact && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonTaken]}
              onPress={() => onMarkAsTaken?.(dose.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark" size={18} color={Colors.textWhite} />
              <Text style={styles.actionButtonText}>Tomada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonMissed]}
              onPress={() => onMarkAsMissed?.(dose.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color={Colors.textWhite} />
              <Text style={styles.actionButtonText}>Omitida</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSkipped]}
              onPress={() => onMarkAsSkipped?.(dose.id)}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={18} color={Colors.textWhite} />
              <Text style={styles.actionButtonText}>Saltar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.small,
  },
  cardCompact: {
    marginVertical: Spacing.xs / 2,
  },
  statusIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  medicationName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: 2,
  },
  doseAmount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.backgroundDark,
    marginLeft: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: 6,
  },
  timeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  overdueWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error + '15',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    gap: 6,
  },
  overdueText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.xs,
    gap: 6,
  },
  notes: {
    flex: 1,
    fontSize: Typography.fontSize.xs,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  actionButtonTaken: {
    backgroundColor: Colors.doseTaken,
  },
  actionButtonMissed: {
    backgroundColor: Colors.doseMissed,
  },
  actionButtonSkipped: {
    backgroundColor: Colors.doseSkipped,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.textWhite,
  },
});

export default DoseCard;