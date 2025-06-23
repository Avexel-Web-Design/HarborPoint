import { useState, useEffect } from 'react';
import CourtVisualization from '../../components/members/CourtVisualization';

interface CourtReservation {
  id: number;
  court_type: 'tennis' | 'pickleball';
  court_number?: number;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  status: string;
  created_at: string;
}

const MemberTennisCourts = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourtType, setSelectedCourtType] = useState<'tennis' | 'pickleball'>('tennis');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedCourt, setSelectedCourt] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [myReservations, setMyReservations] = useState<CourtReservation[]>([]);
  const [loading, setLoading] = useState(false);  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state

  // Load user's reservations on component mount
  useEffect(() => {
    loadMyReservations();
  }, []);

  const loadMyReservations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tennis-courts', {
        credentials: 'include'
      });      if (response.ok) {
        const data = await response.json();
        setMyReservations(data.reservations || []);
      }
    } catch (err) {
      console.error('Failed to load reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookCourt = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/tennis-courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          courtType: selectedCourtType,
          courtNumber: selectedCourt || undefined,
          date: selectedDate,
          time: selectedTime,
          duration: selectedDuration,
          notes: notes || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book court');
      }      const data = await response.json();
      setSuccess(data.message);
      loadMyReservations();
      
      // Trigger court visualization refresh
      setRefreshTrigger(prev => prev + 1);
      
      // Reset form
      setSelectedCourt('');
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book court');
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelReservation = async (reservationId: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tennis-courts?id=${reservationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }      setSuccess('Reservation cancelled successfully');
      loadMyReservations();
      
      // Trigger court visualization refresh
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel reservation');
    }
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
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

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 6; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const getDurationOptions = () => [
    { value: 30, display: '30 minutes' },
    { value: 60, display: '1 hour' },
    { value: 90, display: '1.5 hours' },
    { value: 120, display: '2 hours' },
    { value: 150, display: '2.5 hours' },
    { value: 180, display: '3 hours' }
  ];

  const getCourtOptions = () => {
    const maxCourts = selectedCourtType === 'tennis' ? 9 : 4;
    const courts = [];
    for (let i = 1; i <= maxCourts; i++) {
      courts.push({ value: i, display: `Court ${i}` });
    }
    return courts;
  };

  return (
    <div className="container-width section-padding py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
          Tennis & Pickleball Courts
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Book your preferred court for tennis or pickleball. Choose your time and duration, 
          and we'll assign you the best available court or let you select your preferred one.
        </p>
      </div>

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
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
              Book a Court
            </h2>

            <form onSubmit={handleBookCourt} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="courtType" className="block text-sm font-medium text-gray-700 mb-2">
                    Court Type
                  </label>
                  <select
                    id="courtType"
                    value={selectedCourtType}
                    onChange={(e) => setSelectedCourtType(e.target.value as 'tennis' | 'pickleball')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="tennis">Tennis</option>
                    <option value="pickleball">Pickleball</option>
                  </select>
                </div>

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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {generateTimeOptions().map(({ value, display }) => (
                      <option key={value} value={value}>
                        {display}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    id="duration"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  >
                    {getDurationOptions().map(({ value, display }) => (
                      <option key={value} value={value}>
                        {display}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="court" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Court (Optional)
                </label>
                <select
                  id="court"
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Auto-assign best available court</option>
                  {getCourtOptions().map(({ value, display }) => (
                    <option key={value} value={value}>
                      {display}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank to automatically assign the best available court
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any additional notes or requests..."
                />
              </div>              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
              >
                {bookingLoading ? 'Booking Court...' : 'Book Court'}
              </button>
            </form>
          </div>          {/* Court Visualization */}
          <CourtVisualization 
            key={`${selectedDate}-${selectedCourtType}`}
            selectedDate={selectedDate}
            selectedCourtType={selectedCourtType}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* My Reservations */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">
              My Court Reservations
            </h2>            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading reservations...</p>
              </div>            ) : (() => {
                // Filter for upcoming reservations (today and future)
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
                
                const upcomingReservations = myReservations
                  .filter(reservation => reservation.date >= todayStr)
                  .sort((a, b) => {
                    // Sort by date first, then by time
                    if (a.date !== b.date) {
                      return a.date.localeCompare(b.date);
                    }
                    return a.time.localeCompare(b.time);
                  });
                
                return upcomingReservations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No upcoming reservations</p>
                    <p className="text-sm text-gray-400">
                      Book a court to see your reservations here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingReservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 capitalize">
                            {reservation.court_type} Court {reservation.court_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(reservation.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(reservation.time)} • {reservation.duration} minutes
                          </p>
                          {reservation.notes && (
                            <p className="text-sm text-gray-500 mt-1">
                              Notes: {reservation.notes}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => cancelReservation(reservation.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>                    ))}
                  </div>
                );
              })()
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTennisCourts;
