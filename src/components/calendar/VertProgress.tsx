import React from 'react';
import { Mountain } from 'lucide-react';

interface VertProgressProps {
  targetFt: number;
  actualFt: number;
}

export function VertProgress({ targetFt, actualFt }: VertProgressProps) {
  const ratio = targetFt > 0 ? Math.min(actualFt / targetFt, 1.2) : 0;
  const pct = Math.round(ratio * 100);
  const barPct = Math.min(ratio * 100, 100);
  const isOver = ratio > 1;

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Mountain className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-xs font-medium text-slate-400">Weekly Vert</span>
        </div>
        <div className="text-xs text-slate-400">
          <span className={isOver ? 'text-green-400' : 'text-white'}>
            {actualFt > 0 ? actualFt.toLocaleString() : '—'}
          </span>
          <span className="text-slate-600"> / </span>
          <span>{targetFt.toLocaleString()}ft</span>
          {actualFt > 0 && (
            <span className={`ml-1.5 font-medium ${isOver ? 'text-green-400' : pct >= 80 ? 'text-orange-400' : 'text-slate-500'}`}>
              ({pct}%)
            </span>
          )}
        </div>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver ? 'bg-green-500' : pct >= 80 ? 'bg-orange-400' : 'bg-orange-400/50'
          }`}
          style={{ width: `${barPct}%` }}
        />
      </div>
    </div>
  );
}
