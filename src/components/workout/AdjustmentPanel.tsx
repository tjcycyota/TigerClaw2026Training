import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Thermometer, SkipForward, CheckSquare, CalendarDays } from 'lucide-react';
import { PlannedWorkout } from '../../types';
import { useScheduleAdjust } from '../../hooks/useScheduleAdjust';
import { useCalendarStore } from '../../store/calendarStore';
import { format, parseISO, addDays } from 'date-fns';

interface AdjustmentPanelProps {
  workout: PlannedWorkout;
  onClose: () => void;
}

type Mode = 'menu' | 'move' | 'travel' | 'sick';

// Generate candidate dates for moving: today+90 days
function getCandidateDates(fromDate: string, count = 60): string[] {
  const dates: string[] = [];
  const start = addDays(new Date(), -7); // include 7 days in the past
  for (let i = 0; i < 180 && dates.length < count; i++) {
    dates.push(format(addDays(start, i), 'yyyy-MM-dd'));
  }
  return dates;
}

function getTravelDateOptions(fromDate: string): string[] {
  const base = parseISO(fromDate);
  return Array.from({ length: 15 }, (_, i) => format(addDays(base, i - 7), 'yyyy-MM-dd'));
}

export function AdjustmentPanel({ workout, onClose }: AdjustmentPanelProps) {
  const [mode, setMode] = useState<Mode>('menu');
  const [travelDates, setTravelDates] = useState<string[]>([workout.date]);
  const { applyTravelDays, applySickWeek } = useScheduleAdjust();
  const { updateWorkoutStatus, moveWorkoutToDate } = useCalendarStore();

  const candidateDates = getCandidateDates(workout.date);
  const travelDateOptions = getTravelDateOptions(workout.date);

  function handleMove(toDate: string) {
    moveWorkoutToDate(workout.id, toDate);
    onClose();
  }

  function handleTravel() {
    applyTravelDays(travelDates);
    onClose();
  }

  function handleSick() {
    applySickWeek(workout.week);
    onClose();
  }

  function handleSkip() {
    updateWorkoutStatus(workout.id, 'skipped');
    onClose();
  }

  function handleComplete() {
    updateWorkoutStatus(workout.id, 'completed');
    onClose();
  }

  function toggleDate(date: string) {
    setTravelDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]);
  }

  return (
    <AnimatePresence>
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />

        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 rounded-t-2xl overflow-hidden"
          style={{ maxHeight: '85vh', paddingBottom: 'env(safe-area-inset-bottom)' }}>

          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700 flex-shrink-0">
            <div>
              <div className="font-semibold text-white text-sm">
                {mode === 'menu' ? 'Adjust Workout' : mode === 'move' ? 'Move to a specific day' : mode === 'travel' ? 'Travel days' : 'Sick week'}
              </div>
              <div className="text-xs text-slate-400">{workout.type.replace('_', ' ')} · {workout.date}</div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400"><X className="w-5 h-5" /></button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 100px)' }}>

            {/* ─── MENU ─── */}
            {mode === 'menu' && (
              <div className="p-4 space-y-2">
                <button onClick={() => setMode('move')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left">
                  <CalendarDays className="w-5 h-5 text-orange-400" />
                  <div>
                    <div className="font-medium text-white text-sm">Move to a specific day</div>
                    <div className="text-xs text-slate-400">Pick any date to move this workout to</div>
                  </div>
                </button>

                <button onClick={() => setMode('travel')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="font-medium text-white text-sm">I'm traveling</div>
                    <div className="text-xs text-slate-400">Auto-reschedule key workouts around missed days</div>
                  </div>
                </button>

                <button onClick={() => setMode('sick')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left">
                  <Thermometer className="w-5 h-5 text-red-400" />
                  <div>
                    <div className="font-medium text-white text-sm">I'm sick this week</div>
                    <div className="text-xs text-slate-400">Reduce week to easy runs only</div>
                  </div>
                </button>

                <button onClick={handleSkip}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left">
                  <SkipForward className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="font-medium text-white text-sm">Skip this workout</div>
                    <div className="text-xs text-slate-400">Mark as skipped, no reschedule</div>
                  </div>
                </button>

                <button onClick={handleComplete}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-green-900/40 active:bg-green-900/60 text-left">
                  <CheckSquare className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="font-medium text-white text-sm">Mark as complete</div>
                    <div className="text-xs text-slate-400">Done — without waiting for Strava sync</div>
                  </div>
                </button>
              </div>
            )}

            {/* ─── MOVE TO DAY ─── */}
            {mode === 'move' && (
              <div className="p-4">
                <p className="text-xs text-slate-400 mb-3">Tap a date to move <strong className="text-white">{workout.type.replace('_', ' ')}</strong> there.</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {candidateDates.map(date => {
                    const isOriginal = date === workout.originalDate;
                    const isCurrent = date === workout.date;
                    return (
                      <button key={date} onClick={() => handleMove(date)}
                        className={`py-2.5 px-2 rounded-lg text-xs font-medium transition-colors text-center ${
                          isCurrent
                            ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                            : isOriginal
                              ? 'bg-slate-600 text-slate-300 border border-slate-500'
                              : 'bg-slate-700 text-slate-300 active:bg-blue-600 active:text-white'
                        }`}>
                        <div>{format(parseISO(date), 'EEE')}</div>
                        <div className="font-bold">{format(parseISO(date), 'M/d')}</div>
                        {isCurrent && <div className="text-[9px] opacity-70">current</div>}
                        {isOriginal && !isCurrent && <div className="text-[9px] opacity-70">original</div>}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setMode('menu')}
                  className="w-full py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium">Back</button>
              </div>
            )}

            {/* ─── TRAVEL DAYS ─── */}
            {mode === 'travel' && (
              <div className="p-4">
                <p className="text-xs text-slate-400 mb-3">Select the days you'll be traveling. Key workouts will be moved to the nearest open slot. Easy runs may be dropped.</p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {travelDateOptions.map(date => (
                    <button key={date} onClick={() => toggleDate(date)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${travelDates.includes(date) ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {format(parseISO(date), 'EEE M/d')}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setMode('menu')} className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium">Back</button>
                  <button onClick={handleTravel} disabled={travelDates.length === 0}
                    className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium disabled:opacity-50">
                    Apply ({travelDates.length} day{travelDates.length !== 1 ? 's' : ''})
                  </button>
                </div>
              </div>
            )}

            {/* ─── SICK WEEK ─── */}
            {mode === 'sick' && (
              <div className="p-4">
                <p className="text-sm text-slate-300 mb-3">Sick week mode for Week {workout.week}:</p>
                <ul className="text-xs text-slate-400 space-y-1.5 mb-4 ml-2">
                  <li>• Key workouts (long runs, hills, quality) → skipped</li>
                  <li>• Easy runs → reduced to 60% of normal distance</li>
                  <li>• Rest and yoga → kept as-is</li>
                  <li>• Focus on sleep and recovery</li>
                </ul>
                <div className="flex gap-3">
                  <button onClick={() => setMode('menu')} className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium">Back</button>
                  <button onClick={handleSick} className="flex-1 py-3 rounded-xl bg-red-500/70 text-white text-sm font-medium">Apply sick week</button>
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
