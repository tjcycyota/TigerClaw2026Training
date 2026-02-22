import { create } from 'zustand';
import { TrainingWeek, PlannedWorkout, WorkoutStatus, VolumeAdjustment, AppNotification } from '../types';
import { TRAINING_PLAN } from '../data/trainingPlan';
import { storage } from '../lib/storage';
import { getISOWeek, parseISO } from 'date-fns';

// Determine current week number based on today's date
function getCurrentWeekNumber(): number {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  for (const week of TRAINING_PLAN) {
    const start = parseISO(week.startDate);
    const end = new Date(start);
    // Week runs Mon-Sun (or Mon to 13 days for race week 12)
    const workoutDates = week.workouts.map(w => w.date);
    const maxDate = workoutDates.reduce((a, b) => a > b ? a : b, week.startDate);
    if (todayStr >= week.startDate && todayStr <= maxDate) {
      return week.weekNumber;
    }
  }
  // Default to last week
  return TRAINING_PLAN[TRAINING_PLAN.length - 1].weekNumber;
}

interface CalendarState {
  weeks: TrainingWeek[];
  activeWeekNumber: number;
  activeView: 'week' | 'month' | 'settings';
  volumeAdjustments: VolumeAdjustment[];
  notifications: AppNotification[];
  darkMode: boolean;

  setActiveWeek: (n: number) => void;
  setActiveView: (v: 'week' | 'month' | 'settings') => void;
  updateWorkoutStatus: (workoutId: string, status: WorkoutStatus) => void;
  updateWorkoutActuals: (workoutId: string, data: {
    stravaActivityId?: number;
    actualDistanceMi?: number;
    actualElevationFt?: number;
    actualDurationMin?: number;
    stravaName?: string;
    status?: WorkoutStatus;
  }) => void;
  updateWeekActuals: (weekNumber: number, actualVolumeMi: number, actualElevationFt: number) => void;
  setWeeks: (weeks: TrainingWeek[]) => void;
  addNotification: (n: AppNotification) => void;
  dismissNotification: (id: string) => void;
  setVolumeAdjustments: (a: VolumeAdjustment[]) => void;
  toggleDarkMode: () => void;
}

// Merge stored overrides into plan
function applyOverrides(plan: TrainingWeek[]): TrainingWeek[] {
  const overrides = storage.getWorkoutOverrides();
  if (Object.keys(overrides).length === 0) return plan;
  return plan.map(week => ({
    ...week,
    workouts: week.workouts.map(w => {
      const override = overrides[w.id];
      return override ? { ...w, ...override } : w;
    }),
  }));
}

const initialWeeks = applyOverrides(TRAINING_PLAN);
const initialWeekNumber = storage.getActiveWeek() ?? getCurrentWeekNumber();

export const useCalendarStore = create<CalendarState>((set, get) => ({
  weeks: initialWeeks,
  activeWeekNumber: initialWeekNumber,
  activeView: 'week',
  volumeAdjustments: storage.getVolumeAdjustments(),
  notifications: storage.getNotifications().filter(n => !n.dismissedAt),
  darkMode: storage.getDarkMode(),

  setActiveWeek: (n) => {
    storage.setActiveWeek(n);
    set({ activeWeekNumber: n });
  },

  setActiveView: (v) => set({ activeView: v }),

  updateWorkoutStatus: (workoutId, status) => {
    storage.setWorkoutOverride(workoutId, { status });
    set(state => ({
      weeks: state.weeks.map(week => ({
        ...week,
        workouts: week.workouts.map(w =>
          w.id === workoutId ? { ...w, status } : w
        ),
      })),
    }));
  },

  updateWorkoutActuals: (workoutId, data) => {
    storage.setWorkoutOverride(workoutId, data);
    set(state => ({
      weeks: state.weeks.map(week => ({
        ...week,
        workouts: week.workouts.map(w =>
          w.id === workoutId ? { ...w, ...data } : w
        ),
      })),
    }));
  },

  updateWeekActuals: (weekNumber, actualVolumeMi, actualElevationFt) => {
    set(state => ({
      weeks: state.weeks.map(week =>
        week.weekNumber === weekNumber
          ? { ...week, actualVolumeMi, actualElevationFt }
          : week
      ),
    }));
  },

  setWeeks: (weeks) => set({ weeks }),

  addNotification: (n) => {
    const current = get().notifications;
    const updated = [...current.filter(x => x.id !== n.id), n];
    storage.setNotifications(updated);
    set({ notifications: updated });
  },

  dismissNotification: (id) => {
    storage.dismissNotification(id);
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id),
    }));
  },

  setVolumeAdjustments: (a) => {
    storage.setVolumeAdjustments(a);
    set({ volumeAdjustments: a });
  },

  toggleDarkMode: () => {
    const next = !get().darkMode;
    storage.setDarkMode(next);
    set({ darkMode: next });
  },
}));
