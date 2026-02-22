import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrainingWeek } from '../../types';

interface ActualVsPlannedProps {
  week: TrainingWeek;
}

export function ActualVsPlanned({ week }: ActualVsPlannedProps) {
  if (week.actualVolumeMi === undefined || week.actualVolumeMi === 0) return null;

  const actualMi = week.actualVolumeMi;
  const plannedMi = week.targetVolumeMi;
  const ratio = actualMi / plannedMi;
  const diff = actualMi - plannedMi;
  const isOver = ratio > 1.05;
  const isUnder = ratio < 0.85;

  const Icon = isOver ? TrendingUp : isUnder ? TrendingDown : Minus;
  const color = isOver ? 'text-green-400' : isUnder ? 'text-yellow-400' : 'text-slate-400';
  const bg = isOver ? 'bg-green-900/20' : isUnder ? 'bg-yellow-900/20' : 'bg-slate-800';

  return (
    <div className={`mx-4 rounded-lg px-3 py-2 ${bg} flex items-center gap-3`}>
      <Icon className={`w-4 h-4 ${color} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className={`text-sm font-semibold ${color}`}>
            {actualMi.toFixed(1)}mi
          </span>
          <span className="text-xs text-slate-500">actual vs {plannedMi}mi planned</span>
          <span className={`text-xs font-medium ${color}`}>
            ({diff >= 0 ? '+' : ''}{diff.toFixed(1)}mi · {Math.round(ratio * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
