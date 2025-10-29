/**
 * 专注屏幕 - 应用的主屏幕
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBuddhaFlow } from '../hooks/useBuddhaFlow';
import { Timer } from '../components/Timer';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { LeaveInfoCard } from '../components/LeaveInfoCard';
import { COLORS, FATIGUE_MODEL } from '../constants';
import { commonStyles } from '../constants/styles';

// 渐变背景组件
function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

export function FocusScreen() {
  const {
    state,
    effectiveFocusTime,
    restRequired,
    currentSessionFocusTime,
    currentRestTime,
    leaveState,
    leaveReturnInfo,
    sessions,
    startFocus,
    pauseFocus,
    resumeFocus,
    startRest,
    endRestManually,
    leave,
    canStartRest,
    calculateFocusTimeNeeded,
  } = useBuddhaFlow();

  // 计算显示值
  const displayTime = state === 'resting' ? currentRestTime : currentSessionFocusTime;

  const timerLabel =
    state === 'focusing' ? '保持专注，进入心流' :
    state === 'resting' ? '好好休息，恢复精力' :
    state === 'paused' ? '暂停中' :
    '准备开始专注';

  // 计算休息需求显示
  let displayRestMinutes: number;
  let displayRestSeconds: number;
  if (state === 'resting') {
    const restActualMinutes = currentRestTime / 60;
    const restRemaining = Math.max(0, restRequired - restActualMinutes);
    displayRestMinutes = Math.floor(restRemaining);
    displayRestSeconds = Math.floor((restRemaining % 1) * 60);
  } else {
    displayRestMinutes = Math.floor(restRequired);
    displayRestSeconds = Math.floor((restRequired % 1) * 60);
  }

  // 计算休息进度
  const restProgress = state === 'resting'
    ? Math.min(100, ((currentRestTime / 60) / restRequired) * 100)
    : Math.min(100, (restRequired / FATIGUE_MODEL.MIN_REST) * 100);

  // 计算今日和本周总计
  const today = new Date().toISOString().split('T')[0];
  const todayTotal = sessions
    .filter(s => s.date === today)
    .reduce((sum, s) => sum + s.focusDuration, 0);

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekTotal = sessions
    .filter(s => new Date(s.date) >= weekAgo)
    .reduce((sum, s) => sum + s.focusDuration, 0);

  // 计算有效休息率
  const totalTEff = effectiveFocusTime + (currentSessionFocusTime / 60);
  const effectiveRatio = totalTEff > 0 ? (restRequired / totalTEff) * 100 : 0;

  // 计算还需专注时间
  const focusTimeNeeded = calculateFocusTimeNeeded(FATIGUE_MODEL.MIN_REST);
  const minutesNeeded = Math.ceil(focusTimeNeeded);

  return (
    <ScrollView style={styles.container}>
      {/* 计时器部分 */}
      <GradientBackground>
        <StatusBadge state={state} />
        <Timer seconds={displayTime} label={timerLabel} />

        {/* 离开信息 */}
        <LeaveInfoCard leaveState={leaveState} leaveReturnInfo={leaveReturnInfo} />

        {/* 有效休息率 */}
        <View style={styles.ratioContainer}>
          <Text style={styles.ratioLabel}>有效休息率:</Text>
          <View style={styles.ratioBadge}>
            <Text style={styles.ratioText}>
              {totalTEff > 0
                ? `t_eff=${totalTEff.toFixed(1)}min (${Math.round(effectiveRatio)}%)`
                : '平方模型'}
            </Text>
          </View>
        </View>

        {/* 控制按钮 */}
        <View style={styles.controls}>
          {state === 'idle' && (
            <>
              <Button title="开始专注" onPress={startFocus} variant="primary" />
              <Button title="开始休息" onPress={startRest} disabled={!canStartRest} variant="success" />
            </>
          )}
          {state === 'focusing' && (
            <>
              <Button title="暂停" onPress={pauseFocus} variant="secondary" />
              <Button title="开始休息" onPress={startRest} disabled={!canStartRest} variant="success" />
            </>
          )}
          {state === 'paused' && (
            <>
              <Button title="继续" onPress={resumeFocus} variant="primary" />
              <Button title="开始休息" onPress={startRest} disabled={!canStartRest} variant="success" />
            </>
          )}
          {state === 'resting' && (
            <Button title="结束休息" onPress={endRestManually} variant="secondary" />
          )}
          {state !== 'resting' && (
            <Button title="离开" onPress={leave} variant="danger" />
          )}
        </View>
      </GradientBackground>

      {/* 统计卡片 */}
      <View style={styles.statsSection}>
        <StatCard
          title="当前会话专注时间"
          value={`${Math.floor(currentSessionFocusTime / 60)}分钟`}
        />
        <StatCard
          title="休息需求时间"
          value={`${displayRestMinutes}分${displayRestSeconds}秒`}
          subtitle={
            canStartRest
              ? '可以休息了！'
              : `还需专注约${minutesNeeded}分钟`
          }
          progress={restProgress}
        />
        <StatCard
          title="今日总专注时间"
          value={`${(todayTotal / 3600).toFixed(1)}小时`}
        />
        <StatCard
          title="本周总专注时间"
          value={`${(weekTotal / 3600).toFixed(1)}小时`}
        />
      </View>

      {/* 使用说明 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>使用说明（疲劳累积模型）</Text>
        <Text style={styles.infoText}>
          1. 点击"开始专注"进入心流状态，计时器会正向计时{'\n'}
          2. 累积模型：每次专注累加到有效专注时间 t_eff，代表疲劳度{'\n'}
          3. 休息需求：rest_required = 3 + 0.004 × t_eff²{'\n'}
          4. 休息需求≥5分钟后，"开始休息"按钮激活{'\n'}
          5. 休息消除疲劳：休息后根据剩余需求反推新的 t_eff{'\n'}
          6. 离开功能：点击"离开"结束整个循环，离开期间自动视为休息
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  gradient: {
    padding: 20,
    paddingTop: 40,
  },
  ratioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  ratioLabel: {
    color: COLORS.white,
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
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  statsSection: {
    padding: 20,
  },
  infoCard: {
    ...commonStyles.card,
    backgroundColor: COLORS.gray[100],
    margin: 20,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray[800],
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.gray[600],
  },
});
