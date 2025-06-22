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

type CalendarView = 'month' | 'week' | 'day';

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
  const [view, setView] = useState<CalendarView>('month');
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  const { calendarDays, eventsMap, weekDays } = useMemo(() => {
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

    // Calculate week view days
    const weekDays = [];
    if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        weekDays.push(day);
      }    }

    return { calendarDays: days, eventsMap, weekDays };
  }, [currentDate, events, view]);const navigateMonth = (direction: 'prev' | 'next') => {
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

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      const days = direction === 'prev' ? -7 : 7;
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      const days = direction === 'prev' ? -1 : 1;
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const navigate = (direction: 'prev' | 'next') => {
    switch (view) {
      case 'day':
        navigateDay(direction);
        break;
      case 'week':
        navigateWeek(direction);
        break;
      case 'month':
      default:
        navigateMonth(direction);
        break;
    }
  };

  const getHeaderText = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    switch (view) {
      case 'day':
        return `${monthNames[month]} ${day}, ${year}`;
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
          return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${year}`;
        } else {
          return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${year}`;
        }
      case 'month':
      default:
        return `${monthNames[month]} ${year}`;
    }
  };  const formatDateKey = (day: number | Date) => {
    if (day instanceof Date) {
      const year = day.getFullYear();
      const month = day.getMonth();
      const date = day.getDate();
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = date.toString().padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      // Format date directly without timezone conversion
      const monthStr = (month + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    }
  };
  const isToday = (day: number | Date) => {
    const today = new Date();
    
    if (day instanceof Date) {
      return (
        today.getFullYear() === day.getFullYear() &&
        today.getMonth() === day.getMonth() &&
        today.getDate() === day.getDate()
      );
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      return (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
      );
    }
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

  const renderMonthView = () => (
    <>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
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
    </>
  );

  const renderWeekView = () => (
    <>
      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day, index) => (
          <div key={index} className="p-3 text-center">
            <div className="text-sm font-medium text-gray-500">
              {daysOfWeek[day.getDay()]}
            </div>            <div className={`text-lg font-semibold mt-1 ${
              isToday(day)
                ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                : 'text-gray-900'
            }`}>
              {day.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7">
        {weekDays.map((day, index) => {
          const dateKey = formatDateKey(day);
          const dayEvents = eventsMap[dateKey] || [];
          const isDragOver = dragOverDate === dateKey;

          return (
            <div
              key={index}
              className={`min-h-32 border-r border-b border-gray-100 p-2 cursor-pointer hover:bg-gray-50 ${
                isDragOver ? 'bg-yellow-50 border-yellow-300' : ''
              }`}
              onClick={() => onDateClick?.(dateKey)}
              onDoubleClick={() => handleDateDoubleClick?.(dateKey)}
              onDragOver={(e) => handleDateDragOver(e, dateKey)}
              onDragLeave={handleDateDragLeave}
              onDrop={(e) => handleDateDrop(e, dateKey)}
            >
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-2 rounded cursor-pointer truncate ${
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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  const renderDayView = () => {
    const dateKey = formatDateKey(currentDate);
    const events = eventsMap[dateKey] || [];
    const sortedEvents = [...events].sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

    return (
      <div className="p-4">
        <div className="space-y-2">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-lg">No events scheduled</div>
              <div className="text-sm mt-1">Double-click to add an event</div>
            </div>
          ) : (
            sortedEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg cursor-pointer border-l-4 ${
                  event.type === 'tee-time' ? 'bg-green-50 border-green-400 hover:bg-green-100' :
                  event.type === 'event' ? 'bg-purple-50 border-purple-400 hover:bg-purple-100' :
                  event.type === 'reservation' ? 'bg-blue-50 border-blue-400 hover:bg-blue-100' :
                  'bg-blue-50 border-blue-400 hover:bg-blue-100'
                }`}
                draggable={enableDragDrop}
                onDragStart={(e) => handleEventDragStart(e, event)}
                onDragEnd={handleEventDragEnd}
                onClick={() => onEventClick?.(event)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    {event.time && (
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        {event.time}
                      </div>
                    )}
                    <div className="font-semibold text-gray-900">{event.title}</div>
                    {event.subtitle && (
                      <div className="text-sm text-gray-600 mt-1">{event.subtitle}</div>
                    )}
                  </div>
                  {event.status && (
                    <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                      {event.status}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Click to add event area */}
        <div
          className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50"
          onDoubleClick={() => handleDateDoubleClick?.(dateKey)}
        >
          <div className="text-gray-500">Double-click to add an event</div>
        </div>
      </div>
    );
  };
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {getHeaderText()}
        </h2>
        <div className="flex items-center space-x-4">
          {/* View Switcher */}
          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm font-medium rounded-l-md ${
                view === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 text-sm font-medium border-l border-gray-300 ${
                view === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1 text-sm font-medium border-l border-gray-300 rounded-r-md ${
                view === 'day'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Day
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-2">
            <button
              onClick={() => navigate('prev')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Render different views */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default Calendar;
