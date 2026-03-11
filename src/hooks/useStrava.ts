import { useStravaStore } from '../store/stravaStore';
import { useCalendarStore } from '../store/calendarStore';
import { fetchActivitiesSince, matchActivitiesToWorkouts } from '../lib/stravaApi';
import { PLAN_START_DATE } from '../data/trainingPlan';

export function useStrava() {
  const stravaStore = useStravaStore();
  const calendarStore = useCalendarStore();

  const isConnected = !!stravaStore.tokens;

  async function sync() {
    if (!isConnected || !stravaStore.clientId || !stravaStore.clientSecret) {
      stravaStore.setSyncError('Please configure Strava Client ID and Secret in Settings');
      return;
    }
    stravaStore.setSyncing(true);
    stravaStore.setSyncError(null);
    calendarStore.resetStravaActuals();

    try {
      const activities = await fetchActivitiesSince(
        PLAN_START_DATE,
        stravaStore.clientId,
        stravaStore.clientSecret
      );
      stravaStore.setActivities(activities);

      // Match activities to individual planned workouts, each activity used at most once
      const usedActivityIds = new Set<number>();

      for (const week of calendarStore.weeks) {
        for (const workout of week.workouts) {
          // Only match running/quality workouts — not strength/rest placeholders
          if (['rest', 'strength'].includes(workout.type)) continue;

          const matches = matchActivitiesToWorkouts(activities, workout.date)
            .filter(a => !usedActivityIds.has(a.id));
          if (matches.length === 0) continue;

          // For yoga workouts, look for yoga activities; for running, look for running
          const isYogaWorkout = workout.type === 'yoga';
          const relevant = isYogaWorkout
            ? matches.filter(a => a.sport_type === 'Yoga')
            : matches.filter(a => a.isRunning || (!isYogaWorkout && !a.isRunning && a.distance_miles === 0));

          const best = relevant.length > 0
            ? relevant.reduce((a, b) => a.distance_miles >= b.distance_miles ? a : b)
            : matches[0]; // fallback to any match

          usedActivityIds.add(best.id);

          calendarStore.updateWorkoutActuals(workout.id, {
            stravaActivityId: best.id,
            actualDistanceMi: best.isRunning ? Math.round(best.distance_miles * 100) / 100 : 0,
            actualElevationFt: best.isRunning ? Math.round(best.elevation_ft) : 0,
            actualDurationMin: Math.round(best.moving_time / 60),
            stravaName: best.name,
            status: 'completed',
          });
        }

        // Week totals: only running activities count toward mileage/vert
        const weekEnd = week.workouts.reduce((max, w) => w.date > max ? w.date : max, week.startDate);
        const weekActivities = activities.filter(a => {
          const d = a.start_date_local.split('T')[0];
          return d >= week.startDate && d <= weekEnd;
        });
        const totalMi = weekActivities.filter(a => a.isRunning).reduce((s, a) => s + a.distance_miles, 0);
        const totalFt = weekActivities.filter(a => a.isRunning).reduce((s, a) => s + a.elevation_ft, 0);
        calendarStore.updateWeekActuals(week.weekNumber, totalMi, totalFt);
      }

      stravaStore.setLastSync(Date.now());
    } catch (e) {
      stravaStore.setSyncError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      stravaStore.setSyncing(false);
    }
  }

  return { isConnected, isSyncing: stravaStore.isSyncing, syncError: stravaStore.syncError, lastSyncAt: stravaStore.lastSyncAt, activities: stravaStore.activities, sync };
}
