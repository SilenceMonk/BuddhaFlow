/**
 * 离开信息卡片组件
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LeaveState, LeaveReturnInfo } from '../types';
import { COLORS } from '../constants';

interface LeaveInfoCardProps {
  leaveState?: LeaveState | null;
  leaveReturnInfo?: LeaveReturnInfo | null;
}

export function LeaveInfoCard({ leaveState, leaveReturnInfo }: LeaveInfoCardProps) {
  if (leaveReturnInfo) {
    // 显示返回信息
    const hours = Math.floor(leaveReturnInfo.awayTimeMinutes / 60);
    const minutes = Math.floor(leaveReturnInfo.awayTimeMinutes % 60);
    const timeStr = hours > 0 ? `${hours}小时${minutes}分钟` : `${minutes}分钟`;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>🎉 欢迎回来！</Text>
        <Text style={styles.text}>离开时长: {timeStr}</Text>
        <Text style={styles.text}>
          疲劳恢复: {leaveReturnInfo.recoveredFatigue.toFixed(1)}分钟
        </Text>
        <Text style={styles.text}>
          当前疲劳: t_eff = {leaveReturnInfo.newEffectiveFocus.toFixed(1)}分钟
          {leaveReturnInfo.newEffectiveFocus === 0 ? ' (已完全恢复！)' : ''}
        </Text>
      </View>
    );
  }

  if (leaveState) {
    // 显示离开状态
    return (
      <View style={styles.card}>
        <Text style={styles.title}>💤 您已离开</Text>
        <Text style={styles.text}>
          离开时疲劳: t_eff = {leaveState.effectiveFocus.toFixed(1)}分钟
        </Text>
        <Text style={styles.text}>
          需要休息: {leaveState.restRequired.toFixed(1)}分钟
        </Text>
        <Text style={styles.hint}>点击"开始专注"回来时会自动计算休息效果</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    marginVertical: 15,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 22,
  },
  hint: {
    color: COLORS.white,
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    opacity: 0.9,
  },
});
