import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MemberSelect from './MemberSelect';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'tee-time' | 'event' | 'reservation' | 'court-reservation';
  item: any;
  onUpdate: (data: any) => void;
  onDelete?: (id: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  onUpdate,
  onDelete
}) => {  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {      if (item && isOpen) {
      setFormData({
        id: item.id,
        date: item.date,
        time: item.time,
        memberIds: type === 'event' ? [] : [item.member_id],        // Tee time specific
        courseId: item.course_name || 'birches',
        players: item.players || 1,
        notes: item.notes || '',
        // Event specific
        title: item.title || '',
        description: item.description || '',
        location: item.location || '',
        max_capacity: item.max_capacity || '',
        price: item.price || 0,
        // Reservation specific
        party_size: item.party_size || 1,
        special_requests: item.special_requests || '',
        // Court reservation specific
        court_type: item.court_type || 'tennis',
        court_number: item.court_number || '',
        duration: item.duration || 60
      });
    }
  }, [item, isOpen, type]);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');    try {
      if (type !== 'event' && formData.memberIds.length === 0) {
        setError('Please select a member');
        return;
      }

      if (type === 'tee-time' && formData.memberIds.length > 1) {
        setError('Please select only one member per booking');
        return;
      }// Ensure courseId is included for tee times
      if (type === 'tee-time') {
        formData.courseId = formData.courseId || 'birches';
      }

      // For court reservations, pass member_id instead of memberIds
      if (type === 'court-reservation') {
        formData.member_id = formData.memberIds[0]; // Single member for court reservations
      }

      await onUpdate(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setLoading(true);
    setError('');

    try {
      await onDelete(item.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };
  const getTitle = () => {
    switch (type) {
      case 'tee-time': return 'Edit Tee Time';
      case 'event': return 'Edit Event';
      case 'reservation': return 'Edit Dining Reservation';
      case 'court-reservation': return `Edit ${formData.court_type === 'tennis' ? 'Tennis' : 'Pickleball'} Court Reservation`;
      default: return 'Edit';
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
                  value={formData.date || ''}
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
                  value={formData.time || ''}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>            {/* Member selection for tee times and reservations */}
            {type !== 'event' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {type === 'tee-time' ? 'Member *' : 'Primary Member *'}
                </label>
                <MemberSelect
                  selectedMembers={formData.memberIds || []}
                  onMembersChange={(memberIds) => handleInputChange('memberIds', memberIds)}
                  multiple={false}
                  placeholder={`Select ${type === 'tee-time' ? 'member' : 'member'}...`}
                />
                {type === 'tee-time' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Select one member per booking. Create separate bookings for additional members playing at the same time.
                  </p>
                )}
              </div>
            )}{/* Tee time specific fields */}
            {type === 'tee-time' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    value={formData.courseId || 'birches'}
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
                    Number of Players *
                  </label>
                  <select
                    value={formData.players || 1}
                    onChange={(e) => handleInputChange('players', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value={1}>1 Player</option>
                    <option value={2}>2 Players</option>
                    <option value={3}>3 Players</option>
                    <option value={4}>4 Players</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Total players including the selected member and any guests
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
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
                    value={formData.title || ''}
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
                    value={formData.description || ''}
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
                    value={formData.location || ''}
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
                      value={formData.max_capacity || ''}
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
                      value={formData.price || 0}
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
                    value={formData.party_size || 1}
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
                    value={formData.special_requests || ''}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dietary restrictions, seating preferences, etc."
                  />
                </div>
              </>
            )}

            {/* Court reservation specific fields */}
            {type === 'court-reservation' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Court Type *
                  </label>
                  <select
                    value={formData.court_type || 'tennis'}
                    onChange={(e) => handleInputChange('court_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="tennis">Tennis</option>
                    <option value="pickleball">Pickleball</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Court Number
                    </label>
                    <select
                      value={formData.court_number || ''}
                      onChange={(e) => handleInputChange('court_number', e.target.value ? parseInt(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Auto-assign</option>
                      {Array.from({ length: formData.court_type === 'tennis' ? 9 : 4 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Court {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <select
                      value={formData.duration || 60}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={150}>2.5 hours</option>
                      <option value={180}>3 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional notes or requests..."
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
                {loading ? 'Updating...' : 'Update'}
              </button>
              
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={loading}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  Delete
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-60">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Confirm Deletion
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this {type.replace('-', ' ')}? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={loading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditModal;
