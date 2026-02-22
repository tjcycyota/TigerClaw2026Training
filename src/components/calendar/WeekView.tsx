import React, { useRef } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parseISO, isToday } from 'date-fns';
import { useCalendarStore } from '../../store/calendarStore';
import { WorkoutCard } from './WorkoutCard';
import { VertProgress } from './VertProgress';
import { ActualVsPlanned } from './ActualVsPlanned';
import { TRAINING_PLAN } from '../../data/trainingPlan';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeekView() {
  const { activeWeekNumber, setActiveWeek, weeks, notifications, dismissNotification } = useCalendarStore();
  const dragStartX = useRef(0);

  const week = weeks.find(w => w.weekNumber === activeWeekNumber);
  if (!week) return <div className="p-4 text-slate-500">Week not found</div>;

  // Sort workouts by date
  const sortedWorkouts = [...week.workouts].sort((a, b) => a.date.localeCompare(b.date));

  function goToPrevWeek() {
    if (activeWeekNumber > 1) setActiveWeek(activeWeekNumber - 1);
  }
  function goToNextWeek() {
    if (activeWeekNumber < TRAINING_PLAN.length) setActiveWeek(activeWeekNumber + 1);
  }

  function handleSwipe(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) goToNextWeek();
    else if (info.offset.x > 60) goToPrevWeek();
  }

  const weekNotifications = notifications.filter(
    n => !n.weekNumber || n.weekNumber === activeWeekNumber
  );

  const phaseColors: Record<string, string> = {
    build: 'text-indigo-400',
    recovery: 'text-teal-400',
    simulation: 'text-orange-400',
    stimulus: 'text-red-400',
    taper: 'text-emerald-400',
    race: 'text-yellow-400',
  };

  return (
    <div className="select-none">
      {/* Week navigation */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={goToPrevWeek}
          disabled={activeWeekNumber <= 1}
          className="p-2 rounded-lg text-slate-400 disabled:opacity-30 active:bg-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-sm font-bold text-white">
            Week {week.weekNumber} of {TRAINING_PLAN.length}
          </div>
          <div className="text-xs text-slate-400">
            {format(parseISO(week.startDate), 'MMM d')} –{' '}
            {format(parseISO(sortedWorkouts[sortedWorkouts.length - 1]?.date ?? week.startDate), 'MMM d')}
            {' '}·{' '}
            <span className={phaseColors[week.phase] ?? 'text-slate-400'}>
              {week.phase.charAt(0).toUpperCase() + week.phase.slice(1)}
            </span>
          </div>
        </div>

        <button
          onClick={goToNextWeek}
          disabled={activeWeekNumber >= TRAINING_PLAN.length}
          className="p-2 rounded-lg text-slate-400 disabled:opacity-30 active:bg-slate-700"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Notifications */}
      {weekNotifications.map(n => (
        <div
          key={n.id}
          className={`mx-4 mb-2 px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${
            n.type === 'warning' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50' :
            n.type === 'success' ? 'bg-green-900/30 text-green-300 border border-green-700/50' :
            'bg-blue-900/30 text-blue-300 border border-blue-700/50'
          }`}
        >
          <span className="flex-1">{n.message}</span>
          <button onClick={() => dismissNotification(n.id)} className="opacity-60 hover:opacity-100 flex-shrink-0">✕</button>
        </div>
      ))}

      {/* Volume summary */}
      <div className="px-4 mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>Target: <span className="text-white font-medium">{week.targetVolumeMi}mi</span></span>
        {week.actualVolumeMi !== undefined && week.actualVolumeMi > 0 && (
          <span>Done: <span className="text-green-400 font-medium">{week.actualVolumeMi.toFixed(1)}mi</span></span>
        )}
      </div>

      {/* Vert progress */}
      <VertProgress
        targetFt={week.targetElevationFt}
        actualFt={week.actualElevationFt ?? 0}
      />

      {/* Actual vs planned */}
      <div className="mb-2">
        <ActualVsPlanned week={week} />
      </div>

      {/* Swipeable workout list */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleSwipe}
        className="px-4 space-y-2 pb-4 touch-pan-y"
      >
        {sortedWorkouts.map((workout) => {
          const dateObj = parseISO(workout.date);
          const dayName = format(dateObj, 'EEE');
          const dayNum = format(dateObj, 'd');
          const monthAbbr = format(dateObj, 'MMM');
          const today = isToday(dateObj);

          return (
            <div key={workout.id} className="flex gap-3">
              {/* Day label */}
              <div className={`w-10 flex-shrink-0 flex flex-col items-center pt-3 ${today ? 'text-orange-400' : 'text-slate-500'}`}>
                <span className="text-[10px] uppercase font-semibold leading-none">{dayName}</span>
                <span className="text-lg font-bold leading-tight">{dayNum}</span>
                <span className="text-[9px] uppercase">{monthAbbr}</span>
              </div>
              {/* Workout card */}
              <div className="flex-1 min-w-0">
                <WorkoutCard workout={workout} isToday={today} />
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
