/**
 * 计时器显示区域组件
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { formatTime } from '../utils/timeCalculations';

export default function TimerSection({
  state,
  currentSessionFocusTime,
  currentRestTime,
  restRequired,
  effectiveFocusTime,
  startFocus,
  pauseFocus,
  startRest,
  endRestManually,
  reset,
  canRest,
}) {
  // 状态徽章配置
  const getStatusConfig = () => {
    switch (state) {
      case 'focusing':
        return {
          text: '正在专注',
          label: '保持专注，进入心流',
          bgColor: 'rgba(16, 185, 129, 0.3)',
        };
      case 'resting':
        return {
          text: '正在休息',
          label: '好好休息，恢复精力',
          bgColor: 'rgba(59, 130, 246, 0.3)',
        };
      case 'paused':
        return {
          text: '已暂停',
          label: '暂停中',
          bgColor: 'rgba(251, 191, 36, 0.3)',
        };
      default:
        return {
          text: '待开始',
          label: '准备开始专注',
          bgColor: 'rgba(255, 255, 255, 0.2)',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const displayTime = state === 'resting' ? currentRestTime : currentSessionFocusTime;

  // 计算有效专注时间显示
  const getTEffDisplay = () => {
    if (currentSessionFocusTime > 0) {
      const totalTEff = effectiveFocusTime + currentSessionFocusTime / 60;
      const effectiveRatio = restRequired / (totalTEff || 1);
      return `t_eff=${totalTEff.toFixed(1)}min (${Math.round(effectiveRatio * 100)}%)`;
    } else if (effectiveFocusTime > 0) {
      const effectiveRatio = restRequired / effectiveFocusTime;
      return `t_eff=${effectiveFocusTime.toFixed(1)}min (${Math.round(effectiveRatio * 100)}%)`;
    }
    return '平方模型';
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
        <Text style={styles.statusText}>{statusConfig.text}</Text>
      </View>

      <Text style={styles.timerDisplay}>{formatTime(displayTime)}</Text>
      <Text style={styles.timerLabel}>{statusConfig.label}</Text>

      <View style={styles.ratioContainer}>
        <Text style={styles.ratioLabel}>有效休息率:</Text>
        <View style={styles.ratioBadge}>
          <Text style={styles.ratioText}>{getTEffDisplay()}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        {state === 'idle' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={startFocus}>
            <Text style={styles.btnPrimaryText}>开始专注</Text>
          </TouchableOpacity>
        )}

        {state === 'paused' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={startFocus}>
            <Text style={styles.btnPrimaryText}>继续</Text>
          </TouchableOpacity>
        )}

        {state === 'focusing' && (
          <TouchableOpacity style={styles.btnSecondary} onPress={pauseFocus}>
            <Text style={styles.btnSecondaryText}>暂停</Text>
          </TouchableOpacity>
        )}

        {(state === 'focusing' || state === 'paused' || state === 'idle') && (
          <TouchableOpacity
            style={[styles.btnRest, !canRest && styles.btnDisabled]}
            onPress={startRest}
            disabled={!canRest}
          >
            <Text style={styles.btnRestText}>开始休息</Text>
          </TouchableOpacity>
        )}

        {state === 'resting' && (
          <TouchableOpacity style={styles.btnSecondary} onPress={endRestManually}>
            <Text style={styles.btnSecondaryText}>结束休息</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btnSecondary} onPress={reset}>
          <Text style={styles.btnSecondaryText}>重置</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
  },
  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  timerDisplay: {
    fontSize: 56,
    fontWeight: '700',
    color: 'white',
    marginVertical: 20,
    fontVariant: ['tabular-nums'],
  },
  timerLabel: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    marginBottom: 30,
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  ratioLabel: {
    color: 'white',
    fontSize: 14,
    marginRight: 10,
  },
  ratioBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  ratioText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  btnPrimary: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  btnPrimaryText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  btnSecondaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  btnRest: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  btnRestText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  btnDisabled: {
    backgroundColor: '#6b7280',
    opacity: 0.5,
  },
});
