/**
 * 24小时效率热力图
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HeatMap({ sessions }) {
  // 计算每小时的专注时间
  const hourlyData = new Array(24).fill(0);
  sessions.forEach((session) => {
    hourlyData[session.hourOfDay] += session.focusDuration / 3600;
  });

  const maxHours = Math.max(...hourlyData, 0.1);

  // 获取颜色等级
  const getColorLevel = (hours) => {
    if (hours === 0) return '#e2e8f0';

    const level = Math.ceil((hours / maxHours) * 5);
    const colors = {
      1: '#ddd6fe',
      2: '#c4b5fd',
      3: '#a78bfa',
      4: '#8b5cf6',
      5: '#7c3aed',
    };
    return colors[level] || colors[1];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>24小时效率热力图</Text>
      <Text style={styles.info}>
        显示你在一天中不同时段的专注表现，颜色越深表示该时段专注时间越长
      </Text>

      <View style={styles.heatmapContainer}>
        {hourlyData.map((hours, hour) => (
          <TouchableOpacity
            key={hour}
            style={[
              styles.cell,
              { backgroundColor: getColorLevel(hours) },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.cellTooltip}>
              {hour}:00 - {hours.toFixed(1)}h
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labelsContainer}>
        {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
          <View key={hour} style={styles.labelWrapper}>
            <Text style={styles.label}>{hour}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  info: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  heatmapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 20,
  },
  cell: {
    width: '3.8%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  cellTooltip: {
    fontSize: 0, // 隐藏文字，仅作为可访问性标签
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 5,
  },
  labelWrapper: {
    width: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    color: '#64748b',
  },
});
