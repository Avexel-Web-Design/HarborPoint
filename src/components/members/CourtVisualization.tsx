import { useState, useEffect } from 'react';

interface CourtReservation {
  time: string;
  duration: number;
  isOwnBooking: boolean;
  memberName: string;
  memberIdDisplay?: string;
  notes?: string;
}

interface CourtData {
  courtNumber: number;
  reservations: CourtReservation[];
}

interface CourtVisualizationProps {
  selectedDate: string;
  selectedCourtType: 'tennis' | 'pickleball';
  refreshTrigger?: number; // Add a refresh trigger prop
}

const CourtVisualization = ({ selectedDate, selectedCourtType, refreshTrigger }: CourtVisualizationProps) => {
  const [courts, setCourts] = useState<CourtData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    reservation: CourtReservation;
    courtNumber: number;
    timeSlot: string;
  } | null>(null);
  useEffect(() => {
    loadCourtData();
  }, [selectedDate, selectedCourtType, refreshTrigger]);
  const loadCourtData = async () => {
    setLoading(true);
    setCourts([]); // Clear existing data first
    try {
      const response = await fetch(
        `/api/tennis-courts/available?date=${selectedDate}&courtType=${selectedCourtType}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Court data loaded:', data); // Debug log
        setCourts(data.courts || []);
      } else {
        console.error('Failed to fetch court data:', response.status);
      }
    } catch (error) {
      console.error('Failed to load court data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots for the day (6 AM to 10 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  const isTimeSlotOccupied = (court: CourtData, timeSlot: string) => {
    const slotTime = new Date(`2000-01-01T${timeSlot}`);
    
    for (const reservation of court.reservations) {
      const startTime = new Date(`2000-01-01T${reservation.time}`);
      const endTime = new Date(startTime.getTime() + reservation.duration * 60000);
      
      if (slotTime >= startTime && slotTime < endTime) {
        return {
          occupied: true,
          isOwnBooking: reservation.isOwnBooking,
          reservation
        };
      }
    }
    
    return { occupied: false, isOwnBooking: false, reservation: null };
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

  const timeSlots = generateTimeSlots();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Court Availability
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Loading court data...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow p-6">      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {selectedCourtType === 'tennis' ? 'Tennis' : 'Pickleball'} Court Availability
          <span className="text-sm text-gray-500 ml-2">
            ({selectedCourtType === 'tennis' ? '9' : '4'} courts)
          </span>
        </h3>        <button
          onClick={() => loadCourtData()}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 flex items-center gap-1"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        {formatDate(selectedDate)}
      </p>      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-200 border border-green-300 rounded mr-2"></div>
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded mr-2"></div>
            <span className="text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded mr-2"></div>
            <span className="text-gray-700">Your Booking</span>
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="text-xs text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
          {(() => {
            const totalSlots = courts.length * timeSlots.length;
            const occupiedSlots = courts.reduce((total, court) => {
              return total + timeSlots.filter(slot => isTimeSlotOccupied(court, slot).occupied).length;
            }, 0);
            const availableSlots = totalSlots - occupiedSlots;
            return `${availableSlots}/${totalSlots} slots available`;
          })()}
        </div>
      </div>

      {/* Court Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">          {/* Header with time slots */}
          <div className="flex mb-2">
            <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 py-2">
              Court
            </div>
            {timeSlots.map((slot, index) => (
              <div
                key={slot}
                className={`w-8 flex-shrink-0 text-xs text-center py-2 ${
                  index % 2 === 0 ? 'text-gray-700 font-medium' : 'text-gray-400'
                }`}
              >
                {index % 2 === 0 ? formatTime(slot).replace(' ', '') : ''}
              </div>
            ))}
          </div>

          {/* Court rows */}
          {courts.map((court) => (
            <div key={court.courtNumber} className="flex mb-1">
              <div className="w-20 flex-shrink-0 text-sm font-medium text-gray-700 py-2 flex items-center">
                Court {court.courtNumber}
              </div>              {timeSlots.map((slot) => {
                const slotStatus = isTimeSlotOccupied(court, slot);
                return (
                  <div
                    key={`${court.courtNumber}-${slot}`}
                    className={`w-8 h-8 flex-shrink-0 border border-gray-200 ${
                      slotStatus.occupied
                        ? slotStatus.isOwnBooking
                          ? 'bg-blue-200 border-blue-300 cursor-pointer hover:bg-blue-300'
                          : 'bg-red-200 border-red-300 cursor-pointer hover:bg-red-300'
                        : 'bg-green-200 border-green-300 hover:bg-green-300'
                    }`}
                    title={
                      slotStatus.occupied
                        ? `Occupied ${formatTime(slot)} ${slotStatus.isOwnBooking ? '(Your booking)' : '(Click for details)'}`
                        : `Available ${formatTime(slot)}`
                    }
                    onClick={() => {
                      if (slotStatus.occupied && slotStatus.reservation) {
                        setSelectedBooking({
                          reservation: slotStatus.reservation,
                          courtNumber: court.courtNumber,
                          timeSlot: slot
                        });
                      }
                    }}
                  />
                );
              })}
            </div>          ))}
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Court:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {selectedCourtType === 'tennis' ? 'Tennis' : 'Pickleball'} Court {selectedBooking.courtNumber}
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Date:</span>
                <span className="ml-2 text-sm text-gray-900">{formatDate(selectedDate)}</span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Time:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {formatTime(selectedBooking.reservation.time)} 
                  ({selectedBooking.reservation.duration} minutes)
                </span>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Booked by:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {selectedBooking.reservation.memberName}
                  {selectedBooking.reservation.isOwnBooking && (
                    <span className="text-blue-600 ml-1">(You)</span>
                  )}
                </span>
                {selectedBooking.reservation.memberIdDisplay && (
                  <span className="ml-2 text-xs text-gray-500">
                    #{selectedBooking.reservation.memberIdDisplay}
                  </span>
                )}
              </div>
              
              {selectedBooking.reservation.notes && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Notes:</span>
                  <div className="ml-2 text-sm text-gray-900 bg-gray-50 p-2 rounded mt-1">
                    {selectedBooking.reservation.notes}
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourtVisualization;
