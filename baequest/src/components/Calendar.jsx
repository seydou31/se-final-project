import { useState } from 'react';
import '../blocks/calendar.css';

export default function Calendar({ selectedDate, onDateSelect, events = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventsForDay = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onDateSelect(date);
  };

  const handleClearDate = () => {
    onDateSelect(null);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar__day calendar__day--empty"></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = getEventsForDay(day);
      const dayHasEvents = dayEvents.length > 0;
      const eventCount = dayEvents.length;

      const dayClasses = [
        'calendar__day',
        isToday(day) ? 'calendar__day--today' : '',
        isSelected(day) ? 'calendar__day--selected' : '',
        dayHasEvents ? 'calendar__day--has-events' : '',
      ].filter(Boolean).join(' ');

      days.push(
        <button
          key={day}
          type="button"
          className={dayClasses}
          onClick={() => handleDateClick(day)}
          title={dayHasEvents ? `${eventCount} event${eventCount > 1 ? 's' : ''}` : ''}
        >
          <span className="calendar__day-number">{day}</span>
          {dayHasEvents && (
            <span className="calendar__day-indicator">
              {eventCount}
            </span>
          )}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button type="button" className="calendar__nav" onClick={previousMonth}>
          ←
        </button>
        <span className="calendar__month">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button type="button" className="calendar__nav" onClick={nextMonth}>
          →
        </button>
      </div>

      <div className="calendar__weekdays">
        {dayNames.map((day) => (
          <div key={day} className="calendar__weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar__grid">
        {renderCalendarDays()}
      </div>

      {selectedDate && (
        <button type="button" className="calendar__clear" onClick={handleClearDate}>
          Clear Date
        </button>
      )}
    </div>
  );
}
