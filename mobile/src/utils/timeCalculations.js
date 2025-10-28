/**
 * BuddhaFlow 时间计算工具
 * 实现疲劳累积模型的核心算法
 */

/**
 * 计算需要的休息时间（分钟）
 * @param {number} tEffMinutes - 有效专注时间（分钟）
 * @returns {number} 需要的休息时间（分钟）
 * 公式: rest_required = 3 + 0.004 × t_eff²
 */
export function calculateRestRequired(tEffMinutes) {
  return 3 + 0.004 * tEffMinutes * tEffMinutes;
}

/**
 * 从剩余休息需求反推有效专注时间
 * @param {number} restRemainingMinutes - 剩余休息需求（分钟）
 * @returns {number} 有效专注时间（分钟）
 * 公式: t_eff = sqrt((rest_remaining - 3) / 0.004)
 */
export function calculateEffectiveFocusFromRest(restRemainingMinutes) {
  if (restRemainingMinutes <= 3) {
    return 0; // 休息充分，疲劳清零
  }
  return Math.sqrt((restRemainingMinutes - 3) / 0.004);
}

/**
 * 计算还需专注多久才能达到目标休息时间
 * @param {number} currentTEff - 当前有效专注时间（分钟）
 * @param {number} currentSessionMinutes - 当前会话专注时间（分钟）
 * @param {number} targetRestMinutes - 目标休息时间（分钟）
 * @returns {number} 还需专注的时间（分钟）
 */
export function calculateFocusTimeNeeded(currentTEff, currentSessionMinutes, targetRestMinutes) {
  const targetTEff = Math.sqrt(Math.max(0, (targetRestMinutes - 3) / 0.004));
  const currentTotalTEff = currentTEff + currentSessionMinutes;
  return Math.max(0, targetTEff - currentTotalTEff);
}

/**
 * 格式化时间显示（HH:MM:SS）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * 获取过去N天的日期列表
 * @param {number} days - 天数
 * @returns {string[]} 日期字符串数组（YYYY-MM-DD）
 */
export function getLastNDays(days) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * 获取今天的日期字符串
 * @returns {string} 日期字符串（YYYY-MM-DD）
 */
export function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

/**
 * 获取N天前的日期
 * @param {number} days - 天数
 * @returns {Date} 日期对象
 */
export function getDaysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}
