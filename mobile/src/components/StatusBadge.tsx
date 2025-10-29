/**
 * 状态徽章组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppState } from '../types';
import { STATE_LABELS, COLORS } from '../constants';

interface StatusBadgeProps {
  state: AppState;
}

export function StatusBadge({ state }: StatusBadgeProps) {
  const getBackgroundColor = () => {
    switch (state) {
      case 'focusing':
        return 'rgba(16, 185, 129, 0.3)';
      case 'resting':
        return 'rgba(59, 130, 246, 0.3)';
      case 'paused':
        return 'rgba(251, 191, 36, 0.3)';
      default:
        return 'rgba(255, 255, 255, 0.2)';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.text}>{STATE_LABELS[state]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
