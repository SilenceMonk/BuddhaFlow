/**
 * 疲劳累积模型核心算法
 *
 * 公式：rest_required = 3 + 0.004 × t_eff²
 */

import { FATIGUE_MODEL } from '../constants';

/**
 * 从有效专注时间计算需要的休息时间
 * @param tEffMinutes 有效专注时间（分钟）
 * @returns 休息需求时间（分钟）
 */
export function calculateRestRequired(tEffMinutes: number): number {
  return FATIGUE_MODEL.BASE_REST + FATIGUE_MODEL.COEFFICIENT * tEffMinutes * tEffMinutes;
}

/**
 * 从剩余休息需求反推有效专注时间
 * @param restRemainingMinutes 剩余休息需求（分钟）
 * @returns 有效专注时间（分钟）
 */
export function calculateEffectiveFocusFromRest(restRemainingMinutes: number): number {
  if (restRemainingMinutes <= FATIGUE_MODEL.BASE_REST) {
    return 0; // 休息充分，疲劳清零
  }
  return Math.sqrt((restRemainingMinutes - FATIGUE_MODEL.BASE_REST) / FATIGUE_MODEL.COEFFICIENT);
}

/**
 * 计算还需专注多久才能达到目标休息时间
 * @param currentTEff 当前累积的有效专注时间（分钟）
 * @param currentSessionMinutes 当前会话时间（分钟）
 * @param targetRestMinutes 目标休息时间（分钟）
 * @returns 还需专注的时间（分钟）
 */
export function calculateFocusTimeNeeded(
  currentTEff: number,
  currentSessionMinutes: number,
  targetRestMinutes: number
): number {
  const targetTEff = Math.sqrt(
    Math.max(0, (targetRestMinutes - FATIGUE_MODEL.BASE_REST) / FATIGUE_MODEL.COEFFICIENT)
  );
  const currentTotalTEff = currentTEff + currentSessionMinutes;
  return Math.max(0, targetTEff - currentTotalTEff);
}

/**
 * 检查是否可以开始休息
 * @param restRequired 当前休息需求（分钟）
 * @returns 是否可以休息
 */
export function canStartRest(restRequired: number): boolean {
  return restRequired >= FATIGUE_MODEL.MIN_REST;
}
