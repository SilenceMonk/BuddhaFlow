/**
 * BuddhaFlow 常量定义
 */

// 存储键
export const STORAGE_KEYS = {
  SESSIONS: 'buddhaflow_sessions',
  LEAVE_STATE: 'buddhaflow_leave_state',
};

// 疲劳模型参数
export const FATIGUE_MODEL = {
  BASE_REST: 3,           // 基础休息时间（分钟）
  COEFFICIENT: 0.004,     // 平方系数
  MIN_REST: 5,            // 最小休息门槛（分钟）
};

// 颜色主题
export const COLORS = {
  primary: '#667eea',
  primaryDark: '#764ba2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  white: '#ffffff',
  transparent: 'transparent',
};

// 状态文本
export const STATE_LABELS: Record<string, string> = {
  idle: '待开始',
  focusing: '正在专注',
  resting: '正在休息',
  paused: '已暂停',
};

// 定时器更新间隔（毫秒）
export const TIMER_INTERVAL = 100;
