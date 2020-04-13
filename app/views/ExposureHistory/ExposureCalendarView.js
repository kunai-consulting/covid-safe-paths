import React from 'react';
import { DayOfWeek, CalendarDay } from './CalendarDay';
import { MonthGrid } from './MonthGrid';

/**
 * Get a date key that does not include time.
 *
 * @param {import('dayjs').Dayjs} date
 */
function getDayKey(date) {
  return date.startOf('day').unix();
}

/**
 * Calendar view of recent exposures.
 *
 * @param {{
 *   history: !import('../../constants/history').HistoryDay[],
 *   weeks?: number,
 * }} param0
 */
export const ExposureCalendarView = ({ history, weeks }) => {
  /** @type {{[date: string]: number}} */
  const exposureMap = {};
  history.forEach(day => {
    exposureMap[getDayKey(day.date)] = day.exposureMinutes;
  });

  return (
    <MonthGrid
      weeks={weeks}
      renderDayHeader={d => <DayOfWeek key={d}>{d}</DayOfWeek>}
      renderDay={date => {
        const exposureMinutes = exposureMap[getDayKey(date)];
        return (
          <CalendarDay
            showToday
            date={date}
            exposureMinutes={exposureMinutes}
          />
        );
      }}
    />
  );
};