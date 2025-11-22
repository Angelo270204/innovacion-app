// components/DebugInfo.tsx
// Componente de información de debug para desarrollo

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface DebugInfoProps {
  data?: Record<string, any>;
  visible?: boolean;
}

export const DebugInfo: React.FC<DebugInfoProps> = ({ data = {}, visible = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!__DEV__ || !visible) {
    return null;
  }

  return (
    <>
      {/* Botón flotante */}
      <TouchableOpacity
        style={styles.debugButton}
        onPress={() => setIsExpanded(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="bug" size={24} color={Colors.textWhite} />
      </TouchableOpacity>

      {/* Modal con información */}
      <Modal
        visible={isExpanded}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsExpanded(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Ionicons name="bug" size={24} color={Colors.error} />
                <Text style={styles.title}>Debug Info</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsExpanded(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Environment</Text>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Mode:</Text>
                  <Text style={styles.infoValue}>Development</Text>
                </View>
              </View>

              {Object.keys(data).length > 0 && (
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Custom Data</Text>
                  {Object.entries(data).map(([key, value]) => (
                    <View key={key} style={styles.infoItem}>
                      <Text style={styles.infoLabel}>{key}:</Text>
                      <Text style={styles.infoValue}>
                        {typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : String(value)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>App Info</Text>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Version:</Text>
                  <Text style={styles.infoValue}>1.0.0 (MVP)</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Platform:</Text>
                  <Text style={styles.infoValue}>
                    {require('react-native').Platform.OS}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.large,
    zIndex: 9999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
    ...Shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
});

export default DebugInfo;