import React, { useState, useEffect } from 'react';
import Calendar from '../../components/admin/Calendar';
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
}

interface TeeTimeForm {
  id?: number;
  date: string;
  time: string;
  guests: number;
  notes: string;
}

const AdminTeeTimesPage = () => {
  const { } = useAdminAuth();
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTeeTime, setSelectedTeeTime] = useState<TeeTime | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState('');
  const [teeTimeForm, setTeeTimeForm] = useState<TeeTimeForm>({
    date: '',
    time: '',
    guests: 1,
    notes: ''
  });

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

  const handleTeeTimeClick = (teeTime: any) => {
    const fullTeeTime = teeTimes.find(tt => tt.id === teeTime.id);
    if (fullTeeTime) {
      setSelectedTeeTime(fullTeeTime);
      setTeeTimeForm({
        id: fullTeeTime.id,
        date: fullTeeTime.date,
        time: fullTeeTime.time,
        guests: fullTeeTime.guests,
        notes: fullTeeTime.notes || ''
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateTeeTime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/tee-times', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(teeTimeForm)
      });

      if (response.ok) {
        setMessage('Tee time updated successfully!');
        setShowEditModal(false);
        setSelectedTeeTime(null);
        loadTeeTimes();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to update tee time');
      }
    } catch (error) {
      console.error('Error updating tee time:', error);
      setMessage('Error updating tee time');
    }
  };

  const handleDeleteTeeTime = async (teeTimeId: number) => {
    if (!confirm('Are you sure you want to cancel this tee time?')) return;

    try {
      const response = await fetch(`/api/admin/tee-times?id=${teeTimeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Tee time cancelled successfully!');
        setShowEditModal(false);
        setSelectedTeeTime(null);
        loadTeeTimes();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to cancel tee time');
      }
    } catch (error) {
      console.error('Error cancelling tee time:', error);
      setMessage('Error cancelling tee time');
    }
  };

  const calendarEvents = teeTimes.map(teeTime => ({
    id: teeTime.id,
    date: teeTime.date,
    time: teeTime.time,
    title: `${teeTime.first_name} ${teeTime.last_name}`,
    subtitle: `${teeTime.guests} guests`
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
            <div className="text-sm text-gray-500">
              Total reservations: {teeTimes.length}
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
              selectedDate={selectedDate}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                  <p className="text-gray-500 text-sm">No tee times scheduled for this date.</p>
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

      {/* Edit Modal */}
      {showEditModal && selectedTeeTime && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Tee Time
              </h3>
              
              <form onSubmit={handleUpdateTeeTime} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member
                  </label>
                  <div className="text-sm text-gray-600">
                    {selectedTeeTime.first_name} {selectedTeeTime.last_name} (#{selectedTeeTime.member_id_display})
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={teeTimeForm.date}
                    onChange={(e) => setTeeTimeForm({...teeTimeForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={teeTimeForm.time}
                    onChange={(e) => setTeeTimeForm({...teeTimeForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={teeTimeForm.guests}
                    onChange={(e) => setTeeTimeForm({...teeTimeForm, guests: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={teeTimeForm.notes}
                    onChange={(e) => setTeeTimeForm({...teeTimeForm, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTeeTime(selectedTeeTime.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeeTimesPage;
