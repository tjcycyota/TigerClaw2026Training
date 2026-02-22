import { TrainingWeek, PlannedWorkout } from '../types';

let _idCounter = 1;
const uid = () => `w${String(_idCounter++).padStart(3, '0')}`;

const W = (
  date: string,
  week: number,
  type: PlannedWorkout['type'],
  target: PlannedWorkout['target'],
  isKey: boolean,
  status: PlannedWorkout['status'] = 'planned'
): PlannedWorkout => ({
  id: uid(),
  date,
  originalDate: date,
  week,
  type,
  target,
  status,
  isKeyWorkout: isKey,
});

// ─── Week 1: Feb 9-15 (history) ───────────────────────────────────────────────
const week1: TrainingWeek = {
  weekNumber: 1,
  startDate: '2026-02-09',
  phase: 'build',
  targetVolumeMi: 35,
  targetElevationFt: 3500,
  workouts: [
    W('2026-02-09', 1, 'yoga',     { durationMin: 30, notes: 'Mobility / recovery yoga' }, false, 'completed'),
    W('2026-02-10', 1, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, pace: '10:00-11:00', notes: 'Conversational easy pace' }, false, 'planned'),
    W('2026-02-11', 1, 'threshold',{ distanceMiMin: 3, distanceMiMax: 5, pace: '7:30-8:00', notes: 'Unity Run 5K race / track workout' }, true, 'completed'),
    W('2026-02-12', 1, 'uphill_treadmill', { distanceMiMin: 6, distanceMiMax: 8, elevationFt: 500, notes: 'Steady treadmill effort + strength' }, false, 'completed'),
    W('2026-02-13', 1, 'easy_run', { distanceMiMin: 4, distanceMiMax: 6, notes: 'Ladder intervals / easy effort' }, false, 'completed'),
    W('2026-02-14', 1, 'long_run', { distanceMiMin: 8, distanceMiMax: 12, elevationFt: 1500, notes: 'Trail long run – Olallie State Park' }, true, 'completed'),
    W('2026-02-15', 1, 'easy_run', { distanceMiMin: 3, distanceMiMax: 5, elevationFt: 300, notes: 'Easy recovery effort' }, false, 'completed'),
  ],
};

// ─── Week 2: Feb 16-22 (history — Lord Hill race Sat Feb 21) ─────────────────
const week2: TrainingWeek = {
  weekNumber: 2,
  startDate: '2026-02-16',
  phase: 'build',
  targetVolumeMi: 38,
  targetElevationFt: 4500,
  workouts: [
    W('2026-02-16', 2, 'rest',     { notes: 'Full rest day' }, false, 'completed'),
    W('2026-02-17', 2, 'strength', { durationMin: 45, notes: 'Weight training + short shake-out run' }, false, 'completed'),
    W('2026-02-18', 2, 'yoga',     { durationMin: 30, notes: 'Pre-race mobility' }, false, 'completed'),
    W('2026-02-19', 2, 'easy_run', { distanceMiMin: 3, distanceMiMax: 4, notes: 'Easy shakeout before Lord Hill' }, false, 'planned'),
    W('2026-02-20', 2, 'rest',     { notes: 'Full rest before race' }, false, 'completed'),
    W('2026-02-21', 2, 'long_run', { distanceMiMin: 18, distanceMiMax: 22, elevationFt: 3500, notes: 'Lord Hill 20M race — race simulation!' }, true, 'completed'),
    W('2026-02-22', 2, 'rest',     { notes: 'Post-race recovery' }, false, 'completed'),
  ],
};

// ─── Week 3: Feb 23 – Mar 1 ──────────────────────────────────────────────────
const week3: TrainingWeek = {
  weekNumber: 3,
  startDate: '2026-02-23',
  phase: 'build',
  targetVolumeMi: 40,
  targetElevationFt: 5500,
  workouts: [
    W('2026-02-23', 3, 'rest',     { notes: 'Rest / gentle walk only' }, false),
    W('2026-02-24', 3, 'strength', { durationMin: 45, notes: 'Strength: single-leg work, core, hip stability' }, false),
    W('2026-02-25', 3, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, pace: '10:30-11:30', notes: 'Very easy post-race recovery run' }, false),
    W('2026-02-26', 3, 'easy_run', { distanceMiMin: 5, distanceMiMax: 7, elevationFt: 400, notes: 'Easy hills, keep HR low' }, false),
    W('2026-02-27', 3, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, notes: 'Easy flat run' }, false),
    W('2026-02-28', 3, 'long_run', { distanceMiMin: 10, distanceMiMax: 13, elevationFt: 2500, notes: 'Trail long run — priority: vert and time on feet' }, true),
    W('2026-03-01', 3, 'long_run', { distanceMiMin: 6, distanceMiMax: 8, elevationFt: 800, notes: 'Back-to-back long effort — Tiger Mountain or similar' }, true),
  ],
};

// ─── Week 4: Mar 2-8 (recovery week) ─────────────────────────────────────────
const week4: TrainingWeek = {
  weekNumber: 4,
  startDate: '2026-03-02',
  phase: 'recovery',
  targetVolumeMi: 32,
  targetElevationFt: 3500,
  workouts: [
    W('2026-03-02', 4, 'rest',     { notes: 'Rest' }, false),
    W('2026-03-03', 4, 'strength', { durationMin: 45, notes: 'Strength + mobility focus — recovery week' }, false),
    W('2026-03-04', 4, 'xtrain',   { durationMin: 45, notes: 'Cross-train: bike, swim, or elliptical — no running' }, false),
    W('2026-03-05', 4, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, notes: 'Easy run — keep it aerobic' }, false),
    W('2026-03-06', 4, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, notes: 'Easy recovery run' }, false),
    W('2026-03-07', 4, 'long_run', { distanceMiMin: 10, distanceMiMax: 12, elevationFt: 1800, notes: 'Moderate long run — back off vert this week' }, true),
    W('2026-03-08', 4, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, elevationFt: 400, notes: 'Easy run, walk the uphills' }, false),
  ],
};

// ─── Week 5: Mar 9-15 ────────────────────────────────────────────────────────
const week5: TrainingWeek = {
  weekNumber: 5,
  startDate: '2026-03-09',
  phase: 'build',
  targetVolumeMi: 45,
  targetElevationFt: 6500,
  workouts: [
    W('2026-03-09', 5, 'rest',     { notes: 'Rest' }, false),
    W('2026-03-10', 5, 'hill_repeats', { distanceMiMin: 5, distanceMiMax: 7, elevationFt: 800, notes: 'Hill repeats: 6-8 x 3min hard uphill, walk down' }, true),
    W('2026-03-11', 5, 'strength', { durationMin: 45, notes: 'Strength + xtrain' }, false),
    W('2026-03-12', 5, 'threshold',{ distanceMiMin: 6, distanceMiMax: 8, pace: '8:30-9:00', notes: 'Tempo run: 2x15min at comfortably hard effort' }, true),
    W('2026-03-13', 5, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, notes: 'Easy recovery run' }, false),
    W('2026-03-14', 5, 'long_run', { distanceMiMin: 13, distanceMiMax: 16, elevationFt: 2800, notes: 'Long trail run — push vert, practice hiking uphills' }, true),
    W('2026-03-15', 5, 'long_run', { distanceMiMin: 6, distanceMiMax: 8, elevationFt: 800, notes: 'Back-to-back run — tired legs training' }, true),
  ],
};

// ─── Week 6: Mar 16-22 ───────────────────────────────────────────────────────
const week6: TrainingWeek = {
  weekNumber: 6,
  startDate: '2026-03-16',
  phase: 'build',
  targetVolumeMi: 50,
  targetElevationFt: 8000,
  workouts: [
    W('2026-03-16', 6, 'rest',     { notes: 'Rest' }, false),
    W('2026-03-17', 6, 'hill_repeats', { distanceMiMin: 6, distanceMiMax: 8, elevationFt: 1000, notes: 'Tiger Mountain hill repeats: 8-10 x 3min, max vert' }, true),
    W('2026-03-18', 6, 'strength', { durationMin: 50, notes: 'Strength: heavy single-leg, posterior chain' }, false),
    W('2026-03-19', 6, 'threshold',{ distanceMiMin: 7, distanceMiMax: 9, pace: '8:15-8:45', notes: 'Tempo: 3x10min at threshold with 2min recovery' }, true),
    W('2026-03-20', 6, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, notes: 'Easy run — aerobic base' }, false),
    W('2026-03-21', 6, 'long_run', { distanceMiMin: 15, distanceMiMax: 18, elevationFt: 3500, notes: 'Big day — Tiger Mountain or Cougar Mountain loops' }, true),
    W('2026-03-22', 6, 'long_run', { distanceMiMin: 7, distanceMiMax: 9, elevationFt: 1000, notes: 'Back-to-back Sunday effort' }, true),
  ],
};

// ─── Week 7: Mar 23-29 (recovery) ────────────────────────────────────────────
const week7: TrainingWeek = {
  weekNumber: 7,
  startDate: '2026-03-23',
  phase: 'recovery',
  targetVolumeMi: 42,
  targetElevationFt: 6000,
  workouts: [
    W('2026-03-23', 7, 'rest',     { notes: 'Rest' }, false),
    W('2026-03-24', 7, 'hill_repeats', { distanceMiMin: 5, distanceMiMax: 6, elevationFt: 700, notes: 'Moderate hill repeats — recovery pace' }, true),
    W('2026-03-25', 7, 'xtrain',   { durationMin: 45, notes: 'Easy cross-train, focus on legs flushing' }, false),
    W('2026-03-26', 7, 'easy_run', { distanceMiMin: 6, distanceMiMax: 7, notes: 'Easy aerobic run' }, false),
    W('2026-03-27', 7, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, notes: 'Easy run, strides at end' }, false),
    W('2026-03-28', 7, 'long_run', { distanceMiMin: 13, distanceMiMax: 15, elevationFt: 2800, notes: 'Long run with vert — slightly backed off week 6' }, true),
    W('2026-03-29', 7, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, elevationFt: 500, notes: 'Easy trail run' }, false),
  ],
};

// ─── Week 8: Mar 30 – Apr 5 (PEAK) ──────────────────────────────────────────
const week8: TrainingWeek = {
  weekNumber: 8,
  startDate: '2026-03-30',
  phase: 'build',
  targetVolumeMi: 58,
  targetElevationFt: 10000,
  workouts: [
    W('2026-03-30', 8, 'rest',     { notes: 'Rest — big week ahead' }, false),
    W('2026-03-31', 8, 'hill_repeats', { distanceMiMin: 7, distanceMiMax: 9, elevationFt: 1500, notes: 'MAX hill repeats: 10-12 x 3min uphill hard, Tiger Mtn' }, true),
    W('2026-04-01', 8, 'strength', { durationMin: 50, notes: 'Strength + 30min easy run' }, false),
    W('2026-04-02', 8, 'threshold',{ distanceMiMin: 8, distanceMiMax: 10, pace: '8:00-8:30', notes: 'Threshold: 2x20min or 4x10min at 5K-10K effort' }, true),
    W('2026-04-03', 8, 'easy_run', { distanceMiMin: 6, distanceMiMax: 7, notes: 'Easy recovery shakeout' }, false),
    W('2026-04-04', 8, 'long_run', { distanceMiMin: 18, distanceMiMax: 22, elevationFt: 4000, notes: 'PEAK LONG RUN — Tiger Mountain loops, race simulation effort' }, true),
    W('2026-04-05', 8, 'long_run', { distanceMiMin: 8, distanceMiMax: 10, elevationFt: 1500, notes: 'PEAK back-to-back — very important fatigue adaptation' }, true),
  ],
};

// ─── Week 9: Apr 6-12 (simulation) ──────────────────────────────────────────
const week9: TrainingWeek = {
  weekNumber: 9,
  startDate: '2026-04-06',
  phase: 'simulation',
  targetVolumeMi: 40,
  targetElevationFt: 8500,
  workouts: [
    W('2026-04-06', 9, 'rest',     { notes: 'Rest — recovery after peak' }, false),
    W('2026-04-07', 9, 'hill_repeats', { distanceMiMin: 6, distanceMiMax: 7, elevationFt: 1200, notes: 'Tiger Mountain hill repeats — race course preview' }, true),
    W('2026-04-08', 9, 'xtrain',   { durationMin: 45, notes: 'Easy cross-train' }, false),
    W('2026-04-09', 9, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, notes: 'Easy aerobic run' }, false),
    W('2026-04-10', 9, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, notes: 'Easy shakeout' }, false),
    W('2026-04-11', 9, 'long_run', { distanceMiMin: 15, distanceMiMax: 18, elevationFt: 4000, notes: 'Race simulation at Tiger Mountain — run 1-2 full loops of race course' }, true),
    W('2026-04-12', 9, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, elevationFt: 500, notes: 'Easy trail run recovery' }, false),
  ],
};

// ─── Week 10: Apr 13-19 (stimulus) ───────────────────────────────────────────
const week10: TrainingWeek = {
  weekNumber: 10,
  startDate: '2026-04-13',
  phase: 'stimulus',
  targetVolumeMi: 50,
  targetElevationFt: 7500,
  workouts: [
    W('2026-04-13', 10, 'rest',     { notes: 'Rest' }, false),
    W('2026-04-14', 10, 'threshold',{ distanceMiMin: 7, distanceMiMax: 9, pace: '8:00-8:30', notes: 'Final hard threshold session — 3x12min at race effort' }, true),
    W('2026-04-15', 10, 'strength', { durationMin: 45, notes: 'Final strength session — maintain, don\'t fatigue' }, false),
    W('2026-04-16', 10, 'hill_repeats', { distanceMiMin: 6, distanceMiMax: 7, elevationFt: 1000, notes: 'Hill repeats — last quality hill session' }, true),
    W('2026-04-17', 10, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, notes: 'Easy run' }, false),
    W('2026-04-18', 10, 'long_run', { distanceMiMin: 14, distanceMiMax: 16, elevationFt: 3000, notes: 'Last big long run before taper — Tiger Mountain' }, true),
    W('2026-04-19', 10, 'easy_run', { distanceMiMin: 5, distanceMiMax: 6, elevationFt: 500, notes: 'Easy back-to-back' }, false),
  ],
};

// ─── Week 11: Apr 20-26 (taper) ──────────────────────────────────────────────
const week11: TrainingWeek = {
  weekNumber: 11,
  startDate: '2026-04-20',
  phase: 'taper',
  targetVolumeMi: 30,
  targetElevationFt: 4000,
  workouts: [
    W('2026-04-20', 11, 'rest',     { notes: 'Rest — taper begins!' }, false),
    W('2026-04-21', 11, 'threshold',{ distanceMiMin: 5, distanceMiMax: 6, pace: '8:30-9:00', notes: 'Short tempo: 2x8min at race pace, keep it short' }, true),
    W('2026-04-22', 11, 'xtrain',   { durationMin: 30, notes: 'Easy cross-train — 30min only' }, false),
    W('2026-04-23', 11, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, notes: 'Easy run with 4-6 strides' }, false),
    W('2026-04-24', 11, 'easy_run', { distanceMiMin: 3, distanceMiMax: 4, notes: 'Very easy — legs should feel fresh' }, false),
    W('2026-04-25', 11, 'long_run', { distanceMiMin: 10, distanceMiMax: 12, elevationFt: 1800, notes: 'Last meaningful long run — easy effort, lots of hiking' }, true),
    W('2026-04-26', 11, 'easy_run', { distanceMiMin: 4, distanceMiMax: 5, elevationFt: 400, notes: 'Easy trail — stay sharp, don\'t overdo it' }, false),
  ],
};

// ─── Week 12: Apr 27 – May 9 (race week) ─────────────────────────────────────
const week12: TrainingWeek = {
  weekNumber: 12,
  startDate: '2026-04-27',
  phase: 'taper',
  targetVolumeMi: 18,
  targetElevationFt: 1500,
  workouts: [
    W('2026-04-27', 12, 'rest',     { notes: 'Rest — race week! Protect your legs.' }, false),
    W('2026-04-28', 12, 'easy_run', { distanceMiMin: 3, distanceMiMax: 4, pace: '11:00+', notes: 'Short easy run — 3-4 strides at race pace' }, false),
    W('2026-04-29', 12, 'xtrain',   { durationMin: 20, notes: 'Easy 20min walk/bike — just move' }, false),
    W('2026-04-30', 12, 'easy_run', { distanceMiMin: 3, distanceMiMax: 3, elevationFt: 200, notes: 'Short easy run with brief hills — confidence builder' }, false),
    W('2026-05-01', 12, 'rest',     { notes: 'Rest — pack race gear, review course' }, false),
    W('2026-05-02', 12, 'easy_run', { distanceMiMin: 2, distanceMiMax: 3, notes: 'Very short shakeout — 20-30min easy' }, false),
    W('2026-05-03', 12, 'rest',     { notes: 'Rest' }, false),
    W('2026-05-04', 12, 'rest',     { notes: 'Rest — final prep, sleep, hydrate' }, false),
    W('2026-05-05', 12, 'rest',     { notes: 'Rest — tomorrow is race day! Sleep 9pm.' }, false),
    W('2026-05-06', 12, 'rest',     { notes: 'Rest' }, false),
    W('2026-05-07', 12, 'rest',     { notes: 'Rest' }, false),
    W('2026-05-08', 12, 'rest',     { notes: 'Rest — race eve. Prepare drop bags, lay out gear.' }, false),
    W('2026-05-09', 12, 'long_run', { distanceMiMin: 31, distanceMiMax: 31, elevationFt: 8500, notes: '🏔️ TIGER CLAW 50K — Race Day! Tiger Mountain, Issaquah WA. 3 loops. Go get it!' }, true),
  ],
};

export const TRAINING_PLAN: TrainingWeek[] = [
  week1, week2, week3, week4, week5, week6,
  week7, week8, week9, week10, week11, week12,
];

export const RACE_DATE = '2026-05-09';
export const PLAN_START_DATE = '2026-02-09';
