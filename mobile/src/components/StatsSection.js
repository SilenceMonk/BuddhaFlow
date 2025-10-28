/**
 * 统计数据显示组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { calculateFocusTimeNeeded } from '../utils/timeCalculations';

export default function StatsSection({
  currentSessionFocusTime,
  restRequired,
  restStartRequired,
  currentRestTime,
  state,
  stats,
  effectiveFocusTime,
}) {
  // 计算显示的休息时间
  const getRestDisplay = () => {
    if (state === 'resting') {
      const restActualMinutes = currentRestTime / 60;
      const restRemaining = Math.max(0, restStartRequired - restActualMinutes);
      const displayMinutes = Math.floor(restRemaining);
      const displaySeconds = Math.floor((restRemaining % 1) * 60);
      return { minutes: displayMinutes, seconds: displaySeconds };
    } else {
      const displayMinutes = Math.floor(restRequired);
      const displaySeconds = Math.floor((restRequired % 1) * 60);
      return { minutes: displayMinutes, seconds: displaySeconds };
    }
  };

  // 计算休息进度
  const getRestProgress = () => {
    if (state === 'resting') {
      const restActualMinutes = currentRestTime / 60;
      return Math.min(100, (restActualMinutes / restStartRequired) * 100);
    } else {
      return Math.min(100, (restRequired / 5) * 100);
    }
  };

  // 获取休息状态文本
  const getRestStatusText = () => {
    if (stats.canRest) {
      return { text: '可以休息了！', color: '#10b981' };
    } else {
      const minutesNeeded = Math.ceil(stats.focusTimeNeeded);
      return { text: `还需专注约${minutesNeeded}分钟`, color: '#64748b' };
    }
  };

  const restDisplay = getRestDisplay();
  const restProgress = getRestProgress();
  const restStatus = getRestStatusText();

  return (
    <View style={styles.container}>
      <StatCard
        title="当前会话专注时间"
        value={`${Math.floor(currentSessionFocusTime / 60)}分钟`}
      />

      <StatCard
        title="休息需求时间"
        value={`${restDisplay.minutes}分${restDisplay.seconds}秒`}
      >
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${restProgress}%` }]} />
        </View>
        <Text style={[styles.statLabel, { color: restStatus.color }]}>
          {restStatus.text}
        </Text>
      </StatCard>

      <StatCard
        title="今日总专注时间"
        value={`${(stats.todayTotal / 3600).toFixed(1)}小时`}
      />

      <StatCard
        title="本周总专注时间"
        value={`${(stats.weekTotal / 3600).toFixed(1)}小时`}
      />
    </View>
  );
}

function StatCard({ title, value, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    color: '#667eea',
    fontSize: 12,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
});
