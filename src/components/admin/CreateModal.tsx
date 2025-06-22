import React, { useState } from 'react';
import { X } from 'lucide-react';
import MemberSelect from './MemberSelect';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tee-time' | 'event' | 'reservation';
  selectedDate: string;
  onCreate: (data: any) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  type,
  selectedDate,
  onCreate
}) => {
  const [formData, setFormData] = useState<any>({
    date: selectedDate,
    time: '',
    memberIds: [],
    // Tee time specific
    courseId: 'birches',
    notes: '',
    // Event specific
    title: '',
    description: '',
    location: '',
    max_capacity: '',
    price: 0,
    // Reservation specific
    party_size: 1,
    special_requests: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type !== 'event' && formData.memberIds.length === 0) {
        setError('Please select at least one member');
        return;
      }

      // Ensure courseId is included for tee times
      if (type === 'tee-time') {
        formData.courseId = formData.courseId || 'birches';
      }

      await onCreate(formData);
      onClose();
      
      // Reset form after successful creation
      setFormData({
        date: selectedDate,
        time: '',
        memberIds: [],
        courseId: 'birches',
        notes: '',
        title: '',
        description: '',
        location: '',
        max_capacity: '',
        price: 0,
        party_size: 1,
        special_requests: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const getTitle = () => {
    switch (type) {
      case 'tee-time': return 'Create Tee Time';
      case 'event': return 'Create Event';
      case 'reservation': return 'Create Dining Reservation';
      default: return 'Create';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {getTitle()}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Member selection for tee times and reservations */}
            {type !== 'event' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'tee-time' ? 'Players *' : 'Primary Member *'}
                </label>
                <MemberSelect
                  selectedMembers={formData.memberIds}
                  onMembersChange={(memberIds) => handleInputChange('memberIds', memberIds)}
                  multiple={type === 'tee-time'}
                  placeholder={`Select ${type === 'tee-time' ? 'players' : 'member'}...`}
                />
              </div>
            )}

            {/* Tee time specific fields */}
            {type === 'tee-time' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => handleInputChange('courseId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="birches">The Birches</option>
                    <option value="woods">The Woods</option>
                    <option value="farms">The Farms</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </>
            )}

            {/* Event specific fields */}
            {type === 'event' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Capacity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_capacity}
                      onChange={(e) => handleInputChange('max_capacity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Reservation specific fields */}
            {type === 'reservation' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Size *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.party_size}
                    onChange={(e) => handleInputChange('party_size', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dietary restrictions, seating preferences, etc."
                  />
                </div>
              </>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
