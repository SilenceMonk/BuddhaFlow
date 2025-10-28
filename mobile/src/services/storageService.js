/**
 * BuddhaFlow 数据持久化服务
 * 使用 AsyncStorage 替代 localStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = 'buddhaflow_sessions';
const STATE_KEY = 'buddhaflow_state';

/**
 * 保存专注会话记录
 * @param {Array} sessions - 会话数组
 */
export async function saveSessions(sessions) {
  try {
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('保存会话失败:', error);
  }
}

/**
 * 加载专注会话记录
 * @returns {Promise<Array>} 会话数组
 */
export async function loadSessions() {
  try {
    const data = await AsyncStorage.getItem(SESSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('加载会话失败:', error);
    return [];
  }
}

/**
 * 添加新的专注会话
 * @param {Object} session - 会话对象
 */
export async function addSession(session) {
  try {
    const sessions = await loadSessions();
    sessions.push(session);
    await saveSessions(sessions);
  } catch (error) {
    console.error('添加会话失败:', error);
  }
}

/**
 * 保存应用状态
 * @param {Object} state - 应用状态对象
 */
export async function saveAppState(state) {
  try {
    await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('保存状态失败:', error);
  }
}

/**
 * 加载应用状态
 * @returns {Promise<Object|null>} 应用状态对象
 */
export async function loadAppState() {
  try {
    const data = await AsyncStorage.getItem(STATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('加载状态失败:', error);
    return null;
  }
}

/**
 * 清除所有数据
 */
export async function clearAllData() {
  try {
    await AsyncStorage.multiRemove([SESSIONS_KEY, STATE_KEY]);
  } catch (error) {
    console.error('清除数据失败:', error);
  }
}
