import React, { useState, useEffect } from 'react';
import Calendar from '../../components/admin/Calendar';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface DiningReservation {
  id: number;
  member_id: number;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  member_id_display: string;
  created_at: string;
}

interface DiningReservationForm {
  id?: number;
  date: string;
  time: string;
  party_size: number;
  special_requests: string;
}

const AdminDiningPage = () => {
  const { } = useAdminAuth();
  const [reservations, setReservations] = useState<DiningReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<DiningReservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [message, setMessage] = useState('');
  const [reservationForm, setReservationForm] = useState<DiningReservationForm>({
    date: '',
    time: '',
    party_size: 1,
    special_requests: ''
  });

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/dining', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      } else {
        setMessage('Failed to load dining reservations');
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
      setMessage('Error loading reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleReservationClick = (reservation: any) => {
    const fullReservation = reservations.find(r => r.id === reservation.id);
    if (fullReservation) {
      setSelectedReservation(fullReservation);
      setReservationForm({
        id: fullReservation.id,
        date: fullReservation.date,
        time: fullReservation.time,
        party_size: fullReservation.party_size,
        special_requests: fullReservation.special_requests || ''
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/dining', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(reservationForm)
      });

      if (response.ok) {
        setMessage('Reservation updated successfully!');
        setShowEditModal(false);
        setSelectedReservation(null);
        loadReservations();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setMessage('Error updating reservation');
    }
  };

  const handleDeleteReservation = async (reservationId: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      const response = await fetch(`/api/admin/dining?id=${reservationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Reservation cancelled successfully!');
        setShowEditModal(false);
        setSelectedReservation(null);
        loadReservations();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setMessage('Error cancelling reservation');
    }
  };

  const calendarEvents = reservations.map(reservation => ({
    id: reservation.id,
    date: reservation.date,
    time: reservation.time,
    title: `${reservation.first_name} ${reservation.last_name}`,
    subtitle: `Party of ${reservation.party_size}`
  }));

  const selectedDateReservations = reservations.filter(r => r.date === selectedDate);

  // Group reservations by time for better display
  const reservationsByTime = selectedDateReservations.reduce((acc, reservation) => {
    if (!acc[reservation.time]) {
      acc[reservation.time] = [];
    }
    acc[reservation.time].push(reservation);
    return acc;
  }, {} as { [key: string]: DiningReservation[] });

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
                Dining Reservations Management
              </h1>
              <p className="text-gray-600">
                Manage and overview dining reservations
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total reservations: {reservations.length}
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
              onEventClick={handleReservationClick}
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
                
                {selectedDateReservations.length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(reservationsByTime)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([time, timeReservations]) => (
                      <div key={time} className="border-l-4 border-blue-500 pl-4">
                        <div className="font-medium text-gray-900 mb-2">{time}</div>
                        <div className="space-y-2">
                          {timeReservations.map(reservation => (
                            <div
                              key={reservation.id}
                              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                              onClick={() => handleReservationClick(reservation)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {reservation.first_name} {reservation.last_name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Party of {reservation.party_size}
                                  </div>
                                  {reservation.special_requests && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Note: {reservation.special_requests}
                                    </div>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">
                                  #{reservation.member_id_display}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No reservations for this date.</p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reservations</span>
                  <span className="font-medium">{reservations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium">
                    {reservations.filter(r => {
                      const reservationDate = new Date(r.date);
                      const today = new Date();
                      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return reservationDate >= weekStart && reservationDate <= weekEnd;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium">
                    {reservations.filter(r => {
                      const reservationDate = new Date(r.date);
                      const today = new Date();
                      return (
                        reservationDate.getMonth() === today.getMonth() &&
                        reservationDate.getFullYear() === today.getFullYear()
                      );
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Guests</span>
                  <span className="font-medium">
                    {reservations.reduce((sum, r) => sum + r.party_size, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Party Size</span>
                  <span className="font-medium">
                    {reservations.length > 0 
                      ? (reservations.reduce((sum, r) => sum + r.party_size, 0) / reservations.length).toFixed(1)
                      : '0'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedReservation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Dining Reservation
              </h3>
              
              <form onSubmit={handleUpdateReservation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member
                  </label>
                  <div className="text-sm text-gray-600">
                    {selectedReservation.first_name} {selectedReservation.last_name} (#{selectedReservation.member_id_display})
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedReservation.email}
                    {selectedReservation.phone && ` • ${selectedReservation.phone}`}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={reservationForm.date}
                    onChange={(e) => setReservationForm({...reservationForm, date: e.target.value})}
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
                    value={reservationForm.time}
                    onChange={(e) => setReservationForm({...reservationForm, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={reservationForm.party_size}
                    onChange={(e) => setReservationForm({...reservationForm, party_size: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={reservationForm.special_requests}
                    onChange={(e) => setReservationForm({...reservationForm, special_requests: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Dietary restrictions, seating preferences, etc."
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
                    onClick={() => handleDeleteReservation(selectedReservation.id)}
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

export default AdminDiningPage;
