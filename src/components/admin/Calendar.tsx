import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  events: Array<{
    id: string | number;
    date: string;
    time?: string;
    title: string;
    subtitle?: string;
    status?: string;
  }>;
  onDateClick?: (date: string) => void;
  onEventClick?: (event: any) => void;
  selectedDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  events, 
  onDateClick, 
  onEventClick, 
  selectedDate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const { calendarDays, eventsMap } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    // Create events map
    const eventsMap: { [key: string]: typeof events } = {};
    events.forEach(event => {
      const dateKey = event.date;
      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }
      eventsMap[dateKey].push(event);
    });

    return { calendarDays: days, eventsMap };
  }, [currentDate, events]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, day).toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate === formatDateKey(day);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-24 border-r border-b border-gray-100"></div>;
          }

          const dateKey = formatDateKey(day);
          const dayEvents = eventsMap[dateKey] || [];
          const isCurrentDay = isToday(day);
          const isSelectedDay = isSelected(day);

          return (
            <div
              key={day}
              className={`h-24 border-r border-b border-gray-100 p-1 cursor-pointer hover:bg-gray-50 ${
                isSelectedDay ? 'bg-blue-50' : ''
              }`}
              onClick={() => onDateClick?.(dateKey)}
            >
              <div className="h-full flex flex-col">
                <span
                  className={`text-sm font-medium mb-1 ${
                    isCurrentDay
                      ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                      : 'text-gray-900'
                  }`}
                >
                  {day}
                </span>
                <div className="flex-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 mb-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200 truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                    >
                      {event.time && (
                        <div className="font-medium">{event.time}</div>
                      )}
                      <div className="truncate">{event.title}</div>
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
