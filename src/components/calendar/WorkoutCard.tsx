import React, { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Mountain, Dumbbell, Bike, Leaf, Minus } from 'lucide-react';
import { PlannedWorkout, WorkoutType } from '../../types';
import { useCalendarStore } from '../../store/calendarStore';
import { AdjustmentPanel } from '../workout/AdjustmentPanel';
import { format, parseISO } from 'date-fns';

// ─── Color config ────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<WorkoutType, { bg: string; text: string; border: string; label: string }> = {
  easy_run:         { bg: 'bg-slate-700',    text: 'text-slate-300',  border: 'border-slate-600', label: 'Easy Run' },
  long_run:         { bg: 'bg-indigo-900/50', text: 'text-indigo-300', border: 'border-indigo-700', label: 'Long Run' },
  hill_repeats:     { bg: 'bg-orange-900/50', text: 'text-orange-300', border: 'border-orange-700', label: 'Hills' },
  threshold:        { bg: 'bg-red-900/50',    text: 'text-red-300',    border: 'border-red-700',    label: 'Tempo' },
  uphill_treadmill: { bg: 'bg-amber-900/50',  text: 'text-amber-300',  border: 'border-amber-700',  label: 'Uphill TM' },
  strength:         { bg: 'bg-purple-900/50', text: 'text-purple-300', border: 'border-purple-700', label: 'Strength' },
  xtrain:           { bg: 'bg-teal-900/50',   text: 'text-teal-300',   border: 'border-teal-700',   label: 'X-Train' },
  yoga:             { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-800', label: 'Yoga' },
  rest:             { bg: 'bg-slate-800',     text: 'text-slate-500',  border: 'border-slate-700',  label: 'Rest' },
};

const TYPE_ICONS: Partial<Record<WorkoutType, React.ReactNode>> = {
  strength: <Dumbbell className="w-3.5 h-3.5" />,
  xtrain:   <Bike className="w-3.5 h-3.5" />,
  yoga:     <Leaf className="w-3.5 h-3.5" />,
  rest:     <Minus className="w-3.5 h-3.5" />,
};

function VertIcon({ ft }: { ft: number }) {
  if (ft >= 3000) return <span className="text-orange-400" title={`${ft.toLocaleString()}ft`}>⛰⛰</span>;
  if (ft >= 1500) return <span className="text-orange-400/70" title={`${ft.toLocaleString()}ft`}>⛰</span>;
  return null;
}

interface WorkoutCardProps {
  workout: PlannedWorkout;
  isToday: boolean;
}

export function WorkoutCard({ workout, isToday }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [swipeFlash, setSwipeFlash] = useState<'complete' | 'adjust' | null>(null);
  const { updateWorkoutStatus } = useCalendarStore();
  const controls = useAnimation();

  const cfg = TYPE_CONFIG[workout.type];
  const isCompleted = workout.status === 'completed';
  const isSkipped = workout.status === 'skipped';
  const isRest = workout.type === 'rest' || workout.type === 'yoga';

  const distLabel = workout.target.distanceMiMin
    ? workout.target.distanceMiMax && workout.target.distanceMiMax !== workout.target.distanceMiMin
      ? `${workout.target.distanceMiMin}–${workout.target.distanceMiMax}mi`
      : `${workout.target.distanceMiMin}mi`
    : '';

  const actualLabel = workout.actualDistanceMi
    ? `${workout.actualDistanceMi.toFixed(1)}mi actual`
    : '';

  const vertLabel = workout.target.elevationFt
    ? `${workout.target.elevationFt.toLocaleString()}ft`
    : '';

  function handleSwipe(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) < 60) {
      controls.start({ x: 0 });
      return;
    }
    if (info.offset.x > 60) {
      // Swipe right → mark complete
      setSwipeFlash('complete');
      controls.start({ x: 0 });
      setTimeout(() => {
        setSwipeFlash(null);
        updateWorkoutStatus(workout.id, isCompleted ? 'planned' : 'completed');
      }, 400);
    } else {
      // Swipe left → open adjustment panel
      setSwipeFlash('adjust');
      controls.start({ x: 0 });
      setTimeout(() => {
        setSwipeFlash(null);
        setShowAdjust(true);
      }, 200);
    }
  }

  if (isRest && !isToday) {
    return (
      <div className={`rounded-lg px-3 py-2 border ${cfg.border} ${cfg.bg} flex items-center gap-2`}>
        <span className={`text-xs ${cfg.text}`}>{cfg.label}</span>
        {workout.target.notes && (
          <span className="text-xs text-slate-500 ml-auto truncate max-w-[60%]">{workout.target.notes}</span>
        )}
      </div>
    );
  }

  return (
    <>
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 80 }}
        dragElastic={0.2}
        onDragEnd={handleSwipe}
        animate={controls}
        className="touch-pan-y"
      >
        <div
          className={`
            rounded-xl border transition-all
            ${cfg.border} ${cfg.bg}
            ${isToday ? 'ring-2 ring-orange-400/60' : ''}
            ${isCompleted ? 'opacity-70' : ''}
            ${isSkipped ? 'opacity-40 line-through' : ''}
            ${swipeFlash === 'complete' ? 'ring-2 ring-green-400' : ''}
            ${swipeFlash === 'adjust' ? 'ring-2 ring-blue-400' : ''}
          `}
        >
          {/* Main row */}
          <button
            className="w-full px-3 py-3 text-left"
            onClick={() => !isRest && setExpanded(e => !e)}
          >
            <div className="flex items-center gap-2">
              {/* Status indicator */}
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${isCompleted ? 'bg-green-500 border-green-500' : `border-current ${cfg.text}`}
              `}>
                {isCompleted && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* Type icon */}
              {TYPE_ICONS[workout.type] ? (
                <span className={`flex-shrink-0 ${cfg.text}`}>{TYPE_ICONS[workout.type]}</span>
              ) : null}

              {/* Label */}
              <span className={`text-sm font-semibold ${cfg.text} truncate`}>
                {cfg.label}
                {workout.isKeyWorkout && (
                  <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide opacity-70">KEY</span>
                )}
              </span>

              {/* Vert icon */}
              {workout.target.elevationFt ? (
                <VertIcon ft={workout.target.elevationFt} />
              ) : null}

              <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                {/* Distance */}
                {distLabel && (
                  <span className={`text-xs font-medium ${cfg.text} opacity-80`}>{distLabel}</span>
                )}
                {/* Expand toggle */}
                {!isRest && (
                  <span className={`${cfg.text} opacity-50`}>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                )}
              </div>
            </div>

            {/* Actual data row */}
            {workout.stravaActivityId && (
              <div className="mt-1.5 ml-7 flex items-center gap-2">
                <span className="text-[11px] text-green-400 font-medium">{actualLabel}</span>
                {workout.actualElevationFt ? (
                  <span className="text-[11px] text-green-400/70">· {workout.actualElevationFt.toLocaleString()}ft</span>
                ) : null}
                {workout.stravaName && (
                  <span className="text-[11px] text-slate-500 truncate">· {workout.stravaName}</span>
                )}
              </div>
            )}
          </button>

          {/* Expanded details */}
          {expanded && (
            <div className={`px-3 pb-3 border-t ${cfg.border} pt-2`}>
              <div className="space-y-1.5">
                {distLabel && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Target</span>
                    <span className={cfg.text}>{distLabel}</span>
                  </div>
                )}
                {vertLabel && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Vert target</span>
                    <span className={cfg.text}>{vertLabel}</span>
                  </div>
                )}
                {workout.target.pace && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Pace</span>
                    <span className={cfg.text}>{workout.target.pace} /mi</span>
                  </div>
                )}
                {workout.target.durationMin && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Duration</span>
                    <span className={cfg.text}>{workout.target.durationMin}min</span>
                  </div>
                )}
                {workout.target.notes && (
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{workout.target.notes}</p>
                )}

                {/* Strava actual data */}
                {workout.actualDistanceMi && (
                  <div className="mt-2 pt-2 border-t border-slate-700 space-y-1">
                    <div className="text-[11px] font-semibold text-green-400 uppercase tracking-wide">Strava Actual</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Distance</span>
                      <span className="text-green-400">{workout.actualDistanceMi.toFixed(2)}mi</span>
                    </div>
                    {workout.actualElevationFt ? (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Elevation</span>
                        <span className="text-green-400">{workout.actualElevationFt.toLocaleString()}ft</span>
                      </div>
                    ) : null}
                    {workout.actualDurationMin ? (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Moving time</span>
                        <span className="text-green-400">{Math.floor(workout.actualDurationMin / 60)}h {workout.actualDurationMin % 60}m</span>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Quick actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateWorkoutStatus(workout.id, isCompleted ? 'planned' : 'completed')}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isCompleted
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-green-600/80 text-white active:bg-green-700'
                    }`}
                  >
                    {isCompleted ? 'Mark Planned' : '✓ Complete'}
                  </button>
                  <button
                    onClick={() => setShowAdjust(true)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium bg-blue-600/50 text-blue-300 active:bg-blue-700/50"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {showAdjust && (
        <AdjustmentPanel workout={workout} onClose={() => setShowAdjust(false)} />
      )}
    </>
  );
}
