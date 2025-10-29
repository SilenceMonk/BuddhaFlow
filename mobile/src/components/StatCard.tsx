/**
 * 统计卡片组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import { commonStyles } from '../constants/styles';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  progress?: number; // 0-100
}

export function StatCard({ title, value, subtitle, progress }: StatCardProps) {
  return (
    <View style={[commonStyles.card, styles.card]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {progress !== undefined && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  title: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.gray[800],
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
    marginTop: 5,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
});
