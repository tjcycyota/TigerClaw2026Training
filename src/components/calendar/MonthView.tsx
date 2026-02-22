import React from 'react';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { PlannedWorkout, WorkoutType } from '../../types';
import { TRAINING_PLAN } from '../../data/trainingPlan';

const TYPE_COLORS: Record<WorkoutType, string> = {
  easy_run:         'bg-slate-400',
  long_run:         'bg-indigo-500',
  hill_repeats:     'bg-orange-500',
  threshold:        'bg-red-500',
  uphill_treadmill: 'bg-amber-500',
  strength:         'bg-purple-500',
  xtrain:           'bg-teal-400',
  yoga:             'bg-emerald-400',
  rest:             'bg-transparent',
};

// Build a flat map of date -> workouts
function buildDateMap(weeks: typeof TRAINING_PLAN) {
  const map = new Map<string, PlannedWorkout[]>();
  for (const week of weeks) {
    for (const workout of week.workouts) {
      if (!map.has(workout.date)) map.set(workout.date, []);
      map.get(workout.date)!.push(workout);
    }
  }
  return map;
}

function MonthGrid({ month }: { month: Date }) {
  const { weeks, setActiveWeek, setActiveView } = useCalendarStore();
  const dateMap = buildDateMap(weeks);

  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });

  // Pad to start on Monday
  const startDow = getDay(start); // 0=Sun
  const padBefore = startDow === 0 ? 6 : startDow - 1;
  const paddedDays = [
    ...Array(padBefore).fill(null),
    ...days,
  ];

  function handleDayTap(date: Date) {
    const dateStr = format(date, 'yyyy-MM-dd');
    const week = weeks.find(w => w.workouts.some(wo => wo.date === dateStr));
    if (week) {
      setActiveWeek(week.weekNumber);
      setActiveView('week');
    }
  }

  return (
    <div className="px-3 mb-6">
      <h3 className="text-sm font-bold text-slate-300 mb-3 px-1">
        {format(month, 'MMMM yyyy')}
      </h3>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[10px] text-slate-600 font-medium py-1">{d}</div>
        ))}
      </div>
      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {paddedDays.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />;
          const dateStr = format(day, 'yyyy-MM-dd');
          const workouts = dateMap.get(dateStr) ?? [];
          const significant = workouts.filter(w => w.type !== 'rest' && w.type !== 'yoga');
          const isInPlan = isSameMonth(day, month);
          const today = format(new Date(), 'yyyy-MM-dd') === dateStr;

          return (
            <button
              key={dateStr}
              onClick={() => handleDayTap(day)}
              className={`
                relative flex flex-col items-center py-1 rounded-lg transition-colors
                ${today ? 'bg-orange-500/20' : 'active:bg-slate-700/50'}
                ${!isInPlan ? 'opacity-30' : ''}
              `}
            >
              <span className={`text-[11px] font-medium ${today ? 'text-orange-400' : 'text-slate-400'}`}>
                {format(day, 'd')}
              </span>
              {/* Workout dots */}
              <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center max-w-[32px]">
                {significant.slice(0, 3).map(w => (
                  <div
                    key={w.id}
                    className={`w-1.5 h-1.5 rounded-full ${TYPE_COLORS[w.type]} ${w.status === 'completed' ? 'opacity-100' : 'opacity-60'}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MonthView() {
  const { weeks } = useCalendarStore();

  // Gather all unique months in the plan
  const allDates = weeks.flatMap(w => w.workouts.map(wo => wo.date));
  const months = Array.from(
    new Set(allDates.map(d => d.slice(0, 7)))
  ).sort().map(m => new Date(m + '-01'));

  const phaseColors: Record<string, string> = {
    build: 'bg-indigo-500',
    recovery: 'bg-teal-500',
    simulation: 'bg-orange-500',
    stimulus: 'bg-red-500',
    taper: 'bg-emerald-500',
    race: 'bg-yellow-500',
  };

  return (
    <div className="pt-4 pb-8">
      {/* Week list overview */}
      <div className="px-4 mb-6 space-y-1.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">12-Week Overview</h3>
        {weeks.map(week => {
          const completion = week.actualVolumeMi
            ? Math.round((week.actualVolumeMi / week.targetVolumeMi) * 100)
            : null;
          return (
            <div
              key={week.weekNumber}
              className="flex items-center gap-3 py-1.5"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${phaseColors[week.phase] ?? 'bg-slate-500'}`} />
              <span className="text-xs text-slate-400 w-14 flex-shrink-0">Wk {week.weekNumber}</span>
              <span className="text-xs text-slate-300 flex-shrink-0">{week.targetVolumeMi}mi</span>
              {/* Mini progress bar */}
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                {completion !== null && (
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.min(completion, 100)}%` }}
                  />
                )}
              </div>
              {completion !== null && (
                <span className="text-[10px] text-green-400 w-8 text-right">{completion}%</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 mb-6 flex flex-wrap gap-x-3 gap-y-1.5">
        {[
          ['easy_run', 'Easy'],
          ['long_run', 'Long'],
          ['hill_repeats', 'Hills'],
          ['threshold', 'Tempo'],
          ['strength', 'Strength'],
          ['xtrain', 'X-Train'],
        ].map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full ${TYPE_COLORS[type as WorkoutType]}`} />
            <span className="text-[11px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Month grids */}
      {months.map(m => (
        <MonthGrid key={format(m, 'yyyy-MM')} month={m} />
      ))}
    </div>
  );
}
