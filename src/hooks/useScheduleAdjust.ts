import { useCalendarStore } from '../store/calendarStore';
import { handleTravelDays, handleSickWeek } from '../lib/scheduleEngine';

export function useScheduleAdjust() {
  const { weeks, setWeeks } = useCalendarStore();

  function applyTravelDays(dates: string[]) {
    const updated = handleTravelDays(dates, weeks);
    setWeeks(updated);
  }

  function applySickWeek(weekNumber: number) {
    const updated = handleSickWeek(weekNumber, weeks);
    setWeeks(updated);
  }

  return { applyTravelDays, applySickWeek };
}
