import { useState, useEffect } from 'react';
import Calendar from '../../components/admin/Calendar';
import CreateModal from '../../components/admin/CreateModal';
import EditModal from '../../components/admin/EditModal';
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

const AdminDiningPage = () => {
  const { } = useAdminAuth();
  const [reservations, setReservations] = useState<DiningReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<DiningReservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState('');

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
  const handleCreate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/dining', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage('Dining reservation created successfully!');
        loadReservations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setMessage('Error creating reservation');
      throw error;
    }
  };
  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch('/api/admin/dining', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage('Reservation updated successfully!');
        loadReservations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setMessage('Error updating reservation');
      throw error;
    }
  };
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  const handleDateDoubleClick = (date: string) => {
    setSelectedDate(date);
    setSelectedReservation(null);
    setShowCreateModal(true);
  };

  const handleEventDrop = async (event: any, newDate: string) => {
    const fullReservation = reservations.find(r => r.id.toString() === event.id.toString());
    if (!fullReservation) return;

    const updatedReservation = { ...fullReservation, date: newDate };
    await handleUpdate(updatedReservation);
  };

  const handleReservationClick = (reservation: any) => {
    const fullReservation = reservations.find(r => r.id === reservation.id);
    if (fullReservation) {
      setSelectedReservation(fullReservation);
      setShowEditModal(true);
    }
  };

  const calendarEvents = reservations.map(reservation => ({
    id: reservation.id,
    date: reservation.date,
    time: reservation.time,
    title: `${reservation.first_name} ${reservation.last_name}`,
    subtitle: `Party of ${reservation.party_size}`,
    type: 'reservation' as const
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
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Total reservations: {reservations.length}
              </div>
              <button
                onClick={() => {
                  setSelectedReservation(null);
                  setSelectedDate('');
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Create Reservation
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
              onEventClick={handleReservationClick}
              onEventDrop={handleEventDrop}
              selectedDate={selectedDate}
              enableDragDrop={true}
            />
          </div>          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructions */}
            {!selectedDate && (
              <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Actions</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Double-click any date to create a reservation</p>
                  <p>• Click a reservation to view details</p>
                  <p>• Drag reservations to reschedule them</p>
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
                                className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
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
                                    <div className="text-xs text-gray-500">
                                      #{reservation.member_id_display}
                                    </div>
                                    {reservation.special_requests && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {reservation.special_requests}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    <p>No reservations for this date.</p>
                    <p className="mt-2 text-xs">Double-click on a calendar date to create a reservation.</p>
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
                  <span className="font-medium">{reservations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Today</span>
                  <span className="font-medium">
                    {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-medium">
                    {reservations.filter(r => {
                      const resDate = new Date(r.date);
                      const today = new Date();
                      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekEnd.getDate() + 6);
                      return resDate >= weekStart && resDate <= weekEnd;
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Party Size</span>
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

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          type="reservation"
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          selectedDate={selectedDate}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedReservation && (
        <EditModal
          type="reservation"
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
          item={selectedReservation}
        />
      )}
    </div>
  );
};

export default AdminDiningPage;
