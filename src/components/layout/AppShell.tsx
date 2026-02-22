import React, { useEffect } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { WeekView } from '../calendar/WeekView';
import { MonthView } from '../calendar/MonthView';
import { SettingsView } from '../strava/SettingsView';
import { useCalendarStore } from '../../store/calendarStore';

export function AppShell() {
  const { activeView, darkMode } = useCalendarStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="pb-24 max-w-lg mx-auto">
        {activeView === 'week' && <WeekView />}
        {activeView === 'month' && <MonthView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
      <BottomNav />
    </div>
  );
}
