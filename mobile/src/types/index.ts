/**
 * BuddhaFlow 类型定义
 */

// 应用状态
export type AppState = 'idle' | 'focusing' | 'resting' | 'paused';

// 专注会话
export interface Session {
  date: string;           // ISO 日期格式 "YYYY-MM-DD"
  startTime: number;      // 时间戳（毫秒）
  focusDuration: number;  // 专注时长（秒）
  hourOfDay: number;      // 小时 0-23
}

// 离开状态
export interface LeaveState {
  leaveTime: number;          // 离开时间戳（毫秒）
  effectiveFocus: number;     // 离开时的 t_eff（分钟）
  restRequired: number;       // 离开时需要的休息时间（分钟）
}

// 离开返回信息
export interface LeaveReturnInfo {
  awayTimeMinutes: number;        // 离开时长（分钟）
  oldEffectiveFocus: number;      // 离开前的疲劳度（分钟）
  newEffectiveFocus: number;      // 返回后的疲劳度（分钟）
  recoveredFatigue: number;       // 恢复的疲劳（分钟）
  oldRestRequired: number;        // 离开前的休息需求（分钟）
  newRestRequired: number;        // 返回后的休息需求（分钟）
}

// 应用上下文状态
export interface AppContextState {
  // 核心状态
  state: AppState;
  effectiveFocusTime: number;       // t_eff（分钟）
  restRequired: number;             // 休息需求（分钟）

  // 当前会话
  currentSessionFocusTime: number;  // 当前会话专注时间（秒）
  currentRestTime: number;          // 当前休息时间（秒）
  restStartRequired: number;        // 开始休息时的休息需求（分钟）

  // 离开状态
  leaveState: LeaveState | null;

  // 会话数据
  sessions: Session[];
}

// 图表数据点
export interface ChartDataPoint {
  date: string;
  hours: number;
  label: string;
}

// 热力图数据
export type HeatmapData = number[]; // 24个数值，代表0-23时的专注时长
