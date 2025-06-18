import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface GuestPass {
  id: number;
  guest_name: string;
  guest_email?: string;
  visit_date: string;
  pass_code: string;
  status: string;
  created_at: string;
  expires_at: string;
}

interface GuestPassForm {
  guestName: string;
  guestEmail: string;
  visitDate: string;
}

const MemberGuestPasses = () => {
  const [guestPasses, setGuestPasses] = useState<GuestPass[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passForm, setPassForm] = useState<GuestPassForm>({
    guestName: '',
    guestEmail: '',
    visitDate: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadGuestPasses();
  }, []);

  const loadGuestPasses = async () => {
    try {
      const response = await fetch('/api/guest-passes', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setGuestPasses(data.guestPasses || []);
      }
    } catch (error) {
      console.error('Error loading guest passes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passForm.guestName || !passForm.visitDate) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('/api/guest-passes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(passForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Guest pass created successfully! Pass code: ${data.passCode}`);
        setPassForm({
          guestName: '',
          guestEmail: '',
          visitDate: ''
        });
        setIsCreating(false);
        loadGuestPasses();
      } else {
        setMessage(data.error || 'Failed to create guest pass');
      }
    } catch (error) {
      console.error('Creation error:', error);
      setMessage('Error creating guest pass');
    }
  };

  const handleRevokePass = async (passId: number) => {
    if (!confirm('Are you sure you want to revoke this guest pass?')) {
      return;
    }

    try {
      const response = await fetch(`/api/guest-passes?id=${passId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Guest pass revoked successfully');
        loadGuestPasses();
      } else {
        setMessage(data.error || 'Failed to revoke guest pass');
      }
    } catch (error) {
      console.error('Revoke error:', error);
      setMessage('Error revoking guest pass');
    }
  };

  const copyPassCode = (passCode: string) => {
    navigator.clipboard.writeText(passCode);
    setMessage('Pass code copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Guest Passes
              </h1>
              <p className="text-gray-600">
                Generate access passes for your guests
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
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') || message.includes('copied') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-xl font-serif font-bold text-gray-900">Your Guest Passes</h2>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
            >
              {isCreating ? 'Cancel' : 'Create Guest Pass'}
            </button>
          </div>

          {/* Creation Form */}
          {isCreating && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Guest Pass</h3>
              <form onSubmit={handleCreatePass} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      value={passForm.guestName}
                      onChange={(e) => setPassForm({ ...passForm, guestName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={passForm.guestEmail}
                      onChange={(e) => setPassForm({ ...passForm, guestEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Date *
                  </label>
                  <input
                    type="date"
                    value={passForm.visitDate}
                    onChange={(e) => setPassForm({ ...passForm, visitDate: e.target.value })}
                    min={minDate}
                    max={maxDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
                  >
                    Create Guest Pass
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Current Guest Passes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Guest Passes</h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : guestPasses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎫</div>
                  <p className="text-gray-500 mb-4">No guest passes created</p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Create your first guest pass
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {guestPasses.map((pass) => (
                    <div key={pass.id} className={`border rounded-lg p-4 ${isExpired(pass.expires_at) ? 'border-gray-200 bg-gray-50' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {pass.guest_name}
                            </h4>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              pass.status === 'active' && !isExpired(pass.expires_at)
                                ? 'bg-green-100 text-green-800'
                                : pass.status === 'revoked'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {pass.status === 'active' && !isExpired(pass.expires_at) ? 'Active' : 
                               pass.status === 'revoked' ? 'Revoked' : 'Expired'}
                            </span>
                          </div>
                          <div className="text-gray-600 space-y-1">
                            <p className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              Visit Date: {formatDate(pass.visit_date)}
                            </p>
                            {pass.guest_email && (
                              <p className="flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                {pass.guest_email}
                              </p>
                            )}
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 8A6 6 0 006 8c0 7-3 9-3 9s18 0 18-9z" clipRule="evenodd" />
                              </svg>
                              <span className="font-mono text-lg font-bold text-primary-600">
                                {pass.pass_code}
                              </span>
                              <button
                                onClick={() => copyPassCode(pass.pass_code)}
                                className="text-primary-600 hover:text-primary-800 text-sm"
                                title="Copy pass code"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11.586l-3-3a1 1 0 00-1.414 1.414L11.586 11H9a1 1 0 100 2h2.586l-1 1a1 1 0 001.414 1.414l3-3z" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-sm text-gray-500">
                              Expires: {new Date(pass.expires_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {pass.status === 'active' && !isExpired(pass.expires_at) && (
                          <button
                            onClick={() => handleRevokePass(pass.id)}
                            className="text-red-600 hover:text-red-800 font-medium ml-4"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guest Pass Information */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Pass Information</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How Guest Passes Work</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Guest passes are valid for the specified visit date</li>
                  <li>Each pass includes a unique code that guests present at the gate</li>
                  <li>Passes expire 24 hours after the visit date</li>
                  <li>You can revoke a pass at any time before expiration</li>
                  <li>Guests must be accompanied by a member or have advance arrangements</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Guest Privileges</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Access to clubhouse facilities</li>
                  <li>Dining privileges (with member)</li>
                  <li>Golf course access (with member)</li>
                  <li>Pool and fitness center access (with member)</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h5 className="font-medium text-yellow-800">Important</h5>
                    <p className="text-sm text-yellow-700">
                      Please inform guests to bring valid photo ID and provide them with the pass code. 
                      Lost or forgotten codes may result in denied access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberGuestPasses;
