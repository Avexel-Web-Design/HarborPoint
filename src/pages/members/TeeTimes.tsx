import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface TeeTime {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  players: number;
  maxPlayers: number;
  price: number;
  status: 'available' | 'booked' | 'pending';
}

interface TeeTimeBooking {
  id: string;
  teeTimeId: string;
  date: string;
  time: string;
  courseName: string;
  players: number;
  status: 'active' | 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  description: string;
}

const MemberTeeTimes = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableTeeTimes, setAvailableTeeTimes] = useState<TeeTime[]>([]);
  const [myBookings, setMyBookings] = useState<TeeTimeBooking[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initialize courses
  useEffect(() => {
    setCourses([
      { id: 'birches', name: 'The Birches', description: 'Championship 18-hole course' },
      { id: 'woods', name: 'The Woods', description: 'Executive 9-hole course' },
      { id: 'farms', name: 'The Farms', description: 'Links-style 18-hole course' }
    ]);
    setSelectedCourse('birches');
  }, []);

  // Load available tee times when date or course changes
  useEffect(() => {
    if (selectedDate && selectedCourse) {
      loadAvailableTeeTimes();
    }
  }, [selectedDate, selectedCourse]);  // Load user's bookings on component mount
  useEffect(() => {
    loadMyBookings();
  }, []);  const loadAvailableTeeTimes = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/tee-times/available?date=${selectedDate}&courseId=${selectedCourse}`);
      
      if (!response.ok) {
        throw new Error('Failed to load available tee times');
      }
      
      const data = await response.json();
      setAvailableTeeTimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tee times');
      setAvailableTeeTimes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMyBookings = async () => {
    try {
      const response = await fetch('/api/tee-times', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyBookings(data.teeTimes || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    }
  };  const bookTeeTime = async (teeTime: any, players: number) => {
    setBookingLoading(teeTime.id);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch('/api/tee-times', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          courseId: teeTime.courseId,
          date: teeTime.date,
          time: teeTime.time,
          players: players
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book tee time');
      }
      
      setSuccess('Tee time booked successfully!');
      loadAvailableTeeTimes();
      loadMyBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book tee time');
    } finally {
      setBookingLoading(null);
    }
  };  const cancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tee-times?id=${bookingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      setSuccess('Booking cancelled successfully');
      loadMyBookings();
      loadAvailableTeeTimes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Tee Time Booking
              </h1>
              <p className="text-gray-600">
                Book your tee times at Birchwood Country Club
              </p>
            </div>
            <Link 
              to="/members/dashboard"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>      </div>

      <div className="container-width section-padding py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}        <div className="grid lg:grid-cols-3 gap-8">

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
                Find Available Tee Times
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    min={getMinDate()}
                    max={getMaxDate()}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course
                  </label>
                  <select
                    id="course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Available Tee Times */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Times for {formatDate(selectedDate)}
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">Loading available times...</p>
                </div>
              ) : availableTeeTimes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No available tee times for the selected date and course.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {availableTeeTimes.map((teeTime) => (
                    <div key={teeTime.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-lg">{formatTime(teeTime.time)}</p>
                          <p className="text-sm text-gray-600">{teeTime.courseName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-primary-600">${teeTime.price}</p>
                          <p className="text-sm text-gray-500">per player</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {teeTime.players}/{teeTime.maxPlayers} players
                        </span>
                        
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4].slice(0, teeTime.maxPlayers - teeTime.players).map((players) => (
                            <button
                              key={players}
                              onClick={() => bookTeeTime(teeTime, players)}
                              disabled={bookingLoading === teeTime.id}
                              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              {bookingLoading === teeTime.id ? (
                                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                              ) : (
                                `Book ${players}`
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Bookings Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                My Upcoming Bookings
              </h3>
              
              {myBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming bookings</p>
              ) : (
                <div className="space-y-4">
                  {myBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{formatTime(booking.time)}</p>
                          <p className="text-sm text-gray-600">{formatDate(booking.date)}</p>
                          <p className="text-sm text-gray-600">{booking.courseName}</p>
                        </div>                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'active' || booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'active' ? 'confirmed' : booking.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {booking.players} player{booking.players !== 1 ? 's' : ''}
                        </span>
                          {(booking.status === 'active' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Course Information */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Information
              </h3>
              
              {courses.map(course => (
                <div key={course.id} className={`mb-3 p-3 rounded ${selectedCourse === course.id ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
                  <p className="font-medium">{course.name}</p>
                  <p className="text-sm text-gray-600">{course.description}</p>
                </div>
              ))}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Booking Policy</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Bookings can be made up to 30 days in advance</li>
                  <li>• Cancellations must be made 24 hours in advance</li>
                  <li>• Late cancellations may incur fees</li>
                  <li>• Check-in is required 15 minutes before tee time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTeeTimes;
