import { useState, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import CreateModal from '../../components/admin/CreateModal';
import EditModal from '../../components/admin/EditModal';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface TeeTime {
  id: number;
  member_id: number;
  date: string;
  time: string;
  players: number;
  notes?: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  member_id_display: string;
  created_at: string;
  course_name?: string;
  player_names?: string;
  allow_additional_players?: boolean;
}

type CourseType = 'birches' | 'woods' | 'farms';

const courseNames = {
  birches: 'The Birches',
  woods: 'The Woods', 
  farms: 'The Farms'
};

const AdminTeeTimesPage = () => {
  useAdminAuth();  const [teeTimes, setTeeTimes] = useState<TeeTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTeeTime, setSelectedTeeTime] = useState<TeeTime | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [message, setMessage] = useState('');
  const [activeCourse, setActiveCourse] = useState<CourseType>('birches');

  useEffect(() => {
    loadTeeTimes();
  }, [selectedDate]);

  // Reset state when course changes
  useEffect(() => {
    setMessage('');
  }, [activeCourse]);

  const loadTeeTimes = async () => {
    try {
      setLoading(true);
      const startDate = selectedDate;
      const endDate = selectedDate;
      
      const response = await fetch(`/api/admin/tee-times?startDate=${startDate}&endDate=${endDate}`, {
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

  const changeDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    if (direction === 'prev') {
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleCreateTeeTime = async (data: any) => {
    try {
      const response = await fetch('/api/admin/tee-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          date: selectedDate,
          courseId: activeCourse
        })
      });

      if (response.ok) {
        setMessage('Tee time created successfully!');
        setShowCreateModal(false);
        loadTeeTimes();
      } else {
        const errorData = await response.json();
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

  const handleDeleteTeeTime = async (teeTimeId: number) => {
    try {
      const response = await fetch(`/api/admin/tee-times?id=${teeTimeId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Tee time deleted successfully!');
        setShowEditModal(false);
        setSelectedTeeTime(null);
        loadTeeTimes();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting tee time');
      }
    } catch (error) {
      console.error('Error deleting tee time:', error);
      setMessage('Error deleting tee time');
      throw error;
    }
  };

  const handleTeeTimeClick = (teeTime: TeeTime) => {
    setSelectedTeeTime(teeTime);
    setShowEditModal(true);
  };
  const formatDate = (dateString: string) => {
    // Parse date string manually to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate all possible tee times for the day
  const generateAllTeeTimeSlots = () => {
    const slots = [];
    const startHour = 7;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };
  // Get tee times for the selected course and date
  const filteredTeeTimes = teeTimes.filter(tt => 
    tt.course_name === activeCourse && tt.date === selectedDate
  );
  
  const allTimeSlots = generateAllTeeTimeSlots();
  
  // Group bookings by time slots
  const bookingsByTime = filteredTeeTimes.reduce((acc, booking) => {
    if (!acc[booking.time]) {
      acc[booking.time] = [];
    }
    acc[booking.time].push(booking);
    return acc;
  }, {} as { [key: string]: TeeTime[] });

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
                Tee Times Management - {courseNames[activeCourse]}
              </h1>
              <p className="text-gray-600">
                Daily view of all tee times for {courseNames[activeCourse]}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredTeeTimes.length} bookings today
              </div>              <button
                onClick={() => {
                  setSelectedTeeTime(null);
                  setSelectedTimeSlot('');
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Tee Time</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {Object.entries(courseNames).map(([courseId, courseName]) => (
              <button
                key={courseId}
                onClick={() => setActiveCourse(courseId as CourseType)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeCourse === courseId
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {courseName}
              </button>
            ))}
          </nav>
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

        {/* Date Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => changeDate('prev')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                  {formatDate(selectedDate)}
                </h2>
                <button
                  onClick={() => changeDate('next')}
                  className="p-2 hover:bg-gray-100 rounded-md"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToToday}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Today
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tee Times Grid */}
        <div className="bg-white rounded-lg shadow">          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              All Tee Time Slots - {courseNames[activeCourse]}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              All available time slots from 7:00 AM to 6:00 PM (every 10 minutes). Each booking is for one member plus guests.
            </p>
          </div>
            <div className="divide-y divide-gray-200">
            {allTimeSlots.map((timeSlot) => {
              const bookings = bookingsByTime[timeSlot] || [];
              const isEmpty = bookings.length === 0;
              const totalPlayers = bookings.reduce((sum, booking) => sum + (booking.players || 1), 0);
              const maxPlayers = 4;
              const isFullyBooked = totalPlayers >= maxPlayers;
              
              return (
                <div
                  key={timeSlot}
                  className={`px-6 py-4 hover:bg-gray-50 ${
                    isEmpty ? 'text-gray-400' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="font-medium text-gray-900">
                        {formatTime(timeSlot)}
                      </div>
                      {isEmpty ? (
                        <div className="text-sm text-gray-500">
                          Available
                        </div>
                      ) : (
                        <div className="space-y-2">                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isFullyBooked ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {totalPlayers}/{maxPlayers} players
                            </span>
                            {!isFullyBooked && (
                              <span className="text-xs text-green-600">
                                {maxPlayers - totalPlayers} spot{maxPlayers - totalPlayers !== 1 ? 's' : ''} available
                              </span>
                            )}
                            {isFullyBooked && (
                              <span className="text-xs text-red-600">FULL</span>
                            )}
                          </div>
                          <div className="grid gap-2">
                            {bookings.map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">                                <div className="flex items-center space-x-3">
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {booking.player_names || `${booking.first_name} ${booking.last_name}`}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {booking.players || 1} player{(booking.players || 1) !== 1 ? 's' : ''}
                                      {booking.notes && ` • ${booking.notes}`}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    #{booking.member_id_display}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    booking.status === 'active' ? 'bg-green-100 text-green-800' :
                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {booking.status}
                                  </span>
                                  <button
                                    onClick={() => handleTeeTimeClick(booking)}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTeeTime(booking.id)}
                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                    title="Cancel booking"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                      <div className="flex items-center space-x-2">                      {isEmpty && (
                        <button
                          onClick={() => {
                            setSelectedTeeTime(null);
                            setSelectedTimeSlot(timeSlot);
                            setShowCreateModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Book
                        </button>
                      )}
                      {!isEmpty && !isFullyBooked && (
                        <button
                          onClick={() => {
                            setSelectedTeeTime(null);
                            setSelectedTimeSlot(timeSlot);
                            setShowCreateModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Book Another
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>      {/* Create Modal */}
      <CreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        type="tee-time"
        selectedDate={selectedDate}
        onCreate={handleCreateTeeTime}
        defaultCourse={activeCourse}
        defaultTime={selectedTimeSlot}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        type="tee-time"
        item={selectedTeeTime}
        onUpdate={handleUpdateTeeTime}
        onDelete={handleDeleteTeeTime}
      />
    </div>
  );
};

export default AdminTeeTimesPage;
