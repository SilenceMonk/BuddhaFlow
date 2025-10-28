/**
 * BuddhaFlow - 心流番茄钟
 * React Native 移动端
 */

import React from 'react';
import { StyleSheet, ScrollView, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { useBuddhaFlow } from './src/hooks/useBuddhaFlow';
import TimerSection from './src/components/TimerSection';
import StatsSection from './src/components/StatsSection';
import WeekChart from './src/components/WeekChart';
import HeatMap from './src/components/HeatMap';

export default function App() {
  const {
    state,
    effectiveFocusTime,
    currentSessionFocusTime,
    currentRestTime,
    restRequired,
    restStartRequired,
    sessions,
    stats,
    startFocus,
    pauseFocus,
    startRest,
    endRestManually,
    reset,
  } = useBuddhaFlow();

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 标题 */}
          <View style={styles.header}>
            <Text style={styles.title}>BuddhaFlow</Text>
            <Text style={styles.subtitle}>心流番茄钟 - 顺应专注的自然节奏</Text>
          </View>

          {/* 计时器和统计 */}
          <View style={styles.mainContent}>
            <TimerSection
              state={state}
              currentSessionFocusTime={currentSessionFocusTime}
              currentRestTime={currentRestTime}
              restRequired={restRequired}
              effectiveFocusTime={effectiveFocusTime}
              startFocus={startFocus}
              pauseFocus={pauseFocus}
              startRest={startRest}
              endRestManually={endRestManually}
              reset={reset}
              canRest={stats.canRest}
            />

            <StatsSection
              currentSessionFocusTime={currentSessionFocusTime}
              restRequired={restRequired}
              restStartRequired={restStartRequired}
              currentRestTime={currentRestTime}
              state={state}
              stats={stats}
              effectiveFocusTime={effectiveFocusTime}
            />
          </View>

          {/* 图表 */}
          <WeekChart sessions={sessions} />
          <HeatMap sessions={sessions} />

          {/* 使用说明 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>使用说明（疲劳累积模型）</Text>
            <Text style={styles.infoText}>
              1. 点击"开始专注"进入心流状态，计时器会正向计时{'\n'}
              2. 累积模型：每次专注累加到有效专注时间 t_eff，代表疲劳度{'\n'}
              3. 休息需求：rest_required = 3 + 0.004 × t_eff²{'\n'}
              {'   '}• t_eff=30分钟 → 需休息6.6分钟{'\n'}
              {'   '}• t_eff=60分钟 → 需休息17.4分钟{'\n'}
              {'   '}• t_eff=90分钟 → 需休息35.4分钟{'\n'}
              4. 休息需求≥5分钟后，"开始休息"按钮激活{'\n'}
              5. 休息消除疲劳：休息后根据剩余需求反推新的 t_eff{'\n'}
              {'   '}• 如果休息充分（剩余≤3分钟），t_eff 清零{'\n'}
              {'   '}• 如果休息不足，保留部分疲劳继续累积{'\n'}
              6. 休息结束自动开始专注，无需手动操作
            </Text>
          </View>

          {/* 底部间距 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  mainContent: {
    gap: 20,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 40,
  },
});
