import { useState, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import CreateModal from '../../components/admin/CreateModal';
import EditModal from '../../components/admin/EditModal';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface TennisReservation {
  id: number;
  member_id: number;
  date: string;
  time: string;
  duration: number;
  court_number: number;
  notes?: string;
  status: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  member_id_display: string;
  created_at: string;
}

const AdminTennisCourtsPage = () => {
  const { } = useAdminAuth();
  const [reservations, setReservations] = useState<TennisReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedReservation, setSelectedReservation] = useState<TennisReservation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCourt, setSelectedCourt] = useState<number>(1);

  const courts = [1, 2, 3, 4]; // Assuming 4 tennis courts

  useEffect(() => {
    loadReservations();
  }, [selectedDate]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/tennis-courts?date=${selectedDate}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      } else {
        setMessage('Failed to load tennis court reservations');
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
      setMessage('Error loading reservations');
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

  const handleCreateReservation = async (data: any) => {
    try {
      const response = await fetch('/api/admin/tennis-courts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          date: selectedDate,
          court_number: selectedCourt
        })
      });

      if (response.ok) {
        setMessage('Tennis court reservation created successfully!');
        setShowCreateModal(false);
        loadReservations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setMessage('Error creating reservation');
      throw error;
    }
  };

  const handleUpdateReservation = async (data: any) => {
    try {
      const response = await fetch('/api/admin/tennis-courts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setMessage('Tennis court reservation updated successfully!');
        setShowEditModal(false);
        setSelectedReservation(null);
        loadReservations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update reservation');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      setMessage('Error updating reservation');
      throw error;
    }
  };

  const handleDeleteReservation = async (reservationId: number) => {
    try {
      const response = await fetch(`/api/admin/tennis-courts?id=${reservationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('Tennis court reservation deleted successfully!');
        setShowEditModal(false);
        setSelectedReservation(null);
        loadReservations();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting reservation');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      setMessage('Error deleting reservation');
      throw error;
    }
  };

  const handleReservationClick = (reservation: TennisReservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  // Generate all possible time slots for the day
  const generateAllTimeSlots = () => {
    const slots = [];
    const startHour = 6;  // 6 AM
    const endHour = 22;   // 10 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 60) { // 1-hour slots
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  // Filter reservations for the selected date and court
  const filteredReservations = reservations.filter(r => 
    r.date === selectedDate && r.court_number === selectedCourt
  );
  
  const allTimeSlots = generateAllTimeSlots();
  const reservationsByTime = filteredReservations.reduce((acc, reservation) => {
    acc[reservation.time] = reservation;
    return acc;
  }, {} as { [key: string]: TennisReservation });

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
                Tennis Courts Management - Court {selectedCourt}
              </h1>
              <p className="text-gray-600">
                Daily view of tennis court reservations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredReservations.length} reservations today
              </div>
              <button
                onClick={() => {
                  setSelectedReservation(null);
                  setShowCreateModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Reservation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Court Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {courts.map((courtNumber) => (
              <button
                key={courtNumber}
                onClick={() => setSelectedCourt(courtNumber)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedCourt === courtNumber
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Court {courtNumber}
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

        {/* Reservations Grid */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Court {selectedCourt} Time Slots
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              All available time slots from 6:00 AM to 10:00 PM (1-hour slots)
            </p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {allTimeSlots.map((timeSlot) => {
              const reservation = reservationsByTime[timeSlot];
              const isEmpty = !reservation;
              
              return (
                <div
                  key={timeSlot}
                  className={`px-6 py-4 hover:bg-gray-50 ${
                    isEmpty ? 'text-gray-400' : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (reservation) {
                      handleReservationClick(reservation);
                    }
                  }}
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
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {reservation.first_name} {reservation.last_name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {reservation.duration} hour{reservation.duration !== 1 ? 's' : ''}
                              {reservation.notes && ` • ${reservation.notes}`}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            #{reservation.member_id_display}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {isEmpty ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReservation(null);
                            setShowCreateModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Book
                        </button>
                      ) : (
                        <>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {reservation.status}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReservation(reservation.id);
                            }}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="Delete reservation"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          {courts.map((courtNumber) => {
            const courtReservations = reservations.filter(r => 
              r.date === selectedDate && r.court_number === courtNumber
            );
            return (
              <div key={courtNumber} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Court {courtNumber}</h3>
                <p className="text-2xl font-bold text-gray-900">{courtReservations.length}</p>
                <p className="text-xs text-gray-500">reservations</p>
              </div>
            );
          })}
        </div>
      </div>      {/* Create Modal */}
      <CreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        type="reservation"
        selectedDate={selectedDate}
        onCreate={handleCreateReservation}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        type="reservation"
        item={selectedReservation}
        onUpdate={handleUpdateReservation}
        onDelete={handleDeleteReservation}
      />
    </div>
  );
};

export default AdminTennisCourtsPage;
