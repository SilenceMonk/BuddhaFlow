/**
 * 计时器显示组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

interface TimerProps {
  seconds: number;
  label?: string;
}

export function Timer({ seconds, label }: TimerProps) {
  const formatTime = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(seconds)}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  time: {
    fontSize: 56,
    fontWeight: '700',
    color: COLORS.white,
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 10,
  },
});
