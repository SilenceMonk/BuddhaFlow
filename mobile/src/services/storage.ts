/**
 * 数据持久化服务
 * 使用 AsyncStorage 替代 localStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, LeaveState } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * 加载所有会话数据
 */
export async function loadSessions(): Promise<Session[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load sessions:', error);
    return [];
  }
}

/**
 * 保存会话数据
 */
export async function saveSessions(sessions: Session[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions:', error);
  }
}

/**
 * 添加新会话
 */
export async function addSession(session: Session): Promise<void> {
  const sessions = await loadSessions();
  sessions.push(session);
  await saveSessions(sessions);
}

/**
 * 加载离开状态
 */
export async function loadLeaveState(): Promise<LeaveState | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LEAVE_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load leave state:', error);
    return null;
  }
}

/**
 * 保存离开状态
 */
export async function saveLeaveState(state: LeaveState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LEAVE_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save leave state:', error);
  }
}

/**
 * 清除离开状态
 */
export async function clearLeaveState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.LEAVE_STATE);
  } catch (error) {
    console.error('Failed to clear leave state:', error);
  }
}

/**
 * 清除所有数据（用于测试或重置）
 */
export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.SESSIONS, STORAGE_KEYS.LEAVE_STATE]);
  } catch (error) {
    console.error('Failed to clear all data:', error);
  }
}
