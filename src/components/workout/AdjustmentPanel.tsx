import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane, Thermometer, SkipForward, CheckSquare } from 'lucide-react';
import { PlannedWorkout } from '../../types';
import { useScheduleAdjust } from '../../hooks/useScheduleAdjust';
import { useCalendarStore } from '../../store/calendarStore';
import { format, parseISO, addDays } from 'date-fns';

interface AdjustmentPanelProps {
  workout: PlannedWorkout;
  onClose: () => void;
}

export function AdjustmentPanel({ workout, onClose }: AdjustmentPanelProps) {
  const [mode, setMode] = useState<'menu' | 'travel' | 'sick'>('menu');
  const [travelDates, setTravelDates] = useState<string[]>([workout.date]);
  const { applyTravelDays, applySickWeek } = useScheduleAdjust();
  const { updateWorkoutStatus } = useCalendarStore();

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

  // Generate ±7 day range for date picker
  const dateOptions = Array.from({ length: 15 }, (_, i) => {
    const d = addDays(parseISO(workout.date), i - 7);
    return format(d, 'yyyy-MM-dd');
  });

  function toggleDate(date: string) {
    setTravelDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  }

  return (
    <AnimatePresence>
      <>
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50"
          onClick={onClose}
        />
        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 rounded-t-2xl max-h-[80vh] overflow-y-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <div>
              <div className="font-semibold text-white">Adjust Workout</div>
              <div className="text-xs text-slate-400">{workout.type.replace('_', ' ')} · {workout.date}</div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 active:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === 'menu' && (
            <div className="p-4 space-y-2">
              <button
                onClick={() => setMode('travel')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left"
              >
                <Plane className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="font-medium text-white text-sm">I'm traveling</div>
                  <div className="text-xs text-slate-400">Reschedule key workouts around missed days</div>
                </div>
              </button>

              <button
                onClick={() => setMode('sick')}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left"
              >
                <Thermometer className="w-5 h-5 text-red-400" />
                <div>
                  <div className="font-medium text-white text-sm">I'm sick this week</div>
                  <div className="text-xs text-slate-400">Reduce week to easy runs, protect key workouts</div>
                </div>
              </button>

              <button
                onClick={handleSkip}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-700 active:bg-slate-600 text-left"
              >
                <SkipForward className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="font-medium text-white text-sm">Skip this workout</div>
                  <div className="text-xs text-slate-400">Mark as skipped, no reschedule</div>
                </div>
              </button>

              <button
                onClick={handleComplete}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-green-900/40 active:bg-green-900/60 text-left"
              >
                <CheckSquare className="w-5 h-5 text-green-400" />
                <div>
                  <div className="font-medium text-white text-sm">Mark as complete</div>
                  <div className="text-xs text-slate-400">Done! Record it even without Strava sync</div>
                </div>
              </button>
            </div>
          )}

          {mode === 'travel' && (
            <div className="p-4">
              <div className="text-sm text-slate-300 mb-3">Select the days you'll be traveling:</div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {dateOptions.map(date => (
                  <button
                    key={date}
                    onClick={() => toggleDate(date)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      travelDates.includes(date)
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {format(parseISO(date), 'EEE M/d')}
                  </button>
                ))}
              </div>
              <div className="text-xs text-slate-500 mb-4">
                Key workouts will be moved to the nearest open day. Easy runs may be dropped.
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('menu')}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleTravel}
                  disabled={travelDates.length === 0}
                  className="flex-1 py-3 rounded-xl bg-blue-500 text-white text-sm font-medium disabled:opacity-50"
                >
                  Apply ({travelDates.length} day{travelDates.length !== 1 ? 's' : ''})
                </button>
              </div>
            </div>
          )}

          {mode === 'sick' && (
            <div className="p-4">
              <div className="text-sm text-slate-300 mb-3">
                Sick week mode for Week {workout.week}:
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 mb-4 ml-2">
                <li>• All key workouts (long runs, hills, tempo) → skipped</li>
                <li>• Easy runs → reduced to 60% of normal distance</li>
                <li>• Rest and yoga → kept as-is</li>
                <li>• Focus on sleep and recovery</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('menu')}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 text-sm font-medium"
                >
                  Back
                </button>
                <button
                  onClick={handleSick}
                  className="flex-1 py-3 rounded-xl bg-red-500/70 text-white text-sm font-medium"
                >
                  Apply sick week
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  );
}
