import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { PlannedWorkout } from '../../types';
import { WorkoutCard } from './WorkoutCard';
import { VertProgress } from './VertProgress';
import { ActualVsPlanned } from './ActualVsPlanned';
import { TRAINING_PLAN } from '../../data/trainingPlan';

// Mileage progress bar — mirrors VertProgress
function MileageProgress({ targetMi, actualMi }: { targetMi: number; actualMi: number }) {
  const ratio = targetMi > 0 ? Math.min(actualMi / targetMi, 1.2) : 0;
  const pct = Math.round(ratio * 100);
  const barPct = Math.min(ratio * 100, 100);
  const isOver = ratio > 1;

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-400">Weekly Miles</span>
        <div className="text-xs text-slate-400">
          <span className={isOver ? 'text-green-400' : 'text-white'}>
            {actualMi > 0 ? actualMi.toFixed(1) : '—'}
          </span>
          <span className="text-slate-600"> / </span>
          <span>{targetMi}mi</span>
          {actualMi > 0 && (
            <span className={`ml-1.5 font-medium ${isOver ? 'text-green-400' : pct >= 80 ? 'text-indigo-400' : 'text-slate-500'}`}>
              ({pct}%)
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-green-500' : pct >= 80 ? 'bg-indigo-400' : 'bg-indigo-400/50'}`}
          style={{ width: `${barPct}%` }} />
      </div>
    </div>
  );
}

const PHASE_COLORS: Record<string, string> = {
  build: 'text-indigo-400', recovery: 'text-teal-400', simulation: 'text-orange-400',
  stimulus: 'text-red-400', taper: 'text-emerald-400', race: 'text-yellow-400',
};

export function WeekView() {
  const { activeWeekNumber, setActiveWeek, weeks, notifications, dismissNotification } = useCalendarStore();

  const week = weeks.find(w => w.weekNumber === activeWeekNumber);
  if (!week) return <div className="p-4 text-slate-500">Week not found</div>;

  // Group workouts by date, sorted chronologically, AM before PM within each day
  const allDates = Array.from(new Set(week.workouts.map(w => w.date))).sort();
  const byDate = new Map<string, PlannedWorkout[]>();
  for (const date of allDates) {
    byDate.set(date, week.workouts
      .filter(w => w.date === date)
      .sort((a, b) => {
        const order = { AM: 0, PM: 1, undefined: 2 };
        return (order[a.timeOfDay as keyof typeof order] ?? 2) - (order[b.timeOfDay as keyof typeof order] ?? 2);
      })
    );
  }

  function goToPrev() { if (activeWeekNumber > 1) setActiveWeek(activeWeekNumber - 1); }
  function goToNext() { if (activeWeekNumber < TRAINING_PLAN.length) setActiveWeek(activeWeekNumber + 1); }

  function handleSwipe(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) goToNext();
    else if (info.offset.x > 60) goToPrev();
  }

  const weekNotifs = notifications.filter(n => !n.weekNumber || n.weekNumber === activeWeekNumber);
  const lastDate = allDates[allDates.length - 1] ?? week.startDate;

  return (
    <div className="select-none">
      {/* Week nav */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={goToPrev} disabled={activeWeekNumber <= 1}
          className="p-2 rounded-lg text-slate-400 disabled:opacity-30 active:bg-slate-700">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="text-sm font-bold text-white">Week {week.weekNumber} of {TRAINING_PLAN.length}</div>
          <div className="text-xs text-slate-400">
            {format(parseISO(week.startDate), 'MMM d')} – {format(parseISO(lastDate), 'MMM d')}
            {' · '}
            <span className={PHASE_COLORS[week.phase] ?? 'text-slate-400'}>
              {week.phase.charAt(0).toUpperCase() + week.phase.slice(1)}
            </span>
          </div>
        </div>
        <button onClick={goToNext} disabled={activeWeekNumber >= TRAINING_PLAN.length}
          className="p-2 rounded-lg text-slate-400 disabled:opacity-30 active:bg-slate-700">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications */}
      {weekNotifs.map(n => (
        <div key={n.id} className={`mx-4 mb-2 px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${
          n.type === 'warning' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50' :
          n.type === 'success' ? 'bg-green-900/30 text-green-300 border border-green-700/50' :
          'bg-blue-900/30 text-blue-300 border border-blue-700/50'
        }`}>
          <span className="flex-1">{n.message}</span>
          <button onClick={() => dismissNotification(n.id)} className="opacity-60 flex-shrink-0">✕</button>
        </div>
      ))}

      {/* Progress bars */}
      <MileageProgress targetMi={week.targetVolumeMi} actualMi={week.actualVolumeMi ?? 0} />
      <VertProgress targetFt={week.targetElevationFt} actualFt={week.actualElevationFt ?? 0} />

      {/* Actual vs Planned summary */}
      <div className="mb-1"><ActualVsPlanned week={week} /></div>

      {/* Swipeable day list */}
      <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.1}
        onDragEnd={handleSwipe} className="px-4 space-y-3 pb-6 touch-pan-y">
        {allDates.map(date => {
          const workoutsForDay = byDate.get(date) ?? [];
          const dateObj = parseISO(date);
          const today = isToday(dateObj);

          return (
            <div key={date} className="flex gap-3">
              {/* Day label */}
              <div className={`w-10 flex-shrink-0 flex flex-col items-center pt-2.5 ${today ? 'text-orange-400' : 'text-slate-500'}`}>
                <span className="text-[10px] uppercase font-semibold leading-none">{format(dateObj, 'EEE')}</span>
                <span className="text-lg font-bold leading-tight">{format(dateObj, 'd')}</span>
                <span className="text-[9px] uppercase">{format(dateObj, 'MMM')}</span>
              </div>

              {/* One or more workout cards */}
              <div className="flex-1 min-w-0 space-y-1.5">
                {workoutsForDay.map(workout => (
                  <WorkoutCard key={workout.id} workout={workout} isToday={today} />
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
