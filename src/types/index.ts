export type WorkoutType =
  | 'easy_run'
  | 'long_run'
  | 'hill_repeats'
  | 'threshold'
  | 'uphill_treadmill'
  | 'strength'
  | 'xtrain'
  | 'yoga'
  | 'rest';

export type WorkoutStatus = 'planned' | 'completed' | 'skipped' | 'modified';
export type TrainingPhase = 'build' | 'recovery' | 'simulation' | 'stimulus' | 'taper' | 'race';

export interface WorkoutTarget {
  distanceMiMin?: number;
  distanceMiMax?: number;
  elevationFt?: number;
  durationMin?: number;
  pace?: string;
  notes?: string;
}

export interface PlannedWorkout {
  id: string;
  date: string;           // ISO "2026-03-01"
  originalDate: string;   // Never changes
  week: number;           // 1-12
  type: WorkoutType;
  target: WorkoutTarget;
  status: WorkoutStatus;
  isKeyWorkout: boolean;
  stravaActivityId?: number;
  actualDistanceMi?: number;
  actualElevationFt?: number;
  actualDurationMin?: number;
  stravaName?: string;
  isMovedFromDate?: string;
  autoAdjusted?: boolean;
}

export interface TrainingWeek {
  weekNumber: number;
  startDate: string;      // Monday ISO date
  phase: TrainingPhase;
  targetVolumeMi: number;
  targetElevationFt: number;
  workouts: PlannedWorkout[];
  actualVolumeMi?: number;
  actualElevationFt?: number;
}

export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;      // Unix timestamp
  scope: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  sport_type: string;
  start_date_local: string;
  distance_miles: number;
  elevation_ft: number;
  moving_time: number;
  pace_min_mile?: number | null;
  average_heartrate?: number | null;
}

export interface AdjustmentReason {
  type: 'traveling' | 'sick' | 'custom';
  dates?: string[];       // ISO dates affected
  description?: string;
}

export interface VolumeAdjustment {
  weekNumber: number;
  reason: string;
  originalTargetMi: number;
  adjustedTargetMi: number;
  percentChange: number;
}

export interface AppNotification {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  weekNumber?: number;
  dismissedAt?: number;
}
