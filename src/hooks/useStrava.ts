import { useStravaStore } from '../store/stravaStore';
import { useCalendarStore } from '../store/calendarStore';
import { fetchActivitiesSince, matchActivitiesToWorkouts } from '../lib/stravaApi';
import { PLAN_START_DATE } from '../data/trainingPlan';
import { computeVolumeAdjustments } from '../lib/volumeCalculator';

export function useStrava() {
  const stravaStore = useStravaStore();
  const calendarStore = useCalendarStore();

  const isConnected = !!stravaStore.tokens;

  async function sync() {
    if (!isConnected || !stravaStore.clientSecret) {
      stravaStore.setSyncError('Please connect Strava first');
      return;
    }
    stravaStore.setSyncing(true);
    stravaStore.setSyncError(null);

    try {
      const activities = await fetchActivitiesSince(PLAN_START_DATE, stravaStore.clientSecret);
      stravaStore.setActivities(activities);

      // Build week actuals
      const weekActuals = new Map<number, { mi: number; ft: number }>();

      // Match activities to workouts
      for (const week of calendarStore.weeks) {
        for (const workout of week.workouts) {
          if (workout.type === 'rest' || workout.type === 'yoga' || workout.type === 'strength' || workout.type === 'xtrain') continue;
          const matches = matchActivitiesToWorkouts(activities, workout.date);
          if (matches.length > 0) {
            // Best match = highest distance (for running)
            const best = matches.reduce((a, b) =>
              (a.distance_miles ?? 0) >= (b.distance_miles ?? 0) ? a : b
            );
            calendarStore.updateWorkoutActuals(workout.id, {
              stravaActivityId: best.id,
              actualDistanceMi: Math.round(best.distance_miles * 100) / 100,
              actualElevationFt: Math.round(best.elevation_ft),
              actualDurationMin: Math.round(best.moving_time / 60),
              stravaName: best.name,
              status: 'completed',
            });
          }
        }

        // Compute week-level actuals from all matched workouts
        const weekActivities = activities.filter(a => {
          const d = a.start_date_local.split('T')[0];
          const end = week.workouts.reduce((max, w) => w.date > max ? w.date : max, week.startDate);
          return d >= week.startDate && d <= end;
        });
        const totalMi = weekActivities.reduce((s, a) => s + a.distance_miles, 0);
        const totalFt = weekActivities.reduce((s, a) => s + a.elevation_ft, 0);
        weekActuals.set(week.weekNumber, { mi: totalMi, ft: totalFt });
        calendarStore.updateWeekActuals(week.weekNumber, totalMi, totalFt);
      }

      // Volume auto-adjust for most recently completed week
      const today = new Date().toISOString().split('T')[0];
      const completedWeeks = calendarStore.weeks.filter(w => {
        const end = w.workouts.reduce((max, wo) => wo.date > max ? wo.date : max, w.startDate);
        return end < today;
      });
      if (completedWeeks.length > 0) {
        const lastCompleted = completedWeeks[completedWeeks.length - 1];
        const { adjustments, notifications } = computeVolumeAdjustments(
          calendarStore.weeks,
          lastCompleted.weekNumber
        );
        if (adjustments.length > 0) {
          calendarStore.setVolumeAdjustments([
            ...calendarStore.volumeAdjustments,
            ...adjustments,
          ]);
        }
        for (const n of notifications) {
          calendarStore.addNotification(n);
        }
      }

      stravaStore.setLastSync(Date.now());
    } catch (e) {
      stravaStore.setSyncError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      stravaStore.setSyncing(false);
    }
  }

  return {
    isConnected,
    isSyncing: stravaStore.isSyncing,
    syncError: stravaStore.syncError,
    lastSyncAt: stravaStore.lastSyncAt,
    activities: stravaStore.activities,
    sync,
  };
}
