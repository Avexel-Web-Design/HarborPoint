import { useState, useEffect, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import Calendar from '../../components/admin/Calendar';
import CreateModal from '../../components/admin/CreateModal';
import EditModal from '../../components/admin/EditModal';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface Event {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  max_capacity?: number;
  price: number;
  status: string;
  registered_count: number;
  created_at: string;
}

const AdminEventsPage = () => {
  const { } = useAdminAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        setMessage('Failed to load events');
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setMessage('Error loading events');
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage('Event created successfully!');
        fetchEvents();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Error creating event');
      throw error;
    }
  };  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage('Event updated successfully!');
        fetchEvents();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setMessage('Error updating event');
      throw error;
    }
  };

  const handleDelete = async (eventId: number) => {
    try {
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Event deleted successfully!');
        fetchEvents();
        setShowEditModal(false);
        setSelectedEvent(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setMessage('Error deleting event');
      throw error;
    }
  };
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleDateDoubleClick = (date: string) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowCreateModal(true);
  };
  const handleEventDrop = async (event: any, newDate: string) => {
    const fullEvent = events.find(e => e.id.toString() === event.id.toString());
    if (!fullEvent) return;

    const updatedEvent = { ...fullEvent, date: newDate };
    await handleUpdate(updatedEvent);
  };

  const handleEventClick = (event: any) => {
    const fullEvent = events.find(e => e.id === event.id);
    if (fullEvent) {
      setSelectedEvent(fullEvent);
      setShowEditModal(true);
    }
  };
  const calendarEvents = useMemo(() => events.map(event => ({
    id: event.id,
    date: event.date,
    time: event.time,
    title: event.title,
    subtitle: `${event.registered_count}/${event.max_capacity || '∞'} registered`,
    type: 'event' as const
  })), [events]);

  const selectedDateEvents = events.filter(e => e.date === selectedDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Events Management
              </h1>
              <p className="text-gray-600">
                Manage and overview club events
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total events: {events.length}
              </div>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedDate('');
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              events={calendarEvents}
              onDateClick={handleDateClick}
              onDateDoubleClick={handleDateDoubleClick}
              onEventClick={handleEventClick}
              onEventDrop={handleEventDrop}
              selectedDate={selectedDate}
              enableDragDrop={true}
            />
          </div>          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructions */}
            {!selectedDate && (
              <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Actions</h3>                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Double-click any date to create an event</p>
                  <p>• Click an event to edit details</p>
                  <p>• Use the trash icon to delete events</p>
                  <p>• Drag events to reschedule them</p>
                </div>
              </div>
            )}

            {/* Selected Date Details */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">                    {selectedDateEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => handleEventClick(event)}
                          >
                            <div className="font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {event.time} • {event.location}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.registered_count}/{event.max_capacity || '∞'} registered
                            </div>
                            {event.price > 0 && (
                              <div className="text-sm text-green-600 font-medium">
                                ${event.price}
                              </div>
                            )}
                          </div>                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              handleDelete(event.id);
                            }}
                            className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    <p>No events scheduled for this date.</p>
                    <p className="mt-2 text-xs">Double-click on a calendar date to create an event.</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-medium">{events.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium">
                    {events.filter(e => {
                      const eventDate = new Date(e.date);
                      const today = new Date();
                      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return eventDate >= weekStart && eventDate <= weekEnd;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium">
                    {events.filter(e => {
                      const eventDate = new Date(e.date);
                      const today = new Date();
                      return (
                        eventDate.getMonth() === today.getMonth() &&
                        eventDate.getFullYear() === today.getFullYear()
                      );
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Registrations</span>
                  <span className="font-medium">
                    {events.reduce((sum, e) => sum + e.registered_count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          type="event"
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          selectedDate={selectedDate}
        />
      )}      {/* Edit Modal */}
      {showEditModal && selectedEvent && (
        <EditModal
          type="event"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          item={selectedEvent}
        />
      )}
    </div>
  );
};

export default AdminEventsPage;
