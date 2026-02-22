import { StravaTokens, PlannedWorkout, VolumeAdjustment, AppNotification } from '../types';

const PREFIX = 'tc50k_';

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

function removeItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

// ─── Strava tokens ────────────────────────────────────────────────────────────
export const storage = {
  getTokens: () => getItem<StravaTokens>('strava_tokens'),
  setTokens: (t: StravaTokens) => setItem('strava_tokens', t),
  clearTokens: () => removeItem('strava_tokens'),

  // ─── Workout overrides (user-modified statuses, notes) ──────────────────
  getWorkoutOverrides: () => getItem<Record<string, Partial<PlannedWorkout>>>('workout_overrides') ?? {},
  setWorkoutOverride: (id: string, override: Partial<PlannedWorkout>) => {
    const all = storage.getWorkoutOverrides();
    all[id] = { ...all[id], ...override };
    setItem('workout_overrides', all);
  },

  // ─── Volume adjustments ──────────────────────────────────────────────────
  getVolumeAdjustments: () => getItem<VolumeAdjustment[]>('volume_adjustments') ?? [],
  setVolumeAdjustments: (a: VolumeAdjustment[]) => setItem('volume_adjustments', a),

  // ─── Notifications ───────────────────────────────────────────────────────
  getNotifications: () => getItem<AppNotification[]>('notifications') ?? [],
  setNotifications: (n: AppNotification[]) => setItem('notifications', n),
  dismissNotification: (id: string) => {
    const all = storage.getNotifications();
    const updated = all.map(n => n.id === id ? { ...n, dismissedAt: Date.now() } : n);
    setItem('notifications', updated);
  },

  // ─── Dark mode preference ────────────────────────────────────────────────
  getDarkMode: () => getItem<boolean>('dark_mode') ?? true,
  setDarkMode: (v: boolean) => setItem('dark_mode', v),

  // ─── Current week for navigation ─────────────────────────────────────────
  getActiveWeek: () => getItem<number>('active_week'),
  setActiveWeek: (w: number) => setItem('active_week', w),

  // ─── Last sync timestamp ─────────────────────────────────────────────────
  getLastSync: () => getItem<number>('last_sync'),
  setLastSync: (ts: number) => setItem('last_sync', ts),

  clearAll: () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  },
};
