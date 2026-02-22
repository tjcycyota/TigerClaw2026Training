import React from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Mountain, RefreshCw } from 'lucide-react';
import { RACE_DATE } from '../../data/trainingPlan';
import { useCalendarStore } from '../../store/calendarStore';
import { useStrava } from '../../hooks/useStrava';

export function Header() {
  const { activeWeekNumber, weeks } = useCalendarStore();
  const { isSyncing, isConnected, sync } = useStrava();

  const daysToRace = differenceInDays(parseISO(RACE_DATE), new Date());
  const activeWeek = weeks.find(w => w.weekNumber === activeWeekNumber);

  const phaseLabel: Record<string, string> = {
    build: 'Build',
    recovery: 'Recovery',
    simulation: 'Simulation',
    stimulus: 'Stimulus',
    taper: 'Taper',
    race: 'Race',
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <Mountain className="w-5 h-5 text-orange-400" />
          <div>
            <div className="text-sm font-bold text-white leading-tight">Tiger Claw 50K</div>
            <div className="text-xs text-slate-400">
              {daysToRace > 0 ? `${daysToRace} days` : 'Race day!'} ·{' '}
              Week {activeWeekNumber}
              {activeWeek ? ` · ${phaseLabel[activeWeek.phase] ?? activeWeek.phase}` : ''}
            </div>
          </div>
        </div>

        {isConnected && (
          <button
            onClick={sync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-xs font-medium active:scale-95 transition-transform disabled:opacity-50"
            aria-label="Sync with Strava"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing…' : 'Strava'}
          </button>
        )}
      </div>
    </header>
  );
}
