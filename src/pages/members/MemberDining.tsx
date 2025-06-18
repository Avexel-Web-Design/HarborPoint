import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface DiningReservation {
  id: number;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: string;
}

interface DiningReservationForm {
  date: string;
  time: string;
  partySize: number;
  specialRequests: string;
}

const MemberDining = () => {
  const [reservations, setReservations] = useState<DiningReservation[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reservationForm, setReservationForm] = useState<DiningReservationForm>({
    date: '',
    time: '',
    partySize: 2,
    specialRequests: ''
  });
  const [message, setMessage] = useState('');

  const timeSlots = [
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await fetch('/api/dining', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservationForm.date || !reservationForm.time) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/dining', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reservationForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Reservation made successfully!');
        setReservationForm({
          date: '',
          time: '',
          partySize: 2,
          specialRequests: ''
        });
        setIsBooking(false);
        loadReservations();
      } else {
        setMessage(data.error || 'Failed to make reservation');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      setMessage('Error making reservation');
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/dining?id=${reservationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Reservation cancelled successfully');
        loadReservations();
      } else {
        setMessage(data.error || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      setMessage('Error cancelling reservation');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 weeks ahead

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Dining Reservations
              </h1>
              <p className="text-gray-600">
                Reserve your table at our clubhouse restaurant
              </p>
            </div>
            <Link 
              to="/members/dashboard" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container-width section-padding py-8">
        <div className="max-w-6xl mx-auto">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-gray-900">Your Reservations</h2>
            <button
              onClick={() => setIsBooking(!isBooking)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
            >
              {isBooking ? 'Cancel Booking' : 'Make Reservation'}
            </button>
          </div>

          {/* Booking Form */}
          {isBooking && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Make a Reservation</h3>
              <form onSubmit={handleMakeReservation} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={reservationForm.date}
                      onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                      min={minDate}
                      max={maxDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <select
                      value={reservationForm.time}
                      onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select a time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>
                          {formatTime(time)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Party Size *
                    </label>
                    <select
                      value={reservationForm.partySize}
                      onChange={(e) => setReservationForm({ ...reservationForm, partySize: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(size => (
                        <option key={size} value={size}>
                          {size} {size === 1 ? 'Person' : 'People'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    value={reservationForm.specialRequests}
                    onChange={(e) => setReservationForm({ ...reservationForm, specialRequests: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Dietary restrictions, seating preferences, special occasions..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsBooking(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
                  >
                    Make Reservation
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Current Reservations */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reservations</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🍽️</div>
                  <p className="text-gray-500 mb-4">No upcoming reservations</p>
                  <button
                    onClick={() => setIsBooking(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Make your first reservation
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              Clubhouse Restaurant
                            </h4>
                            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
                              Party of {reservation.party_size}
                            </span>
                          </div>
                          <div className="text-gray-600 space-y-1">
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {formatDate(reservation.date)}
                            </p>
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              {formatTime(reservation.time)}
                            </p>
                            {reservation.special_requests && (
                              <p className="flex items-start">
                                <svg className="w-4 h-4 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z" clipRule="evenodd" />
                                </svg>
                                {reservation.special_requests}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="text-red-600 hover:text-red-800 font-medium ml-4"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Hours</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Monday - Thursday: 5:00 PM - 9:00 PM</p>
                  <p>Friday - Saturday: 5:00 PM - 10:00 PM</p>
                  <p>Sunday: 4:00 PM - 8:00 PM</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Phone: (231) 526-2166</p>
                  <p>Email: dining@birchwoodcc.com</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">About Our Restaurant</h4>
              <p className="text-gray-600 text-sm">
                Experience fine dining with a view of our championship golf courses. Our menu features 
                locally sourced ingredients and seasonal specialties. The restaurant offers both indoor 
                seating and a beautiful outdoor terrace overlooking the 18th green.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDining;
