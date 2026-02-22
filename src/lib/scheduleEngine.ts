import { PlannedWorkout, TrainingWeek } from '../types';
import { addDays, format, parseISO, getDay } from 'date-fns';

// Monday = 1, Sunday = 0 in date-fns (getDay returns 0=Sun, 1=Mon, ...)
const isMon = (date: Date) => getDay(date) === 1;

export function moveWorkout(
  workout: PlannedWorkout,
  toDate: string,
  weeks: TrainingWeek[]
): TrainingWeek[] {
  // Remove from current date, place on toDate
  return weeks.map(week => ({
    ...week,
    workouts: week.workouts.map(w => {
      if (w.id !== workout.id) return w;
      return {
        ...w,
        date: toDate,
        isMovedFromDate: w.date,
        status: 'planned' as const,
      };
    }),
  }));
}

export function handleTravelDays(
  affectedDates: string[],
  weeks: TrainingWeek[]
): TrainingWeek[] {
  const affected = new Set(affectedDates);
  let result = [...weeks.map(w => ({ ...w, workouts: [...w.workouts] }))];

  // Collect all workouts that fall on travel dates
  const displaced: PlannedWorkout[] = [];
  for (const week of result) {
    for (const workout of week.workouts) {
      if (affected.has(workout.date) && workout.type !== 'rest') {
        displaced.push(workout);
      }
    }
  }

  // Separate key vs flexible
  const keyWorkouts = displaced.filter(w => w.isKeyWorkout);
  const flexWorkouts = displaced.filter(w => !w.isKeyWorkout);

  // Find all occupied dates in the plan
  const allDates = new Set(result.flatMap(w => w.workouts.map(wo => wo.date)));

  // Try to place key workouts first — find nearest open slot
  for (const kw of keyWorkouts) {
    const originalDate = parseISO(kw.date);
    let placed = false;
    for (let delta = 1; delta <= 7; delta++) {
      for (const sign of [1, -1]) {
        const candidate = format(addDays(originalDate, delta * sign), 'yyyy-MM-dd');
        if (!affected.has(candidate) && !allDates.has(candidate) && !isMon(parseISO(candidate))) {
          // Check no adjacent key workout
          const dayBefore = format(addDays(parseISO(candidate), -1), 'yyyy-MM-dd');
          const dayAfter = format(addDays(parseISO(candidate), 1), 'yyyy-MM-dd');
          const adjacentHasKey = result.flatMap(w => w.workouts).some(
            w => w.isKeyWorkout && (w.date === dayBefore || w.date === dayAfter) && !affected.has(w.date)
          );
          if (!adjacentHasKey) {
            result = moveWorkout(kw, candidate, result);
            allDates.add(candidate);
            placed = true;
            break;
          }
        }
      }
      if (placed) break;
    }
    if (!placed) {
      // Mark as skipped if no slot found — this shouldn't happen in normal use
      result = result.map(week => ({
        ...week,
        workouts: week.workouts.map(w =>
          w.id === kw.id ? { ...w, status: 'skipped' as const } : w
        ),
      }));
    }
  }

  // Drop flexible workouts on travel days (mark skipped)
  for (const fw of flexWorkouts) {
    result = result.map(week => ({
      ...week,
      workouts: week.workouts.map(w =>
        w.id === fw.id ? { ...w, status: 'skipped' as const } : w
      ),
    }));
  }

  return result;
}

export function handleSickWeek(
  weekNumber: number,
  weeks: TrainingWeek[]
): TrainingWeek[] {
  return weeks.map(week => {
    if (week.weekNumber !== weekNumber) return week;
    return {
      ...week,
      workouts: week.workouts.map(w => {
        if (w.isKeyWorkout) {
          return { ...w, status: 'skipped' as const };
        }
        if (w.type === 'easy_run') {
          return {
            ...w,
            target: {
              ...w.target,
              distanceMiMin: Math.round((w.target.distanceMiMin ?? 3) * 0.6),
              distanceMiMax: Math.round((w.target.distanceMiMax ?? 5) * 0.6),
              notes: 'SICK WEEK — easy effort only, walk if needed',
            },
            status: 'modified' as const,
          };
        }
        return { ...w, status: 'skipped' as const };
      }),
    };
  });
}
