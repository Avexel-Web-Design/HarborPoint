import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

interface Member {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  membership_type: string;
  member_id: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface MembersResponse {
  members: Member[];
  total: number;
  page: number;
  limit: number;
}

interface MemberForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  membershipType: string;
  phone: string;
  isActive: boolean;
}

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberForm, setMemberForm] = useState<MemberForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    membershipType: 'Individual',
    phone: '',
    isActive: true
  });
  const [message, setMessage] = useState('');

  const membershipTypes = ['Individual', 'Family', 'Corporate', 'Senior', 'Student'];
  const membersPerPage = 25;

  useEffect(() => {
    loadMembers();
  }, [currentPage, searchTerm]);

  const loadMembers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: membersPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/members?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data: MembersResponse = await response.json();
        setMembers(data.members);
        setTotalMembers(data.total);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(memberForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Member created successfully! Member ID: ${data.memberId}`);
        resetForm();
        setIsCreating(false);
        loadMembers();
      } else {
        setMessage(data.error || 'Failed to create member');
      }
    } catch (error) {
      console.error('Create member error:', error);
      setMessage('Error creating member');
    }
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMember) return;

    try {
      const response = await fetch('/api/admin/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: editingMember.id,
          email: memberForm.email,
          firstName: memberForm.firstName,
          lastName: memberForm.lastName,
          membershipType: memberForm.membershipType,
          phone: memberForm.phone,
          isActive: memberForm.isActive
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Member updated successfully!');
        resetForm();
        setEditingMember(null);
        loadMembers();
      } else {
        setMessage(data.error || 'Failed to update member');
      }
    } catch (error) {
      console.error('Update member error:', error);
      setMessage('Error updating member');
    }
  };

  const handleDeactivateMember = async (memberId: number) => {
    if (!confirm('Are you sure you want to deactivate this member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/members?id=${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Member deactivated successfully');
        loadMembers();
      } else {
        setMessage(data.error || 'Failed to deactivate member');
      }
    } catch (error) {
      console.error('Deactivate member error:', error);
      setMessage('Error deactivating member');
    }
  };

  const startEdit = (member: Member) => {
    setEditingMember(member);
    setMemberForm({
      email: member.email,
      password: '',
      firstName: member.first_name,
      lastName: member.last_name,
      membershipType: member.membership_type,
      phone: member.phone || '',
      isActive: member.is_active
    });
  };

  const resetForm = () => {
    setMemberForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      membershipType: 'Individual',
      phone: '',
      isActive: true
    });
  };

  const totalPages = Math.ceil(totalMembers / membersPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome, {admin?.fullName}
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalMembers}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {members.filter(m => m.is_active).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Family Members</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {members.filter(m => m.membership_type === 'Family').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Corporate Members</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {members.filter(m => m.membership_type === 'Corporate').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Member Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Member Management</h3>
              <button
                onClick={() => setIsCreating(!isCreating)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                {isCreating ? 'Cancel' : 'Add Member'}
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search members by name, email, or member ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Add/Edit Member Form */}
            {(isCreating || editingMember) && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  {editingMember ? 'Edit Member' : 'Add New Member'}
                </h4>
                <form onSubmit={editingMember ? handleUpdateMember : handleCreateMember}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={memberForm.firstName}
                        onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={memberForm.lastName}
                        onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    {!editingMember && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={memberForm.password}
                          onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          required={!editingMember}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={memberForm.phone}
                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Membership Type *
                      </label>
                      <select
                        value={memberForm.membershipType}
                        onChange={(e) => setMemberForm({ ...memberForm, membershipType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      >
                        {membershipTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={memberForm.isActive}
                        onChange={(e) => setMemberForm({ ...memberForm, isActive: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active Member
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setIsCreating(false);
                        setEditingMember(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                      {editingMember ? 'Update Member' : 'Create Member'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Members Table */}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading members...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Membership Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {member.first_name} {member.last_name}
                              </div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                              {member.phone && (
                                <div className="text-sm text-gray-500">{member.phone}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.member_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.membership_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              member.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {member.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {member.last_login 
                              ? new Date(member.last_login).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => startEdit(member)}
                              className="text-primary-600 hover:text-primary-900 mr-3"
                            >
                              Edit
                            </button>
                            {member.is_active && (
                              <button
                                onClick={() => handleDeactivateMember(member.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Deactivate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * membersPerPage + 1} to {Math.min(currentPage * membersPerPage, totalMembers)} of {totalMembers} members
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
