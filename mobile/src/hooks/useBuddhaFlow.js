/**
 * BuddhaFlow 核心状态管理 Hook
 * 实现疲劳累积模型的所有逻辑
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  calculateRestRequired,
  calculateEffectiveFocusFromRest,
  calculateFocusTimeNeeded,
  getTodayDate,
} from '../utils/timeCalculations';
import { loadSessions, saveSessions, loadAppState, saveAppState } from '../services/storageService';

// 配置通知行为
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useBuddhaFlow() {
  // 应用状态
  const [state, setState] = useState('idle'); // idle, focusing, resting, paused

  // 核心数据
  const [effectiveFocusTime, setEffectiveFocusTime] = useState(0); // t_eff (分钟)
  const [currentSessionFocusTime, setCurrentSessionFocusTime] = useState(0); // 秒
  const [currentRestTime, setCurrentRestTime] = useState(0); // 秒
  const [restRequired, setRestRequired] = useState(0); // 分钟
  const [restStartRequired, setRestStartRequired] = useState(0); // 分钟
  const [sessions, setSessions] = useState([]);

  // 引用
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pauseTimeRef = useRef(0);

  // 初始化：加载数据
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    // 请求通知权限
    await Notifications.requestPermissionsAsync();

    // 加载会话数据
    const loadedSessions = await loadSessions();
    setSessions(loadedSessions);

    // 加载应用状态
    const savedState = await loadAppState();
    if (savedState) {
      setEffectiveFocusTime(savedState.effectiveFocusTime || 0);
      setRestRequired(calculateRestRequired(savedState.effectiveFocusTime || 0));
    }
  };

  // 保存应用状态
  const persistAppState = useCallback(async () => {
    await saveAppState({
      effectiveFocusTime,
      state,
    });
  }, [effectiveFocusTime, state]);

  // 保存会话
  const saveSession = useCallback(async (duration) => {
    const now = new Date();
    const session = {
      date: now.toISOString().split('T')[0],
      startTime: now.getTime(),
      focusDuration: duration,
      hourOfDay: now.getHours(),
    };

    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    await saveSessions(updatedSessions);
  }, [sessions]);

  // 开始专注
  const startFocus = useCallback(() => {
    if (state === 'resting') {
      endRest();
    }

    setState('focusing');
    setCurrentSessionFocusTime(0);
    startTimeRef.current = Date.now() - (pauseTimeRef.current || 0);
    pauseTimeRef.current = 0;

    // 启动计时器
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCurrentSessionFocusTime(elapsed);

      // 更新休息需求
      const totalTEffMinutes = effectiveFocusTime + elapsed / 60;
      setRestRequired(calculateRestRequired(totalTEffMinutes));
    }, 100);
  }, [state, effectiveFocusTime]);

  // 暂停专注
  const pauseFocus = useCallback(() => {
    if (state === 'focusing') {
      setState('paused');
      pauseTimeRef.current = Date.now() - startTimeRef.current;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state]);

  // 开始休息
  const startRest = useCallback(async () => {
    // 累加当前会话到有效专注时间
    const sessionMinutes = currentSessionFocusTime / 60;
    const newEffectiveFocusTime = effectiveFocusTime + sessionMinutes;
    setEffectiveFocusTime(newEffectiveFocusTime);

    // 计算休息需求
    const newRestRequired = calculateRestRequired(newEffectiveFocusTime);
    setRestRequired(newRestRequired);

    // 判断是否可以休息
    if (newRestRequired < 5) {
      Alert.alert(
        '休息时间不足',
        `休息需求不足5分钟（当前${newRestRequired.toFixed(1)}分钟），继续专注吧！`
      );
      return;
    }

    // 保存当前会话
    if (currentSessionFocusTime > 0) {
      await saveSession(currentSessionFocusTime);
    }

    // 记录开始休息时的需求
    setRestStartRequired(newRestRequired);

    // 切换到休息状态
    setState('resting');
    setCurrentRestTime(0);
    setCurrentSessionFocusTime(0);
    startTimeRef.current = Date.now();

    // 清除旧计时器
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // 启动休息计时器
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setCurrentRestTime(elapsed);

      // 计算剩余休息需求
      const restActualMinutes = elapsed / 60;
      const restRemaining = Math.max(0, newRestRequired - restActualMinutes);

      // 如果休息完成，自动结束休息
      if (restRemaining <= 0) {
        endRest();

        // 发送通知
        Notifications.scheduleNotificationAsync({
          content: {
            title: '休息时间结束！',
            body: '准备开始专注 💪',
            sound: true,
          },
          trigger: null, // 立即发送
        });

        Alert.alert('休息时间结束！', '准备开始专注 💪', [
          { text: '开始', onPress: () => startFocus() },
        ]);
      }
    }, 100);

    // 持久化状态
    await persistAppState();
  }, [currentSessionFocusTime, effectiveFocusTime, saveSession, persistAppState]);

  // 结束休息
  const endRest = useCallback(() => {
    // 计算实际休息时间
    const restActualMinutes = currentRestTime / 60;

    // 计算剩余休息需求
    const restRemaining = restStartRequired - restActualMinutes;

    // 根据剩余需求反推新的有效专注时间
    const newEffectiveFocusTime = calculateEffectiveFocusFromRest(restRemaining);
    setEffectiveFocusTime(newEffectiveFocusTime);

    // 重置状态
    setState('idle');
    setCurrentRestTime(0);
    setRestRequired(calculateRestRequired(newEffectiveFocusTime));

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    persistAppState();
  }, [currentRestTime, restStartRequired, persistAppState]);

  // 手动结束休息并开始专注
  const endRestManually = useCallback(() => {
    endRest();
    setTimeout(() => startFocus(), 100);
  }, [endRest, startFocus]);

  // 重置
  const reset = useCallback(async () => {
    if (state === 'focusing' && currentSessionFocusTime > 60) {
      Alert.alert(
        '确定重置？',
        '当前专注数据将会保存并累加到有效专注时间。',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确定',
            onPress: async () => {
              if (currentSessionFocusTime > 0) {
                await saveSession(currentSessionFocusTime);
                const newEffectiveFocusTime = effectiveFocusTime + currentSessionFocusTime / 60;
                setEffectiveFocusTime(newEffectiveFocusTime);
                setRestRequired(calculateRestRequired(newEffectiveFocusTime));
              }

              setState('idle');
              setCurrentSessionFocusTime(0);
              setCurrentRestTime(0);
              startTimeRef.current = null;
              pauseTimeRef.current = 0;

              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }

              await persistAppState();
            },
          },
        ]
      );
    } else {
      setState('idle');
      setCurrentSessionFocusTime(0);
      setCurrentRestTime(0);
      startTimeRef.current = null;
      pauseTimeRef.current = 0;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      await persistAppState();
    }
  }, [state, currentSessionFocusTime, effectiveFocusTime, saveSession, persistAppState]);

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 计算统计数据
  const stats = {
    todayTotal: sessions
      .filter(s => s.date === getTodayDate())
      .reduce((sum, s) => sum + s.focusDuration, 0),
    weekTotal: sessions
      .filter(s => {
        const sessionDate = new Date(s.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return sessionDate >= weekAgo;
      })
      .reduce((sum, s) => sum + s.focusDuration, 0),
    canRest: restRequired >= 5,
    focusTimeNeeded: calculateFocusTimeNeeded(
      effectiveFocusTime,
      currentSessionFocusTime / 60,
      5
    ),
  };

  return {
    // 状态
    state,
    effectiveFocusTime,
    currentSessionFocusTime,
    currentRestTime,
    restRequired,
    restStartRequired,
    sessions,
    stats,

    // 操作
    startFocus,
    pauseFocus,
    startRest,
    endRest,
    endRestManually,
    reset,
  };
}
