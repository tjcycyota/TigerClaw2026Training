import { TrainingWeek, VolumeAdjustment, AppNotification } from '../types';

export interface WeekCompletionStats {
  weekNumber: number;
  plannedMi: number;
  actualMi: number;
  plannedVertFt: number;
  actualVertFt: number;
  completionRatio: number;
  vertCompletionRatio: number;
}

export function computeWeekStats(week: TrainingWeek): WeekCompletionStats {
  const plannedMi = week.targetVolumeMi;
  const actualMi = week.actualVolumeMi ?? 0;
  const plannedVertFt = week.targetElevationFt;
  const actualVertFt = week.actualElevationFt ?? 0;

  return {
    weekNumber: week.weekNumber,
    plannedMi,
    actualMi,
    plannedVertFt,
    actualVertFt,
    completionRatio: plannedMi > 0 ? actualMi / plannedMi : 0,
    vertCompletionRatio: plannedVertFt > 0 ? actualVertFt / plannedVertFt : 0,
  };
}

export interface AdjustmentResult {
  adjustments: VolumeAdjustment[];
  notifications: AppNotification[];
}

export function computeVolumeAdjustments(
  weeks: TrainingWeek[],
  completedWeekNumber: number
): AdjustmentResult {
  const adjustments: VolumeAdjustment[] = [];
  const notifications: AppNotification[] = [];

  const completedWeek = weeks.find(w => w.weekNumber === completedWeekNumber);
  if (!completedWeek) return { adjustments, notifications };

  const stats = computeWeekStats(completedWeek);
  const nextWeek = weeks.find(w => w.weekNumber === completedWeekNumber + 1);
  if (!nextWeek) return { adjustments, notifications };

  // Taper lock — no upward adjustments in weeks 11-12
  const isTaperLocked = nextWeek.phase === 'taper';

  const ratio = stats.completionRatio;

  if (ratio < 0.7) {
    const reduction = isTaperLocked ? 0 : 0.125; // 12.5% reduction
    const adjustedMi = Math.round(nextWeek.targetVolumeMi * (1 - reduction));
    if (adjustedMi !== nextWeek.targetVolumeMi) {
      adjustments.push({
        weekNumber: nextWeek.weekNumber,
        reason: `Week ${completedWeekNumber} completion < 70% (${Math.round(ratio * 100)}%)`,
        originalTargetMi: nextWeek.targetVolumeMi,
        adjustedTargetMi: adjustedMi,
        percentChange: -reduction * 100,
      });
      notifications.push({
        id: `adj-${Date.now()}`,
        type: 'warning',
        message: `Week ${nextWeek.weekNumber} target reduced to ${adjustedMi}mi — you completed only ${Math.round(ratio * 100)}% last week. Focus on key workouts.`,
        weekNumber: nextWeek.weekNumber,
      });
    }
  } else if (ratio > 1.1 && !isTaperLocked) {
    const increase = 0.05;
    const adjustedMi = Math.round(nextWeek.targetVolumeMi * (1 + increase));
    adjustments.push({
      weekNumber: nextWeek.weekNumber,
      reason: `Week ${completedWeekNumber} was ${Math.round(ratio * 100)}% of plan — slight increase`,
      originalTargetMi: nextWeek.targetVolumeMi,
      adjustedTargetMi: adjustedMi,
      percentChange: increase * 100,
    });
    notifications.push({
      id: `adj-${Date.now()}`,
      type: 'info',
      message: `Strong week! Week ${nextWeek.weekNumber} target nudged up to ${adjustedMi}mi. Keep listening to your body.`,
      weekNumber: nextWeek.weekNumber,
    });
  }

  // Vert deficit carry-forward
  if (stats.vertCompletionRatio < 0.8) {
    const deficit = stats.plannedVertFt - stats.actualVertFt;
    const addedVert = Math.round(deficit * 0.5);
    notifications.push({
      id: `vert-${Date.now()}`,
      type: 'info',
      message: `Vert deficit of ${Math.round(deficit).toLocaleString()}ft from week ${completedWeekNumber}. Next long run gains +${addedVert.toLocaleString()}ft target.`,
      weekNumber: nextWeek.weekNumber,
    });
  }

  // Check consecutive low weeks
  if (completedWeekNumber >= 2) {
    const prevWeek = weeks.find(w => w.weekNumber === completedWeekNumber - 1);
    if (prevWeek) {
      const prevStats = computeWeekStats(prevWeek);
      if (prevStats.completionRatio < 0.8 && ratio < 0.8) {
        notifications.push({
          id: `consec-${Date.now()}`,
          type: 'warning',
          message: `Two consecutive low weeks. Consider an extra rest day this week and check in with how you're feeling.`,
          weekNumber: nextWeek.weekNumber,
        });
      }
    }
  }

  return { adjustments, notifications };
}
