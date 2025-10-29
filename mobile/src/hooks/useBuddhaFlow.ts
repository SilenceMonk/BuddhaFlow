/**
 * BuddhaFlow 核心状态管理 Hook
 * 复刻原始 BuddhaFlowApp 类的功能
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import { AppState, Session, LeaveState, LeaveReturnInfo } from '../types';
import {
  calculateRestRequired,
  calculateEffectiveFocusFromRest,
  calculateFocusTimeNeeded,
  canStartRest,
} from '../services/fatigueModel';
import {
  loadSessions,
  saveSessions,
  addSession,
  loadLeaveState,
  saveLeaveState,
  clearLeaveState,
} from '../services/storage';

export function useBuddhaFlow() {
  // 核心状态
  const [state, setState] = useState<AppState>('idle');
  const [effectiveFocusTime, setEffectiveFocusTime] = useState(0); // t_eff（分钟）
  const [restRequired, setRestRequired] = useState(0); // 休息需求（分钟）

  // 当前会话
  const [currentSessionFocusTime, setCurrentSessionFocusTime] = useState(0); // 秒
  const [currentRestTime, setCurrentRestTime] = useState(0); // 秒
  const [restStartRequired, setRestStartRequired] = useState(0); // 分钟

  // 离开状态
  const [leaveState, setLeaveState] = useState<LeaveState | null>(null);
  const [leaveReturnInfo, setLeaveReturnInfo] = useState<LeaveReturnInfo | null>(null);

  // 会话数据
  const [sessions, setSessions] = useState<Session[]>([]);

  // 内部状态
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化：加载数据
  useEffect(() => {
    const init = async () => {
      const loadedSessions = await loadSessions();
      const loadedLeaveState = await loadLeaveState();
      setSessions(loadedSessions);
      setLeaveState(loadedLeaveState);
    };
    init();
  }, []);

  // 清除计时器
  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // 处理离开返回
  const processLeaveReturn = useCallback((): LeaveReturnInfo | null => {
    if (!leaveState) return null;

    const now = Date.now();
    const awayTimeMs = now - leaveState.leaveTime;
    const awayTimeMinutes = awayTimeMs / (1000 * 60);

    const restRemaining = Math.max(0, leaveState.restRequired - awayTimeMinutes);
    const newEffectiveFocus = calculateEffectiveFocusFromRest(restRemaining);

    const info: LeaveReturnInfo = {
      awayTimeMinutes,
      oldEffectiveFocus: leaveState.effectiveFocus,
      newEffectiveFocus,
      recoveredFatigue: leaveState.effectiveFocus - newEffectiveFocus,
      oldRestRequired: leaveState.restRequired,
      newRestRequired: restRemaining,
    };

    // 更新疲劳度
    setEffectiveFocusTime(newEffectiveFocus);
    setRestRequired(calculateRestRequired(newEffectiveFocus));

    // 清除离开状态
    clearLeaveState();
    setLeaveState(null);

    return info;
  }, [leaveState]);

  // 开始专注
  const startFocus = useCallback(async () => {
    // 检查离开返回
    const returnInfo = processLeaveReturn();
    if (returnInfo) {
      setLeaveReturnInfo(returnInfo);
    }

    if (state === 'resting') {
      // 如果正在休息，先结束休息
      const restActualMinutes = currentRestTime / 60;
      const restRemaining = restStartRequired - restActualMinutes;
      const newTEff = calculateEffectiveFocusFromRest(restRemaining);
      setEffectiveFocusTime(newTEff);
      setRestRequired(calculateRestRequired(newTEff));
      setCurrentRestTime(0);
      clearTimer();
    }

    setState('focusing');
    setCurrentSessionFocusTime(0);
    startTimeRef.current = Date.now() - (pauseTimeRef.current || 0);
    pauseTimeRef.current = 0;

    // 启动计时器
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      setCurrentSessionFocusTime(elapsed);

      // 更新休息需求
      const totalTEffMinutes = effectiveFocusTime + elapsed / 60;
      setRestRequired(calculateRestRequired(totalTEffMinutes));
    }, 100);
  }, [state, currentRestTime, restStartRequired, effectiveFocusTime, processLeaveReturn, clearTimer]);

  // 暂停专注
  const pauseFocus = useCallback(() => {
    if (state === 'focusing') {
      setState('paused');
      pauseTimeRef.current = Date.now() - (startTimeRef.current || 0);
      clearTimer();
    }
  }, [state, clearTimer]);

  // 继续专注
  const resumeFocus = useCallback(() => {
    if (state === 'paused') {
      startFocus();
    }
  }, [state, startFocus]);

  // 开始休息
  const startRest = useCallback(async () => {
    // 累加当前会话到有效专注时间
    const sessionMinutes = currentSessionFocusTime / 60;
    const newTEff = effectiveFocusTime + sessionMinutes;
    const newRestRequired = calculateRestRequired(newTEff);

    // 检查是否达到休息门槛
    if (!canStartRest(newRestRequired)) {
      Alert.alert(
        '休息需求不足',
        `休息需求不足5分钟（当前${newRestRequired.toFixed(1)}分钟），继续专注吧！`
      );
      return;
    }

    // 保存当前会话
    if (currentSessionFocusTime > 0) {
      const now = new Date();
      const session: Session = {
        date: now.toISOString().split('T')[0],
        startTime: now.getTime(),
        focusDuration: currentSessionFocusTime,
        hourOfDay: now.getHours(),
      };
      await addSession(session);
      const updatedSessions = await loadSessions();
      setSessions(updatedSessions);
    }

    setEffectiveFocusTime(newTEff);
    setRestRequired(newRestRequired);
    setRestStartRequired(newRestRequired);

    setState('resting');
    setCurrentRestTime(0);
    setCurrentSessionFocusTime(0);
    startTimeRef.current = Date.now();

    clearTimer();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      setCurrentRestTime(elapsed);

      // 检查是否休息完成
      const restActualMinutes = elapsed / 60;
      const restRemaining = Math.max(0, newRestRequired - restActualMinutes);

      if (restRemaining <= 0) {
        // 休息结束，自动开始专注
        clearTimer();
        Alert.alert('休息时间结束！', '准备开始专注 💪', [
          { text: '开始', onPress: () => startFocus() },
        ]);
      }
    }, 100);
  }, [
    currentSessionFocusTime,
    effectiveFocusTime,
    clearTimer,
    startFocus,
  ]);

  // 手动结束休息
  const endRestManually = useCallback(() => {
    const restActualMinutes = currentRestTime / 60;
    const restRemaining = restStartRequired - restActualMinutes;
    const newTEff = calculateEffectiveFocusFromRest(restRemaining);

    setEffectiveFocusTime(newTEff);
    setRestRequired(calculateRestRequired(newTEff));
    setCurrentRestTime(0);
    clearTimer();

    // 自动开始专注
    startFocus();
  }, [currentRestTime, restStartRequired, clearTimer, startFocus]);

  // 离开
  const leave = useCallback(async () => {
    let shouldLeave = true;

    // 如果正在专注且超过1分钟，保存数据
    if (state === 'focusing' && currentSessionFocusTime > 60) {
      shouldLeave = await new Promise((resolve) => {
        Alert.alert(
          '确定要离开吗？',
          '当前专注数据将会保存，离开期间会自动视为休息时间。',
          [
            { text: '取消', style: 'cancel', onPress: () => resolve(false) },
            { text: '离开', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });

      if (!shouldLeave) return;

      // 保存当前会话
      const now = new Date();
      const session: Session = {
        date: now.toISOString().split('T')[0],
        startTime: now.getTime(),
        focusDuration: currentSessionFocusTime,
        hourOfDay: now.getHours(),
      };
      await addSession(session);

      // 累加到疲劳度
      const newTEff = effectiveFocusTime + currentSessionFocusTime / 60;
      setEffectiveFocusTime(newTEff);
    } else if (state === 'resting') {
      // 如果正在休息，先结束休息
      const restActualMinutes = currentRestTime / 60;
      const restRemaining = restStartRequired - restActualMinutes;
      const newTEff = calculateEffectiveFocusFromRest(restRemaining);
      setEffectiveFocusTime(newTEff);
    }

    // 保存离开状态
    const newLeaveState: LeaveState = {
      leaveTime: Date.now(),
      effectiveFocus: effectiveFocusTime,
      restRequired: calculateRestRequired(effectiveFocusTime),
    };
    await saveLeaveState(newLeaveState);
    setLeaveState(newLeaveState);

    // 重置状态
    setState('idle');
    setCurrentSessionFocusTime(0);
    setCurrentRestTime(0);
    startTimeRef.current = null;
    pauseTimeRef.current = 0;
    clearTimer();

    // 重新加载会话数据
    const updatedSessions = await loadSessions();
    setSessions(updatedSessions);
  }, [
    state,
    currentSessionFocusTime,
    currentRestTime,
    effectiveFocusTime,
    restStartRequired,
    clearTimer,
  ]);

  // 清理
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    // 状态
    state,
    effectiveFocusTime,
    restRequired,
    currentSessionFocusTime,
    currentRestTime,
    restStartRequired,
    leaveState,
    leaveReturnInfo,
    sessions,

    // 操作
    startFocus,
    pauseFocus,
    resumeFocus,
    startRest,
    endRestManually,
    leave,

    // 辅助方法
    canStartRest: canStartRest(restRequired),
    calculateFocusTimeNeeded: (targetRestMinutes: number) =>
      calculateFocusTimeNeeded(
        effectiveFocusTime,
        currentSessionFocusTime / 60,
        targetRestMinutes
      ),
  };
}
