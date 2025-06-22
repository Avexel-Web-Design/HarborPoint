import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string | number;
  date: string;
  time?: string;
  title: string;
  subtitle?: string;
  status?: string;
  type?: 'tee-time' | 'event' | 'reservation';
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateClick?: (date: string) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onDateDoubleClick?: (date: string) => void;
  onEventDrop?: (event: CalendarEvent, newDate: string) => void;
  selectedDate?: string;
  enableDragDrop?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ 
  events, 
  onDateClick, 
  onEventClick, 
  onDateDoubleClick,
  onEventDrop,
  selectedDate,
  enableDragDrop = false
}) => {
  // Initialize with first day of current month to avoid day-specific issues
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  const { calendarDays, eventsMap } = useMemo(() => {
    // Always use a fresh date calculation to avoid mutation issues
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Create date object for first day of month - ensure it's always day 1
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
    setCurrentDate(prevDate => {
      const year = prevDate.getFullYear();
      const month = prevDate.getMonth();
      
      if (direction === 'prev') {
        // Go to previous month
        if (month === 0) {
          return new Date(year - 1, 11, 1); // December of previous year
        } else {
          return new Date(year, month - 1, 1);
        }
      } else {
        // Go to next month
        if (month === 11) {
          return new Date(year + 1, 0, 1); // January of next year
        } else {
          return new Date(year, month + 1, 1);
        }
      }
    });
  };
  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // Format date directly without timezone conversion
    const monthStr = (month + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
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

  const handleEventDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    if (!enableDragDrop) return;
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleEventDragEnd = () => {
    setDraggedEvent(null);
    setDragOverDate(null);
  };

  const handleDateDragOver = (e: React.DragEvent, dateKey: string) => {
    if (!draggedEvent || !enableDragDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(dateKey);
  };

  const handleDateDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDateDrop = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    if (!draggedEvent || !enableDragDrop || !onEventDrop) return;
    
    if (dateKey !== draggedEvent.date) {
      onEventDrop(draggedEvent, dateKey);
    }
    
    setDraggedEvent(null);
    setDragOverDate(null);
  };

  const handleDateDoubleClick = (dateKey: string) => {
    if (onDateDoubleClick) {
      onDateDoubleClick(dateKey);
    }
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
      </div>      {/* Calendar Grid */}
      <div className="grid grid-cols-7" key={`${currentDate.getFullYear()}-${currentDate.getMonth()}`}>
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-24 border-r border-b border-gray-100"></div>;
          }

          const dateKey = formatDateKey(day);
          const dayEvents = eventsMap[dateKey] || [];
          const isCurrentDay = isToday(day);
          const isSelectedDay = isSelected(day);
          const isDragOver = dragOverDate === dateKey;

          return (
            <div
              key={day}
              className={`h-24 border-r border-b border-gray-100 p-1 cursor-pointer hover:bg-gray-50 ${
                isSelectedDay ? 'bg-blue-50' : ''
              } ${isDragOver ? 'bg-yellow-50 border-yellow-300' : ''}`}
              onClick={() => onDateClick?.(dateKey)}
              onDoubleClick={() => handleDateDoubleClick?.(dateKey)}
              onDragOver={(e) => handleDateDragOver(e, dateKey)}
              onDragLeave={handleDateDragLeave}
              onDrop={(e) => handleDateDrop(e, dateKey)}
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
                      className={`text-xs p-1 mb-1 rounded cursor-pointer truncate ${
                        event.type === 'tee-time' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        event.type === 'event' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                        event.type === 'reservation' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                        'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                      draggable={enableDragDrop}
                      onDragStart={(e) => handleEventDragStart(e, event)}
                      onDragEnd={handleEventDragEnd}
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
