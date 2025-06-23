import { useState, useEffect } from 'react';

interface TeeTime {
  id: string;
  courseId: string;
  courseName: string;
  date: string;
  time: string;
  players: number;
  maxPlayers: number;
  price: number;
  status: 'available' | 'booked' | 'pending' | 'partial';
  availableSpots?: number;
  bookedBy?: {
    firstName: string;
    lastName: string;
    memberId: string;
    playerNames?: string;
  };
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

const MemberTeeTimes = () => {  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [availableTeeTimes, setAvailableTeeTimes] = useState<TeeTime[]>([]);
  const [myBookings, setMyBookings] = useState<TeeTimeBooking[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTeeTime, setSelectedTeeTime] = useState<TeeTime | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState(1);
  const [allowOthersToJoin, setAllowOthersToJoin] = useState(false);

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
  };  const openBookingModal = (teeTime: TeeTime, players: number) => {
    setSelectedTeeTime(teeTime);
    setSelectedPlayers(players);
    // Default to allowing others to join unless this booking will fill up the tee time completely
    const willFillCompletely = (teeTime.players || 0) + players >= teeTime.maxPlayers;
    setAllowOthersToJoin(!willFillCompletely);
    setShowBookingModal(true);
  };
  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedTeeTime(null);
    setSelectedPlayers(1);
    setAllowOthersToJoin(false);
  };

  const confirmBooking = async () => {
    if (selectedTeeTime) {
      await bookTeeTime(selectedTeeTime, selectedPlayers, allowOthersToJoin);
      closeBookingModal();
    }
  };

  const bookTeeTime = async (teeTime: any, players: number, allowJoining: boolean = false) => {
    // Safety check - don't allow booking already booked times
    if (teeTime.status === 'booked') {
      setError('This tee time is already booked');
      return;
    }

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
          players: players,
          allowOthersToJoin: allowJoining
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
    <div className="container-width section-padding py-8">{/* Success/Error Messages */}
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

            {/* Available Tee Times */}            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tee Times for {formatDate(selectedDate)}
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">Loading tee times...</p>
                </div>
              ) : availableTeeTimes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No tee times for the selected date and course.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {availableTeeTimes.map((teeTime) => (                    <div key={teeTime.id} className={`border rounded-lg p-4 ${
                      teeTime.status === 'booked' 
                        ? 'border-red-200 bg-red-50' 
                        : teeTime.status === 'partial'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-gray-200 bg-white'
                    }`}>                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-lg">{formatTime(teeTime.time)}</p>
                          <p className="text-sm text-gray-600">{teeTime.courseName}</p>
                        </div>
                        {(teeTime.status === 'available' || teeTime.status === 'partial') && (
                          <div className="text-right">
                            <p className="font-semibold text-primary-600">{teeTime.players}/{teeTime.maxPlayers} players</p>
                            <p className="text-sm text-gray-500">spots taken</p>
                          </div>
                        )}
                      </div>
                      
                      {teeTime.status === 'booked' ? (
                        // Show booked tee time information
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-700">BOOKED</span>
                            <span className="text-sm text-gray-600">
                              {teeTime.players}/{teeTime.maxPlayers} players
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            <p className="font-medium">
                              {teeTime.bookedBy?.firstName} {teeTime.bookedBy?.lastName}
                            </p>
                            {teeTime.bookedBy?.playerNames && (
                              <p className="text-gray-600 mt-1">
                                Group: {teeTime.bookedBy.playerNames}
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              Member ID: {teeTime.bookedBy?.memberId}
                            </p>
                          </div>
                        </div>                      ) : (
                        // Show available tee time booking options
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <label htmlFor={`players-${teeTime.id}`} className="text-sm text-gray-600">Players:</label>
                            <select
                              id={`players-${teeTime.id}`}
                              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                              defaultValue="1"
                              onChange={(e) => {
                                const selectElement = e.target as HTMLSelectElement;
                                selectElement.setAttribute('data-selected-players', e.target.value);
                              }}
                            >
                              {[1, 2, 3, 4].slice(0, teeTime.maxPlayers - teeTime.players).map((players) => (
                                <option key={players} value={players}>
                                  {players}
                                </option>
                              ))}
                            </select>
                          </div>
                            <button
                            onClick={() => {
                              const selectElement = document.getElementById(`players-${teeTime.id}`) as HTMLSelectElement;
                              const selectedPlayers = parseInt(selectElement?.getAttribute('data-selected-players') || selectElement?.value || '1');
                              openBookingModal(teeTime, selectedPlayers);
                            }}
                            disabled={bookingLoading === teeTime.id}                            className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium"
                          >
                            {bookingLoading === teeTime.id ? (
                              <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            ) : (
                              'Book Tee Time'
                            )}
                          </button>
                        </div>
                      )}
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
            </div>          </div>
        </div>        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50" 
              onClick={closeBookingModal}
            ></div>
            
            {/* Modal */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 relative z-10">
              <h2 className="text-xl font-semibold mb-4">Confirm Booking</h2>              <p className="mb-4">
                You are about to book {selectedPlayers} spot{selectedPlayers !== 1 ? 's' : ''} for the tee time on {formatDate(selectedTeeTime?.date || '')} at {formatTime(selectedTeeTime?.time || '')}.
              </p>
              
              {/* Show "Allow others to join" checkbox unless this booking fills up the tee time completely */}
              {selectedTeeTime && ((selectedTeeTime.players || 0) + selectedPlayers) < selectedTeeTime.maxPlayers && (
                <>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="allow-others-to-join"
                      checked={allowOthersToJoin}
                      onChange={(e) => setAllowOthersToJoin(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="allow-others-to-join" className="text-sm text-gray-700">
                      Allow others to join my booking
                    </label>
                  </div>
                  {allowOthersToJoin && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-700">
                        When enabled, other members will be able to book the remaining spots for this tee time.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {/* Show informational message when joining existing tee time */}
              {selectedTeeTime?.status === 'partial' && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    You are joining an existing tee time with {selectedTeeTime.bookedBy?.firstName} {selectedTeeTime.bookedBy?.lastName}.
                  </p>
                </div>
              )}
              
              {/* Show message when this booking will fill up the tee time */}
              {selectedTeeTime && ((selectedTeeTime.players || 0) + selectedPlayers) >= selectedTeeTime.maxPlayers && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    This booking will fill up the tee time completely.
                  </p>
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeBookingModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>    );
};

export default MemberTeeTimes;
