/**
 * 统计屏幕 - 显示图表和数据分析
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useBuddhaFlow } from '../hooks/useBuddhaFlow';
import { COLORS } from '../constants';
import { commonStyles } from '../constants/styles';

export function StatsScreen() {
  const { sessions } = useBuddhaFlow();

  // 计算过去7天的数据
  const last7DaysData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    return last7Days.map(date => {
      const total = sessions
        .filter(s => s.date === date)
        .reduce((sum, s) => sum + s.focusDuration, 0);
      return {
        date,
        hours: total / 3600,
        label: new Date(date).toLocaleDateString('zh-CN', {
          month: 'numeric',
          day: 'numeric',
        }),
      };
    });
  }, [sessions]);

  const maxHours = Math.max(...last7DaysData.map(d => d.hours), 1);

  // 计算24小时热力图数据
  const heatmapData = useMemo(() => {
    const hourlyData = new Array(24).fill(0);
    sessions.forEach(session => {
      hourlyData[session.hourOfDay] += session.focusDuration / 3600;
    });
    return hourlyData;
  }, [sessions]);

  const maxHeatmapHours = Math.max(...heatmapData, 0.1);

  // 获取热力图颜色级别
  const getHeatmapLevel = (hours: number): number => {
    if (hours === 0) return 0;
    return Math.ceil((hours / maxHeatmapHours) * 5);
  };

  const getHeatmapColor = (level: number): string => {
    const colors = [
      COLORS.gray[200],
      '#ddd6fe',
      '#c4b5fd',
      '#a78bfa',
      '#8b5cf6',
      '#7c3aed',
    ];
    return colors[level] || colors[0];
  };

  return (
    <ScrollView style={styles.container}>
      {/* 过去7天图表 */}
      <View style={[commonStyles.card, styles.chartCard]}>
        <Text style={styles.chartTitle}>过去7天专注时间</Text>
        <View style={styles.chartContainer}>
          {last7DaysData.map((day, index) => {
            const heightPercentage = (day.hours / maxHours) * 100;
            return (
              <View key={day.date} style={styles.barWrapper}>
                <View style={styles.barContainer}>
                  {day.hours > 0 && (
                    <Text style={styles.barValue}>{day.hours.toFixed(1)}h</Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(heightPercentage, 5)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{day.label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* 24小时热力图 */}
      <View style={[commonStyles.card, styles.chartCard]}>
        <Text style={styles.chartTitle}>24小时效率热力图</Text>
        <Text style={styles.chartSubtitle}>
          显示你在一天中不同时段的专注表现，颜色越深表示该时段专注时间越长
        </Text>
        <View style={styles.heatmapContainer}>
          {heatmapData.map((hours, hour) => {
            const level = getHeatmapLevel(hours);
            return (
              <View
                key={hour}
                style={[
                  styles.heatmapCell,
                  { backgroundColor: getHeatmapColor(level) },
                ]}
              >
                {hours > 0 && (
                  <Text style={styles.heatmapValue}>{hours.toFixed(1)}</Text>
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.heatmapLabels}>
          {Array.from({ length: 24 }).map((_, hour) => (
            <Text
              key={hour}
              style={[
                styles.heatmapLabel,
                hour % 3 !== 0 && styles.heatmapLabelHidden,
              ]}
            >
              {hour % 3 === 0 ? hour : ''}
            </Text>
          ))}
        </View>
      </View>

      {/* 总结统计 */}
      <View style={[commonStyles.card, styles.summaryCard]}>
        <Text style={styles.summaryTitle}>总体统计</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>总专注次数：</Text>
          <Text style={styles.summaryValue}>{sessions.length}次</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>总专注时长：</Text>
          <Text style={styles.summaryValue}>
            {(sessions.reduce((sum, s) => sum + s.focusDuration, 0) / 3600).toFixed(1)}小时
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>平均每次：</Text>
          <Text style={styles.summaryValue}>
            {sessions.length > 0
              ? (
                  sessions.reduce((sum, s) => sum + s.focusDuration, 0) /
                  sessions.length /
                  60
                ).toFixed(1)
              : 0}
            分钟
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  chartCard: {
    margin: 20,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginBottom: 10,
  },
  chartSubtitle: {
    fontSize: 14,
    color: COLORS.gray[500],
    lineHeight: 20,
    marginBottom: 15,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 200,
    marginVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gray[200],
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  bar: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    minHeight: 5,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.gray[700],
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 11,
    color: COLORS.gray[500],
    marginTop: 5,
  },
  heatmapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
    marginHorizontal: -2,
  },
  heatmapCell: {
    width: '4.16%', // 100% / 24
    aspectRatio: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  heatmapValue: {
    fontSize: 8,
    color: COLORS.white,
    fontWeight: '600',
  },
  heatmapLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  heatmapLabel: {
    flex: 1,
    fontSize: 10,
    color: COLORS.gray[500],
    textAlign: 'center',
  },
  heatmapLabelHidden: {
    opacity: 0,
  },
  summaryCard: {
    margin: 20,
    marginTop: 0,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.gray[600],
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
