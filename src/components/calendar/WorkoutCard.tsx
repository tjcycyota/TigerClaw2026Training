import React, { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Mountain, Dumbbell, Bike, Leaf, Minus, ExternalLink, Clock } from 'lucide-react';
import { PlannedWorkout, WorkoutType } from '../../types';
import { useCalendarStore } from '../../store/calendarStore';
import { AdjustmentPanel } from '../workout/AdjustmentPanel';

const TYPE_CONFIG: Record<WorkoutType, { bg: string; text: string; border: string; label: string }> = {
  easy_run:         { bg: 'bg-slate-700/60',   text: 'text-slate-300',  border: 'border-slate-600', label: 'Easy Run' },
  long_run:         { bg: 'bg-indigo-900/50',  text: 'text-indigo-300', border: 'border-indigo-700', label: 'Long Run' },
  hill_repeats:     { bg: 'bg-orange-900/50',  text: 'text-orange-300', border: 'border-orange-700', label: 'Hills' },
  threshold:        { bg: 'bg-red-900/50',     text: 'text-red-300',    border: 'border-red-700',    label: 'Quality' },
  uphill_treadmill: { bg: 'bg-amber-900/50',   text: 'text-amber-300',  border: 'border-amber-700',  label: 'Uphill TM' },
  strength:         { bg: 'bg-purple-900/50',  text: 'text-purple-300', border: 'border-purple-700', label: 'Strength' },
  xtrain:           { bg: 'bg-teal-900/50',    text: 'text-teal-300',   border: 'border-teal-700',   label: 'X-Train' },
  yoga:             { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-800', label: 'Yoga' },
  rest:             { bg: 'bg-slate-800/40',   text: 'text-slate-500',  border: 'border-slate-700/50', label: 'Rest' },
};

const TYPE_ICONS: Partial<Record<WorkoutType, React.ReactNode>> = {
  strength: <Dumbbell className="w-3.5 h-3.5" />,
  xtrain:   <Bike className="w-3.5 h-3.5" />,
  yoga:     <Leaf className="w-3.5 h-3.5" />,
  rest:     <Minus className="w-3.5 h-3.5" />,
};

function VertBadge({ ft }: { ft: number }) {
  if (ft >= 3000) return <span className="text-orange-400 text-xs" title={`${ft.toLocaleString()}ft vert`}>⛰⛰</span>;
  if (ft >= 1500) return <span className="text-orange-400/70 text-xs" title={`${ft.toLocaleString()}ft vert`}>⛰</span>;
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
  const isRest = workout.type === 'rest';
  const isNonExpandable = isRest;

  const distLabel = workout.target.distanceMiMin
    ? workout.target.distanceMiMax && workout.target.distanceMiMax !== workout.target.distanceMiMin
      ? `${workout.target.distanceMiMin}–${workout.target.distanceMiMax}mi`
      : `${workout.target.distanceMiMin}mi`
    : workout.target.durationMin
      ? `${workout.target.durationMin}min`
      : '';

  function handleSwipe(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) < 60) { controls.start({ x: 0 }); return; }
    if (info.offset.x > 60) {
      setSwipeFlash('complete');
      controls.start({ x: 0 });
      setTimeout(() => { setSwipeFlash(null); updateWorkoutStatus(workout.id, isCompleted ? 'planned' : 'completed'); }, 400);
    } else {
      setSwipeFlash('adjust');
      controls.start({ x: 0 });
      setTimeout(() => { setSwipeFlash(null); setShowAdjust(true); }, 200);
    }
  }

  return (
    <>
      <motion.div drag="x" dragConstraints={{ left: -80, right: 80 }} dragElastic={0.2} onDragEnd={handleSwipe} animate={controls} className="touch-pan-y">
        <div className={`
          rounded-xl border transition-all
          ${cfg.border} ${cfg.bg}
          ${isToday ? 'ring-2 ring-orange-400/50' : ''}
          ${isCompleted ? 'opacity-60' : ''}
          ${isSkipped ? 'opacity-35' : ''}
          ${swipeFlash === 'complete' ? 'ring-2 ring-green-400' : ''}
          ${swipeFlash === 'adjust' ? 'ring-2 ring-blue-400' : ''}
        `}>
          {/* Main row */}
          <button className="w-full px-3 py-2.5 text-left" onClick={() => !isNonExpandable && setExpanded(e => !e)}>
            <div className="flex items-center gap-2">
              {/* AM/PM badge */}
              {workout.timeOfDay && (
                <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${workout.timeOfDay === 'AM' ? 'bg-blue-500/30 text-blue-300' : 'bg-purple-500/30 text-purple-300'}`}>
                  {workout.timeOfDay}
                </span>
              )}

              {/* Status circle */}
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500 border-green-500' : `border-current ${cfg.text}`}`}>
                {isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
              </div>

              {/* Icon */}
              {TYPE_ICONS[workout.type] && <span className={`flex-shrink-0 ${cfg.text}`}>{TYPE_ICONS[workout.type]}</span>}

              {/* Label */}
              <span className={`text-sm font-semibold ${cfg.text} truncate flex-1`}>
                {cfg.label}
                {workout.isKeyWorkout && <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wide opacity-60">KEY</span>}
                {workout.isMovedFromDate && <span className="ml-1.5 text-[9px] text-blue-400 opacity-80">moved</span>}
              </span>

              {/* Vert + distance */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {workout.target.elevationFt ? <VertBadge ft={workout.target.elevationFt} /> : null}
                {distLabel && <span className={`text-xs ${cfg.text} opacity-80`}>{distLabel}</span>}
                {!isNonExpandable && <span className={`${cfg.text} opacity-40`}>{expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</span>}
              </div>
            </div>

            {/* Strava actual inline */}
            {workout.stravaActivityId && (
              <div className="mt-1 ml-6 flex items-center gap-2 flex-wrap">
                {workout.actualDistanceMi && <span className="text-[11px] text-green-400 font-medium">{workout.actualDistanceMi.toFixed(1)}mi actual</span>}
                {workout.actualElevationFt ? <span className="text-[11px] text-green-400/70">· {workout.actualElevationFt.toLocaleString()}ft</span> : null}
                {workout.stravaName && <span className="text-[11px] text-slate-500 truncate">· {workout.stravaName}</span>}
              </div>
            )}

            {/* Rest day notes inline */}
            {isRest && workout.target.notes && (
              <p className="mt-1 ml-6 text-[11px] text-slate-500 leading-relaxed">{workout.target.notes}</p>
            )}
          </button>

          {/* Expanded */}
          {expanded && !isNonExpandable && (
            <div className={`px-3 pb-3 border-t ${cfg.border} pt-3 space-y-3`}>
              {/* Stats row */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {distLabel && (
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Target</span><span className={cfg.text}>{distLabel}</span></div>
                )}
                {workout.target.elevationFt && (
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Vert</span><span className={cfg.text}>{workout.target.elevationFt.toLocaleString()}ft</span></div>
                )}
                {workout.target.pace && (
                  <div className="flex justify-between text-xs"><span className="text-slate-500">Pace</span><span className={cfg.text}>{workout.target.pace}/mi</span></div>
                )}
              </div>

              {/* Full coaching notes */}
              {workout.target.notes && (
                <div>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{workout.target.notes}</p>
                </div>
              )}

              {/* Links */}
              {workout.target.links && workout.target.links.length > 0 && (
                <div className="space-y-1.5">
                  {workout.target.links.map((link, i) => (
                    <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Strava actuals block */}
              {workout.actualDistanceMi && (
                <div className="pt-2 border-t border-slate-700/50 space-y-1">
                  <div className="text-[10px] font-bold text-green-400 uppercase tracking-wide">Strava Actual</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div className="flex justify-between text-xs"><span className="text-slate-500">Distance</span><span className="text-green-400">{workout.actualDistanceMi.toFixed(2)}mi</span></div>
                    {workout.actualElevationFt ? <div className="flex justify-between text-xs"><span className="text-slate-500">Elevation</span><span className="text-green-400">{workout.actualElevationFt.toLocaleString()}ft</span></div> : null}
                    {workout.actualDurationMin ? <div className="flex justify-between text-xs"><span className="text-slate-500">Time</span><span className="text-green-400">{Math.floor(workout.actualDurationMin / 60)}h {workout.actualDurationMin % 60}m</span></div> : null}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex gap-2 pt-1">
                <button onClick={() => updateWorkoutStatus(workout.id, isCompleted ? 'planned' : 'completed')}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${isCompleted ? 'bg-slate-700 text-slate-300' : 'bg-green-600/80 text-white'}`}>
                  {isCompleted ? 'Mark Planned' : '✓ Complete'}
                </button>
                <button onClick={() => setShowAdjust(true)}
                  className="flex-1 py-2 rounded-lg text-xs font-medium bg-blue-600/40 text-blue-300">
                  Move / Reschedule
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {showAdjust && <AdjustmentPanel workout={workout} onClose={() => setShowAdjust(false)} />}
    </>
  );
}
