import React from 'react';
import { Calendar, BarChart2, Settings } from 'lucide-react';
import { useCalendarStore } from '../../store/calendarStore';

export function BottomNav() {
  const { activeView, setActiveView } = useCalendarStore();

  const tabs = [
    { id: 'week' as const, label: 'Calendar', Icon: Calendar },
    { id: 'month' as const, label: 'Overview', Icon: BarChart2 },
    { id: 'settings' as const, label: 'Settings', Icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-700">
      <div className="flex max-w-lg mx-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors min-h-[56px] ${
              activeView === id
                ? 'text-orange-400'
                : 'text-slate-500 active:text-slate-300'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
