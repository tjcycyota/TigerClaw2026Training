import { TrainingWeek, PlannedWorkout, WorkoutLink } from '../types';

// Shared link references from the PDF
const LINKS = {
  coreSnack:        { label: 'Core Snack routine', url: 'https://www.patreon.com/posts/core-snack-quick-109257823' },
  steadyRunning:    { label: 'Steady running / lactate shuttling', url: 'https://www.patreon.com/posts/steady-running-116121120' },
  mountainLegs:     { label: 'Mountain Legs (3-min routine)', url: 'https://www.trailrunnermag.com/training/trail-tips-training/3-minute-mountain-legs/' },
  ultraLegs:        { label: 'Ultra Legs routine', url: 'https://www.trailrunnermag.com/training/trail-tips-training/ultra-legs-a-strength-routine-for-ultrarunners/' },
  z2UphillTM:       { label: 'Z2 Uphill Treadmill tutorial', url: 'https://www.patreon.com/posts/z2-uphill-theory-129560209' },
  uphillTMThresh:   { label: 'Uphill TM threshold tutorial', url: 'https://www.patreon.com/posts/uphill-treadmill-143961253' },
} satisfies Record<string, WorkoutLink>;

let _id = 1;
const uid = () => `w${String(_id++).padStart(3, '0')}`;

const W = (
  date: string,
  week: number,
  type: PlannedWorkout['type'],
  target: PlannedWorkout['target'],
  isKey: boolean,
  status: PlannedWorkout['status'] = 'planned',
  timeOfDay?: PlannedWorkout['timeOfDay'],
): PlannedWorkout => ({
  id: uid(),
  date,
  originalDate: date,
  week,
  type,
  timeOfDay,
  target,
  status,
  isKeyWorkout: isKey,
});

// ─── WEEK 1: Feb 9–15 (history) ──────────────────────────────────────────────
const week1: TrainingWeek = {
  weekNumber: 1,
  startDate: '2026-02-09',
  phase: 'build',
  targetVolumeMi: 35,
  targetElevationFt: 3500,
  workouts: [
    W('2026-02-09', 1, 'rest', {
      notes: 'Rest. Heat ideal, like hot tub or sauna 20-30 min. Light x-train or a hike is good on any rest day. Full rest though, with some mobility work and core.',
    }, false, 'completed'),

    W('2026-02-10', 1, 'easy_run', {
      distanceMiMin: 6, distanceMiMax: 10,
      notes: '6-12 miles easy plus 6 x 20 second hills. On the easy running, think smooth and relaxed. The goal is to build the aerobic system in Z1 and Z2, rather than worry about speed. On the hill strides, think strong, starting relaxed and working to mile/800 effort, rather than a full sprint. Aim to do the Core Snack routine 1-2 times a day to reinforce core strength and stability! Note: After any easy run, you can add 10-15 minutes on the uphill treadmill in Z2 right after you finish.',
      links: [LINKS.coreSnack],
    }, false),

    W('2026-02-11', 1, 'hill_repeats', {
      distanceMiMin: 5, distanceMiMax: 8,
      notes: 'QUALITY SESSION: 2-3 miles easy warm-up, 6 x 2 minute hills mod/hard (think 5k effort) with run down recovery after each, 2 miles steady (think 50k pace), 1-2 miles easy.\n\nOptional easy double, uphill TM, or x-train. Doubles are anywhere from 20-45 min, working to Z2. Uphill TM ideally 10-15% grade (whatever feels best for you)! You can even add a weight vest and practice hiking if your race will involve lots of hiking! Doubles are purely optional—don\'t feel pressure to do them.\n\nNote: You can also do heat suit training on your doubles, where you overdress to get a heat stimulus (particularly for hot races).\n\nThis workout builds power, with the steady running after working on lactate shuttling.',
      links: [LINKS.steadyRunning],
    }, true, 'completed'),

    W('2026-02-11', 1, 'strength', {
      notes: 'Light Strength — Mountain Legs. Do the Mountain Legs right after you finish your run on strength days! You can do a different routine that works for you as well (like Ultra Legs), or add squats.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'completed', 'PM'),

    W('2026-02-12', 1, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 minutes or 6-12 miles easy. The x-training can be biking, elliptical, stairmill, or even uphill treadmill for athletes who don\'t have injury concerns. View these x-train days as flex days—you can ski, do a longer activity like a hike, or anything else. The goal is solely accumulating aerobic fun time in Z1 and Z2 in a 5-zone model. You can split it into 2 activities (AM and PM) if wanted!',
    }, false, 'completed'),

    W('2026-02-13', 1, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy or easy x-train 60-90 min. Friday is a purely easy day, letting the body fully recover. Think Z1! Heat ideal as well.',
    }, false, 'completed'),

    W('2026-02-14', 1, 'long_run', {
      distanceMiMin: 10, distanceMiMax: 14,
      elevationFt: 2000,
      notes: '12-16 miles easy/mod. On the primary weekend long run, aim to run solid hills even for races without a ton of vert (and if your race has a lot of vert, make sure the weekends are vert-filled). On easy/mod, it\'s not a specific effort, but generally running with purpose and intention, Z2 toward Z3 on uphills, with high-carb fueling to support adaptation.\n\nYou can do passive heat like sauna or hot tub any day that you have time since it doesn\'t add much stress.',
      links: [LINKS.mountainLegs],
    }, true, 'completed'),

    W('2026-02-15', 1, 'long_run', {
      distanceMiMin: 7, distanceMiMax: 11,
      elevationFt: 1000,
      notes: '8-14 miles easy plus 6 x 30 second hills or longer x-train. Keep this run nice and relaxed, with the hills sometime in the last few miles and focusing on power (think 3k toward mile effort, rather than a full sprint).\n\nOn Sundays, x-train is always an option in place of the run, including longer days of ski, bike, etc! Big principle: don\'t force Sunday runs. If you\'re tired or sore, it\'s ok to do any aerobic activity to off-load the body.',
      links: [LINKS.mountainLegs],
    }, false, 'completed'),

    W('2026-02-15', 1, 'strength', {
      notes: 'Mountain Legs + squats (2 x 10 reps of squats) + back extensions (2 x 20), engaging glutes. You can also continue any strength program that works for you!',
      links: [LINKS.mountainLegs],
    }, false, 'completed', 'PM'),
  ],
};

// ─── WEEK 2: Feb 16–22 (history — Lord Hill 20M race Sat Feb 21) ─────────────
const week2: TrainingWeek = {
  weekNumber: 2,
  startDate: '2026-02-16',
  phase: 'build',
  targetVolumeMi: 38,
  targetElevationFt: 4500,
  workouts: [
    W('2026-02-16', 2, 'rest', {
      notes: 'Rest. Heat ideal. Very advanced athletes could jog, but only if super high mileage 80+ mpw and no health concerns!',
    }, false, 'completed'),

    W('2026-02-17', 2, 'hill_repeats', {
      distanceMiMin: 7, distanceMiMax: 10,
      notes: 'QUALITY SESSION: 2-3 miles easy warm-up with a couple light strides, 16 x 1 minute fast/1 min easy (think 10k toward 5k effort on the fasts), 2 miles steady (think 50k pace), 1-2 miles easy.\n\nOptional easy double or uphill TM, or x-train.\n\nThis workout starts to work on vVO2. Make sure you aren\'t going too hard—we want it to feel flowy at first, getting harder as you go.',
    }, true, 'completed', 'AM'),

    W('2026-02-17', 2, 'strength', {
      notes: 'Mountain Legs. Do right after you finish your run on strength days!',
      links: [LINKS.mountainLegs],
    }, false, 'completed', 'PM'),

    W('2026-02-18', 2, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. Same deal as Thursday last week, just off-loading the body after the speed workout. Default to the x-train option, but high mileage, durable athletes can do easy running miles instead! When doing mid-week x-training, the goal is mostly Z2 rather than low Z1. You can even do some light moderate pushes when feeling good!',
    }, false, 'completed', 'AM'),

    W('2026-02-18', 2, 'strength', {
      notes: 'Full Strength session.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'completed', 'PM'),

    W('2026-02-19', 2, 'uphill_treadmill', {
      durationMin: 90,
      notes: 'Uphill treadmill aerobic day! 75-105 minutes in Z2 at 10-15% grade or easy run.\n\nZ2 uphill TM improves aerobic output at LT1 without low impact on the body. Fuel/hydrate well, and it\'s ok to drift into Z3 a bit. If you don\'t have access to an uphill TM, just do an easy run with the option to progress lightly.\n\nOptional easy double, uphill TM, or x-train.',
      links: [LINKS.z2UphillTM],
    }, false),

    W('2026-02-20', 2, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy with 5 x 20 seconds fast/2 min easy or 60-90 min easy x-train. Heat ideal.',
    }, false, 'completed'),

    W('2026-02-21', 2, 'long_run', {
      distanceMiMin: 14, distanceMiMax: 18,
      elevationFt: 3500,
      notes: '14-18 miles easy/mod. Just building up volume and keeping it mostly relaxed! You can progress effort a bit as you go if you\'re feeling good!\n\n⚡ TJ NOTE: Lord Hill 20M race today — race simulation! This replaces the planned long run.',
      links: [LINKS.mountainLegs],
    }, true, 'completed'),

    W('2026-02-22', 2, 'long_run', {
      distanceMiMin: 8, distanceMiMax: 12,
      notes: '10-14 miles easy or longer x-train. Pure Z1 day where you let yourself go slow, as if you\'re running or biking with someone who is less fast than you. Optional x-train double. X-train on these days could be any activity, including uphill treadmill.',
    }, false, 'completed', 'AM'),

    W('2026-02-22', 2, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'completed', 'PM'),
  ],
};

// ─── WEEK 3: Feb 23 – Mar 1 ──────────────────────────────────────────────────
const week3: TrainingWeek = {
  weekNumber: 3,
  startDate: '2026-02-23',
  phase: 'build',
  targetVolumeMi: 40,
  targetElevationFt: 5500,
  workouts: [
    W('2026-02-23', 3, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-02-24', 3, 'threshold', {
      distanceMiMin: 6, distanceMiMax: 9,
      notes: 'QUALITY SESSION: 2-3 miles easy with a couple strides, 4-6 x 120/60/30 seconds fast with 1 min easy after intervals and 2 min easy between sets (think 10k/5k/3k effort on each set), 2-3 miles easy cool-down.\n\nOptional easy double or uphill TM, or x-train. On this double, you can progress into 10 minutes moderate for a light double workout if feeling good.\n\nThe speed workout is a solid volume of intensity, so really take the cool-down afterward easy.',
      links: [LINKS.mountainLegs],
    }, true, 'planned', 'AM'),

    W('2026-02-24', 3, 'strength', {
      notes: 'Mountain Legs — do right after your run.',
      links: [LINKS.mountainLegs],
    }, false, 'planned', 'PM'),

    W('2026-02-25', 3, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. Keep this day super aerobic! Very high volume athletes could do a double on these days.',
    }, false),

    W('2026-02-26', 3, 'uphill_treadmill', {
      durationMin: 90,
      notes: '75-105 min uphill TM in Z2 to low Z3 or easy run with light progression. Optional easy double, uphill TM, or x-train.',
      links: [LINKS.z2UphillTM],
    }, false, 'planned', 'AM'),

    W('2026-02-26', 3, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),

    W('2026-02-27', 3, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-02-28', 3, 'long_run', {
      distanceMiMin: 12, distanceMiMax: 17,
      elevationFt: 3000,
      notes: '14-20 miles easy/mod with vert and strong downs plus 5 x 45 second hills near the end for a fatigue resistance stimulus.\n\nDownhills are free speed, and we want to work on eccentric contractions on these runs even for races without a ton of vert. That doesn\'t mean racing the downhills, just letting the body flow freely!',
      links: [LINKS.mountainLegs],
    }, true),

    W('2026-03-01', 3, 'long_run', {
      distanceMiMin: 9, distanceMiMax: 13,
      elevationFt: 1500,
      notes: '10-16 miles easy, progressing toward steady or longer x-train with some moderate pushes. Ideally over rolling terrain, practicing running with a bit more intention on tired legs. Optional x-train double.',
    }, false, 'planned', 'AM'),

    W('2026-03-01', 3, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),
  ],
};

// ─── WEEK 4: Mar 2–8 (recovery) ──────────────────────────────────────────────
const week4: TrainingWeek = {
  weekNumber: 4,
  startDate: '2026-03-02',
  phase: 'recovery',
  targetVolumeMi: 32,
  targetElevationFt: 3500,
  workouts: [
    W('2026-03-02', 4, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-03-03', 4, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 11,
      notes: '8-14 miles easy with 8 x 30 second hills (think 3k effort). Slightly larger hill session leading into uphill threshold workout! This will work on power but with low overall stress. Do the hills anytime after halfway.',
    }, false),

    W('2026-03-04', 4, 'uphill_treadmill', {
      durationMin: 90,
      notes: 'QUALITY SESSION — Uphill TM workout: 75-105 min with 6-10 x 5 min around 1-hour effort with 2 min easy recovery.\n\nOptional easy double, x-train, or uphill TM.\n\n8% grade is an ideal sweet-spot. If you do not have access to a treadmill, do the same session outdoors with half the interval duration — 6-10 x 2.5 minute hills with run down recovery.',
      links: [LINKS.uphillTMThresh],
    }, true, 'planned', 'AM'),

    W('2026-03-04', 4, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),

    W('2026-03-05', 4, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. Optional easy double, x-train, or uphill TM. Pure aerobic day, can be any mix of activities!',
    }, false),

    W('2026-03-06', 4, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy with 5 x 20 seconds fast/2 min easy or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-03-07', 4, 'long_run', {
      distanceMiMin: 10, distanceMiMax: 14,
      elevationFt: 1800,
      notes: '12-16 miles easy/mod (5 x 1 mile around 1-hour effort with 1 mile float recovery). This type of workout builds speed and endurance, so it\'s a good time to dial back the total volume and focus on the quality of the session.\n\nKeep the threshold miles smooth, building into it as you go. Floats are a bit faster than normal easy effort!',
      links: [LINKS.mountainLegs],
    }, true),

    W('2026-03-08', 4, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 11,
      elevationFt: 500,
      notes: '8-14 miles easy plus 6 x 20 second steep hills or longer x-train, focusing on power output on the hills. Keep this one nice and relaxed! Optional x-train double.',
    }, false, 'planned', 'AM'),

    W('2026-03-08', 4, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),
  ],
};

// ─── WEEK 5: Mar 9–15 ────────────────────────────────────────────────────────
const week5: TrainingWeek = {
  weekNumber: 5,
  startDate: '2026-03-09',
  phase: 'build',
  targetVolumeMi: 45,
  targetElevationFt: 6500,
  workouts: [
    W('2026-03-09', 5, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-03-10', 5, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 10,
      notes: '8-12 miles easy plus 5 x 20 second hills. Keep this one very easy before quality day tomorrow.',
    }, false),

    W('2026-03-11', 5, 'threshold', {
      distanceMiMin: 7, distanceMiMax: 11,
      notes: 'QUALITY SESSION: 2-3 miles easy, 6-10 x 3 min fast/90 seconds easy (think 1-hour effort, progressing effort a bit as you go until you\'re ending the workout harder), 3 min easy, 4 x 30 seconds fast/2 min easy (think mile effort), 2-3 miles easy.\n\nPM optional workout on uphill treadmill or x-train: 30-45 min with 5-8 x 2 min around 10k effort with 1 min easy recovery. You can also just keep the double easy and relaxed!\n\nDouble workouts are a major adaptation signal, but are not necessary for peak performance, so listen to your body and brain.',
    }, true, 'planned', 'AM'),

    W('2026-03-11', 5, 'strength', {
      notes: 'Mountain Legs (a break from Full Strength this week). Do right after your run.',
      links: [LINKS.mountainLegs],
    }, false, 'planned', 'PM'),

    W('2026-03-12', 5, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. Optional easy double, x-train, or uphill TM.',
    }, false),

    W('2026-03-13', 5, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-03-14', 5, 'long_run', {
      distanceMiMin: 14, distanceMiMax: 18,
      elevationFt: 3500,
      notes: '16-20 miles easy on trails with strong downs, aiming to finish feeling good. Downhills are key in these races since muscular demand is high but aerobic stress is low, and we want to reinforce that stimulus as much as possible! Downhills are how we can beat athletes who might have other advantages.',
    }, true),

    W('2026-03-15', 5, 'long_run', {
      distanceMiMin: 9, distanceMiMax: 13,
      elevationFt: 1500,
      notes: '10-16 miles easy on trails, keeping it purely Z1, plus 4 x 30 second hills or longer x-train. We want this aerobic weekend to really be relaxing! No optional double on this day, going into next week fresh!\n\nNow is when to start thinking more about the vert profile of your race. If your race is steep, accumulate lots of weekend vert!',
      links: [LINKS.mountainLegs],
    }, false),
  ],
};

// ─── WEEK 6: Mar 16–22 ───────────────────────────────────────────────────────
const week6: TrainingWeek = {
  weekNumber: 6,
  startDate: '2026-03-16',
  phase: 'build',
  targetVolumeMi: 50,
  targetElevationFt: 8000,
  workouts: [
    W('2026-03-16', 6, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-03-17', 6, 'threshold', {
      distanceMiMin: 7, distanceMiMax: 11,
      notes: 'QUALITY SESSION — Track workout: 2-3 miles easy warm-up, 6-10 x 600m fast with 200m easy recovery (think 10k effort to start, progressing a bit as you go), 400m easy, 4 x 200m fast/200m slow (think mile effort), 2-3 miles easy.\n\nOptional easy double, x-train, or uphill TM. On this double, you can progress into 15 minutes moderate for a light double workout if feeling good.\n\nSubstitute 2 minute intervals if you want to avoid the track, thinking 10k effort.',
    }, true, 'planned', 'AM'),

    W('2026-03-17', 6, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),

    W('2026-03-18', 6, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. Keep this day very chill! High mileage athletes could do a double here, but only if zero health concerns.',
    }, false),

    W('2026-03-19', 6, 'uphill_treadmill', {
      durationMin: 90,
      notes: '75-105 min uphill TM in Z2. Optional easy double, uphill TM, or x-train.\n\nAt this part of the plan, start thinking about the specific demands of your race. If there is a lot of hiking, do some weight vest hiking doubles. If it might be hot, do some heat suit.',
      links: [LINKS.z2UphillTM, LINKS.mountainLegs],
    }, false),

    W('2026-03-20', 6, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles very easy with 5 x 20 seconds fast/2 min easy or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-03-21', 6, 'long_run', {
      distanceMiMin: 14, distanceMiMax: 19,
      elevationFt: 4000,
      notes: '16-22 miles easy/mod. Just racking up some volume here, with 5 x 45 second hills near the end for fatigue resistance.',
      links: [LINKS.mountainLegs],
    }, true),

    W('2026-03-22', 6, 'long_run', {
      distanceMiMin: 11, distanceMiMax: 17,
      elevationFt: 2000,
      notes: '12-20 miles easy with some hills with strong downhills or longer x-train. We want to reinforce quick downhills on tired legs, and the eccentric muscle contraction response to that stimulus. No optional double.',
    }, false, 'planned', 'AM'),

    W('2026-03-22', 6, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),
  ],
};

// ─── WEEK 7: Mar 23–29 (recovery) ────────────────────────────────────────────
const week7: TrainingWeek = {
  weekNumber: 7,
  startDate: '2026-03-23',
  phase: 'recovery',
  targetVolumeMi: 42,
  targetElevationFt: 6000,
  workouts: [
    W('2026-03-23', 7, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-03-24', 7, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 10,
      notes: '8-12 miles easy. Aerobic emphasis — start the week very easy.',
    }, false),

    W('2026-03-25', 7, 'uphill_treadmill', {
      durationMin: 90,
      notes: 'QUALITY SESSION — Uphill TM workout: 75-105 min with 8-12 x 5 min around 1-hour effort with 2 min easy recovery.\n\nOptional easy double, x-train, or uphill TM (start thinking weight vest hiking doubles if your race is hiking-heavy).\n\nThis is a really big session however you cut it — focus on fueling with more carbs than you will on race day!\n\nIf outdoors, do 2.5 minute hills again!',
      links: [LINKS.uphillTMThresh],
    }, true, 'planned', 'AM'),

    W('2026-03-25', 7, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),

    W('2026-03-26', 7, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 10,
      notes: '8-12 miles easy. Optional easy double, x-train, or uphill TM.',
      links: [LINKS.mountainLegs],
    }, false),

    W('2026-03-27', 7, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy plus 4 x 20 second hills or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-03-28', 7, 'long_run', {
      distanceMiMin: 10, distanceMiMax: 14,
      elevationFt: 2500,
      notes: '12-16 miles easy/mod — the "Power Hour" workout: 1 hour moderate to mod/hard embedded in the long run.\n\nThis "Power Hour" workout in the context of a long run will help prepare the musculoskeletal system for race day! View it as a race simulation with mindset, focus, and intention.\n\nYou can also do a sub-ultra training race at any point of this build, just adding an extra rest day after.',
    }, true),

    W('2026-03-29', 7, 'long_run', {
      distanceMiMin: 7, distanceMiMax: 11,
      elevationFt: 1500,
      notes: '8-14 miles easy, progressing toward steady over rolling terrain or longer x-train. Optional x-train double.',
      links: [LINKS.mountainLegs],
    }, false),
  ],
};

// ─── WEEK 8: Mar 30 – Apr 5 (PEAK) ──────────────────────────────────────────
const week8: TrainingWeek = {
  weekNumber: 8,
  startDate: '2026-03-30',
  phase: 'build',
  targetVolumeMi: 58,
  targetElevationFt: 10000,
  workouts: [
    W('2026-03-30', 8, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-03-31', 8, 'threshold', {
      distanceMiMin: 8, distanceMiMax: 12,
      notes: 'QUALITY SESSION — Track workout: 2-3 miles easy warm-up, 6-10 x 800m fast with 400m easy recovery (think 10k, with light progression), 4 x 200m fast/200m slow (think mile effort), 2-3 miles easy cool-down.\n\nOptional easy double, x-train, or uphill TM.',
      links: [LINKS.mountainLegs],
    }, true, 'planned', 'AM'),

    W('2026-03-31', 8, 'strength', {
      notes: 'Mountain Legs — do right after your run.',
      links: [LINKS.mountainLegs],
    }, false, 'planned', 'PM'),

    W('2026-04-01', 8, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. Pure recovery after the track workout!',
    }, false, 'planned', 'AM'),

    W('2026-04-01', 8, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),

    W('2026-04-02', 8, 'uphill_treadmill', {
      durationMin: 105,
      notes: '90-120 min uphill TM in Z2 or very easy run. Optional easy double, x-train, or uphill TM. Err on the side of easier on this session, since it\'s longer!',
      links: [LINKS.z2UphillTM],
    }, false),

    W('2026-04-03', 8, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles very easy with 5 x 20 seconds fast/2 min easy or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-04-04', 8, 'long_run', {
      distanceMiMin: 18, distanceMiMax: 22,
      elevationFt: 5000,
      notes: '⭐ PEAK LONG RUN: 20-25 miles easy on trails with vert and strong downhills as quick or quicker than race day, aiming to finish feeling good.\n\nGo a bit higher carb than race day, emphasizing fatigue resistance. This is a race simulation day — run the Tiger Mountain course if possible!',
      links: [LINKS.mountainLegs],
    }, true),

    W('2026-04-05', 8, 'long_run', {
      distanceMiMin: 11, distanceMiMax: 14,
      elevationFt: 2000,
      notes: '12-16 miles easy plus 6 x 30 second hills at the end or longer x-train. No double on this one after higher volume week.',
    }, false, 'planned', 'AM'),

    W('2026-04-05', 8, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),
  ],
};

// ─── WEEK 9: Apr 6–12 (simulation) ──────────────────────────────────────────
const week9: TrainingWeek = {
  weekNumber: 9,
  startDate: '2026-04-06',
  phase: 'simulation',
  targetVolumeMi: 40,
  targetElevationFt: 8500,
  workouts: [
    W('2026-04-06', 9, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-04-07', 9, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 10,
      notes: '8-12 miles easy plus 5 x 20 second hills. Very easy today!',
    }, false),

    W('2026-04-08', 9, 'threshold', {
      distanceMiMin: 8, distanceMiMax: 11,
      notes: 'QUALITY SESSION: 2-3 miles easy, 4-6 x 5 min fast/90 seconds easy (think 1-hour effort, with light progression), 2 miles steady (think 50k pace), 1-2 miles very easy.\n\nPM workout on uphill TM or x-train: 30-45 min with 10-15 x 1 min around 10k effort with 30 seconds easy recovery. Only do this double workout if you are feeling great, energized, and 100% healthy!',
    }, true, 'planned', 'AM'),

    W('2026-04-09', 9, 'xtrain', {
      durationMin: 90,
      notes: 'Easy x-train 75-120 min or 6-12 miles very easy run. No optional double.',
      links: [LINKS.mountainLegs],
    }, false),

    W('2026-04-10', 9, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy plus 4 x 30 second hills or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-04-11', 9, 'long_run', {
      distanceMiMin: 14, distanceMiMax: 20,
      elevationFt: 5000,
      notes: '⭐ RACE SIMULATION: 2-3 miles easy with a couple strides, 10-15 miles moderate to mod/hard, 2-3 miles easy cool-down.\n\nThis is a race-style simulation, doing everything like you will do on race day (ideally on race-specific terrain — Tiger Mountain!).\n\nThis effort will stimulate the nervous system to be ready for the lower level effort of race day. Don\'t overdo it—no need to go fully to the well. But this session will show you everything you need to know for race day!',
    }, true),

    W('2026-04-12', 9, 'xtrain', {
      durationMin: 120,
      notes: 'Easy x-train 1.5-3 hours. Just a nice relaxed Z2 day after the longer effort the day before!',
      links: [LINKS.mountainLegs],
    }, false),
  ],
};

// ─── WEEK 10: Apr 13–19 (stimulus) ───────────────────────────────────────────
const week10: TrainingWeek = {
  weekNumber: 10,
  startDate: '2026-04-13',
  phase: 'stimulus',
  targetVolumeMi: 50,
  targetElevationFt: 7500,
  workouts: [
    W('2026-04-13', 10, 'rest', {
      notes: 'Rest or easy jog. An easy jog would be good if you want to keep volume higher! Heat ideal.',
    }, false),

    W('2026-04-14', 10, 'easy_run', {
      distanceMiMin: 7, distanceMiMax: 10,
      notes: '8-12 miles easy with 5 x 20 seconds fast/2 min easy.',
    }, false),

    W('2026-04-15', 10, 'hill_repeats', {
      distanceMiMin: 7, distanceMiMax: 11,
      notes: 'QUALITY SESSION: 2-3 miles easy warm-up, 5 x 3 min hills mod/hard (think 10k effort with light progression) with run down recovery, 15-20 min moderate on tired legs (think half marathon effort), 2-3 miles easy.\n\nOptional easy double, uphill TM, or x-train.',
    }, true, 'planned', 'AM'),

    W('2026-04-15', 10, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),

    W('2026-04-16', 10, 'uphill_treadmill', {
      durationMin: 90,
      notes: '75-105 min uphill TM in Z2, x-train, or very easy run. Optional easy double, uphill TM, or x-train.',
      links: [LINKS.z2UphillTM],
    }, false),

    W('2026-04-17', 10, 'easy_run', {
      distanceMiMin: 4, distanceMiMax: 8,
      notes: '4-10 miles easy with 5 x 20 seconds fast/2 min easy or 60-90 min easy x-train. Heat ideal.',
    }, false),

    W('2026-04-18', 10, 'long_run', {
      distanceMiMin: 14, distanceMiMax: 18,
      elevationFt: 4000,
      notes: '16-20 miles easy/moderate with some vert and strong downs plus 4 x 1 minute hills at the end around 5k effort.\n\nThe goal here is to get a final big eccentric contraction stimulus to have the body ready to absorb muscular demands of race day! The hills at the end will be a fatigue resistance stimulus.',
      links: [LINKS.mountainLegs],
    }, true),

    W('2026-04-19', 10, 'long_run', {
      distanceMiMin: 9, distanceMiMax: 13,
      elevationFt: 1500,
      notes: '10-16 miles easy, progressing toward steady over rolling terrain or longer x-train. No double!',
    }, false, 'planned', 'AM'),

    W('2026-04-19', 10, 'strength', {
      notes: 'Full Strength.',
      links: [LINKS.mountainLegs, LINKS.ultraLegs],
    }, false, 'planned', 'PM'),
  ],
};

// ─── WEEK 11: Apr 20–26 (taper) ──────────────────────────────────────────────
const week11: TrainingWeek = {
  weekNumber: 11,
  startDate: '2026-04-20',
  phase: 'taper',
  targetVolumeMi: 30,
  targetElevationFt: 4000,
  workouts: [
    W('2026-04-20', 11, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-04-21', 11, 'easy_run', {
      distanceMiMin: 5, distanceMiMax: 8,
      notes: '6-10 miles easy plus 5 x 20 second hills.',
    }, false),

    W('2026-04-22', 11, 'threshold', {
      distanceMiMin: 6, distanceMiMax: 9,
      notes: 'QUALITY SESSION: 2-3 miles easy warm-up, 6-10 x 2 min around 1-hour effort toward 10k effort with 1 min easy recovery, 2 miles steady (think 50k pace), 1-2 miles very easy.\n\nOptional easy double, uphill TM, or x-train. You can end this workout a bit faster if you\'re feeling good!\n\nNote: If you\'re tired coming into this workout and feel like you need more taper, do 6-10 miles easy to steady rather than the session.',
    }, true, 'planned', 'AM'),

    W('2026-04-23', 11, 'xtrain', {
      durationMin: 67,
      notes: 'Easy x-train 60-75 min or 6-10 miles easy run. Heat ideal.',
    }, false),

    W('2026-04-24', 11, 'easy_run', {
      distanceMiMin: 3, distanceMiMax: 7,
      notes: '4-8 miles easy with 5 x 20 seconds fast/2 min easy.',
    }, false),

    W('2026-04-25', 11, 'long_run', {
      distanceMiMin: 10, distanceMiMax: 14,
      elevationFt: 1800,
      notes: '12-16 miles easy long run. Keep it in Z2 and focused on aerobic activation, with high-carb fueling to keep body adapting.',
    }, true),

    W('2026-04-26', 11, 'easy_run', {
      distanceMiMin: 5, distanceMiMax: 8,
      elevationFt: 500,
      notes: '6-10 miles easy plus 5 x 20 second hills.',
    }, false),
  ],
};

// ─── WEEK 12: Apr 27 – May 9 (RACE WEEK) ─────────────────────────────────────
const week12: TrainingWeek = {
  weekNumber: 12,
  startDate: '2026-04-27',
  phase: 'taper',
  targetVolumeMi: 18,
  targetElevationFt: 1500,
  workouts: [
    W('2026-04-27', 12, 'rest', {
      notes: 'Rest. Heat ideal.',
    }, false),

    W('2026-04-28', 12, 'threshold', {
      distanceMiMin: 5, distanceMiMax: 7,
      notes: 'SHAKEOUT QUALITY SESSION: 2-3 miles easy warm-up, 3-4 x 5 min around 1-hour effort with 1 min easy recovery, 5 min easy, 5 x 30 second slight hills fast (think 3k effort), 2-3 miles easy cool-down.',
    }, true),

    W('2026-04-29', 12, 'easy_run', {
      distanceMiMin: 3, distanceMiMax: 7,
      notes: '4-8 miles easy.',
    }, false),

    W('2026-04-30', 12, 'rest', {
      notes: 'Rest and recovery. Light heat ideal to maintain blood volume.',
    }, false),

    W('2026-05-01', 12, 'easy_run', {
      distanceMiMin: 3, distanceMiMax: 5,
      elevationFt: 400,
      notes: '4-6 miles easy plus 4 x 30 second hills.',
    }, false),

    W('2026-05-02', 12, 'easy_run', {
      distanceMiMin: 2, distanceMiMax: 4,
      notes: 'Easy shakeout — stay loose, don\'t overdo it.',
    }, false),

    W('2026-05-03', 12, 'rest', {
      notes: 'Rest — review race course map, confirm gear list.',
    }, false),

    W('2026-05-04', 12, 'rest', {
      notes: 'Rest — prep drop bags if allowed, lay out race gear.',
    }, false),

    W('2026-05-05', 12, 'rest', {
      notes: 'Rest — sleep 9pm. No heroics.',
    }, false),

    W('2026-05-06', 12, 'rest', { notes: 'Rest.' }, false),
    W('2026-05-07', 12, 'rest', { notes: 'Rest.' }, false),

    W('2026-05-08', 12, 'rest', {
      notes: 'Race eve. Final prep. Eat well, sleep early. You\'re ready.',
    }, false),

    W('2026-05-09', 12, 'long_run', {
      distanceMiMin: 31, distanceMiMax: 31,
      elevationFt: 8500,
      notes: '🏔️ TIGER CLAW 50K — Race Day!\n\nTiger Mountain, Issaquah WA. 3-loop course.\n\nFuel with high carb, hydrate well for your specific needs. Start controlled on loop 1, build into loop 2, and empty the tank on loop 3.',
    }, true),
  ],
};

export const TRAINING_PLAN: TrainingWeek[] = [
  week1, week2, week3, week4, week5, week6,
  week7, week8, week9, week10, week11, week12,
];

export const RACE_DATE = '2026-05-09';
export const PLAN_START_DATE = '2026-02-09';
