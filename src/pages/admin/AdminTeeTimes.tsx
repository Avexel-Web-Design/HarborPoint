import { useState, useEffect } from 'react';
import Calendar from '../../components/admin/Calendar';
import CreateModal from '../../components/admin/CreateModal';
import EditModal from '../../components/admin/EditModal';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface TeeTime {
  id: number;
  member_id: number;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  member_id_display: string;
  created_at: string;
  players?: number;
  course_name?: string;
}

const AdminTeeTimesPage = () => {
  useAdminAuth();
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTeeTime, setSelectedTeeTime] = useState<TeeTime | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTeeTimes();
  }, []);

  const loadTeeTimes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tee-times', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setTeeTimes(data.teeTimes || []);
      } else {
        setMessage('Failed to load tee times');
      }
    } catch (error) {
      console.error('Error loading tee times:', error);
      setMessage('Error loading tee times');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleDateDoubleClick = (date: string) => {
    setSelectedDate(date);
    setShowCreateModal(true);
  };

  const handleTeeTimeClick = (event: any) => {
    const fullTeeTime = teeTimes.find(tt => tt.id === event.id);
    if (fullTeeTime) {
      setSelectedTeeTime(fullTeeTime);
      setShowEditModal(true);
    }
  };

  const handleEventDrop = async (event: any, newDate: string) => {
    try {
      const fullTeeTime = teeTimes.find(tt => tt.id.toString() === event.id.toString());
      if (!fullTeeTime) return;

      const updatedData = {
        id: event.id,
        date: newDate,
        time: event.time,
        courseId: fullTeeTime.course_name,
        memberIds: [fullTeeTime.member_id],
        notes: fullTeeTime.notes
      };
      
      await handleUpdateTeeTime(updatedData);
    } catch (error) {
      console.error('Error moving tee time:', error);
      setMessage('Failed to move tee time');
    }
  };

  const handleCreateTeeTime = async (data: any) => {
    try {
      console.log('Creating tee time with data:', data);
      const response = await fetch('/api/admin/tee-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      console.log('Create tee time response status:', response.status);
      if (response.ok) {
        setMessage('Tee time created successfully!');
        loadTeeTimes();
      } else {
        const errorData = await response.json();
        console.error('Create tee time error:', errorData);
        throw new Error(errorData.error || 'Failed to create tee time');
      }
    } catch (error) {
      console.error('Error creating tee time:', error);
      setMessage('Error creating tee time');
      throw error;
    }
  };

  const handleUpdateTeeTime = async (data: any) => {
    try {
      const response = await fetch('/api/admin/tee-times', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage('Tee time updated successfully!');
        setShowEditModal(false);
        setSelectedTeeTime(null);
        loadTeeTimes();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tee time');
      }
    } catch (error) {
      console.error('Error updating tee time:', error);
      setMessage('Error updating tee time');
      throw error;
    }
  };

  const calendarEvents = teeTimes.map(teeTime => ({
    id: teeTime.id,
    date: teeTime.date,
    time: teeTime.time,
    title: `${teeTime.first_name} ${teeTime.last_name}`,
    subtitle: `${teeTime.players || 1} player${(teeTime.players || 1) !== 1 ? 's' : ''}`,
    type: 'tee-time' as const,
    member_id: teeTime.member_id,
    course_name: teeTime.course_name,
    notes: teeTime.notes
  }));

  const selectedDateTeeTimes = teeTimes.filter(tt => tt.date === selectedDate);

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
                Tee Times Management
              </h1>
              <p className="text-gray-600">
                Manage and overview tee time reservations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total reservations: {teeTimes.length}
              </div>
              <button
                onClick={() => {
                  setSelectedTeeTime(null);
                  setSelectedDate('');
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Tee Time
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
              onEventClick={handleTeeTimeClick}
              onDateDoubleClick={handleDateDoubleClick}
              onEventDrop={handleEventDrop}
              selectedDate={selectedDate}
              enableDragDrop={true}
            />
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructions */}
            {!selectedDate && (
              <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Actions</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Double-click any date to create a tee time</p>
                  <p>• Click a tee time to view details</p>
                  <p>• Drag tee times to reschedule them</p>
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
                
                {selectedDateTeeTimes.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateTeeTimes.map(teeTime => (
                      <div
                        key={teeTime.id}
                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTeeTimeClick(teeTime)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">
                              {teeTime.time}
                            </div>
                            <div className="text-sm text-gray-600">
                              {teeTime.first_name} {teeTime.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {teeTime.guests} guests
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            #{teeTime.member_id_display}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    <p>No tee times scheduled for this date.</p>
                    <p className="mt-2 text-xs">Double-click on a calendar date to create a tee time.</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reservations</span>
                  <span className="font-medium">{teeTimes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium">
                    {teeTimes.filter(tt => {
                      const teeTimeDate = new Date(tt.date);
                      const today = new Date();
                      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return teeTimeDate >= weekStart && teeTimeDate <= weekEnd;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium">
                    {teeTimes.filter(tt => {
                      const teeTimeDate = new Date(tt.date);
                      const today = new Date();
                      return (
                        teeTimeDate.getMonth() === today.getMonth() &&
                        teeTimeDate.getFullYear() === today.getFullYear()
                      );
                    }).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Create Modal */}
      <CreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        type="tee-time"
        selectedDate={selectedDate}
        onCreate={handleCreateTeeTime}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        type="tee-time"
        item={selectedTeeTime}
        onUpdate={handleUpdateTeeTime}
      />
    </div>
  );
};

export default AdminTeeTimesPage;
