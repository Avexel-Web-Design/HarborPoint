import { useState, useEffect } from 'react';
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
  memberId: string;
  phone: string;
  isActive: boolean;
}

const AdminMembers = () => {
  const { } = useAdminAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);  const [memberForm, setMemberForm] = useState<MemberForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    membershipType: 'general',
    memberId: '',
    phone: '',
    isActive: true
  });
  const [message, setMessage] = useState('');
  
  const membersPerPage = 10;

  useEffect(() => {
    loadMembers();
  }, [currentPage, searchTerm]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: membersPerPage.toString(),
      });
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/members?${params}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data: MembersResponse = await response.json();
        setMembers(data.members || []);
        setTotalMembers(data.total || 0);
      } else {
        setMessage('Failed to load members');
      }
    } catch (error) {
      console.error('Error loading members:', error);
      setMessage('Error loading members');
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {    setMemberForm({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      membershipType: 'general',
      memberId: '',
      phone: '',
      isActive: true
    });
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
  };  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingMember) return;

    // Check if Member ID has been changed
    if (memberForm.memberId !== editingMember.member_id) {
      const confirmMessage = `⚠️ WARNING: You are about to change the Member ID from "${editingMember.member_id}" to "${memberForm.memberId}"\n\nThis may break:\n- Existing tee time reservations\n- Dining bookings\n- Tennis court reservations\n- Event registrations\n- Guest passes\n- Other linked data\n\nThis action could cause data inconsistencies and should only be done if absolutely necessary.\n\nAre you sure you want to proceed with this change?`;
      
      if (!confirm(confirmMessage)) {
        return;
      }
    }

    try {
      const response = await fetch('/api/admin/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },        credentials: 'include',
        body: JSON.stringify({
          id: editingMember.id,
          email: memberForm.email,
          firstName: memberForm.firstName,
          lastName: memberForm.lastName,
          membershipType: memberForm.membershipType,
          memberId: memberForm.memberId,
          phone: memberForm.phone,
          isActive: editingMember.is_active, // Preserve current active status
          password: memberForm.password // Include password in update request
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Member updated successfully!');
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
    if (!confirm('Are you sure you want to deactivate this member?')) return;

    try {
      const response = await fetch(`/api/admin/members?id=${memberId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Member deactivated successfully!');
        loadMembers();
      } else {
        setMessage(data.error || 'Failed to deactivate member');
      }
    } catch (error) {
      console.error('Deactivate member error:', error);
      setMessage('Error deactivating member');
    }
  };

  const handleActivateMember = async (member: Member) => {
    if (!confirm('Are you sure you want to activate this member?')) return;

    try {
      const response = await fetch('/api/admin/members', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id: member.id,
          email: member.email,
          firstName: member.first_name,
          lastName: member.last_name,
          membershipType: member.membership_type,
          phone: member.phone,
          isActive: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Member activated successfully!');
        loadMembers();
      } else {
        setMessage(data.error || 'Failed to activate member');
      }
    } catch (error) {
      console.error('Activate member error:', error);
      setMessage('Error activating member');
    }
  };
  const handleDeleteMember = async (member: Member) => {
    const confirmMessage = `Are you sure you want to PERMANENTLY DELETE ${member.first_name} ${member.last_name}?\n\nThis will:\n- Delete the member account completely\n- Remove ALL their reservations (tee times, dining, courts)\n- Remove ALL their event registrations\n- Remove ALL their guest passes\n- Delete ALL their data permanently\n\nThis action CANNOT be undone!\n\nType "DELETE" to confirm:`;
    
    const confirmation = prompt(confirmMessage);
    if (confirmation !== 'DELETE') {
      return;
    }

    try {
      const response = await fetch(`/api/admin/members/delete?id=${member.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Member permanently deleted successfully!');
        setEditingMember(null);
        resetForm();
        loadMembers();
      } else {
        setMessage(data.error || 'Failed to delete member');
      }
    } catch (error) {
      console.error('Delete member error:', error);
      setMessage('Error deleting member');
    }
  };
  const startEdit = (member: Member) => {
    setEditingMember(member);    setMemberForm({
      email: member.email,
      password: '',
      firstName: member.first_name,
      lastName: member.last_name,
      membershipType: member.membership_type,
      memberId: member.member_id,
      phone: member.phone || '',
      isActive: true // Default value, not used in editing
    });
  };

  const totalPages = Math.ceil(totalMembers / membersPerPage);

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="container-width section-padding py-12">
        {message && (
          <div className={`mb-8 p-4 rounded-lg shadow-sm ${message.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Members Management */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-lg border border-primary-200">
          <div className="px-6 py-8 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-serif font-bold text-primary-950">
                  Members Management
                </h3>
                <p className="text-primary-700 mt-1">
                  Manage club member accounts and memberships
                </p>
              </div>
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary"
              >
                Add New Member
              </button>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members by name, email, or member ID..."                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Create/Edit Form */}
            {(isCreating || editingMember) && (
              <div className="mb-8 p-6 border border-primary-200 rounded-lg bg-gradient-to-r from-primary-50 to-white">
                <h4 className="text-xl font-serif font-bold text-primary-950 mb-6">
                  {isCreating ? 'Create New Member' : 'Edit Member'}
                </h4>
                <form onSubmit={isCreating ? handleCreateMember : handleUpdateMember} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-2">Email</label>
                      <input
                        type="email"
                        value={memberForm.email}
                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>
                    
                    {isCreating && (
                      <div>
                        <label className="block text-sm font-medium text-primary-900 mb-2">Password</label>
                        <input
                          type="password"
                          value={memberForm.password}
                          onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                          required
                        />
                      </div>
                    )}

                    {editingMember && (
                      <div>
                        <label className="block text-sm font-medium text-primary-900 mb-2">
                          New Password <span className="text-primary-600 font-normal">(leave blank to keep current password)</span>
                        </label>
                        <input
                          type="password"
                          value={memberForm.password}
                          onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                          className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                          placeholder="Enter new password or leave blank"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-2">First Name</label>
                      <input
                        type="text"                        value={memberForm.firstName}
                        onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={memberForm.lastName}
                        onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-2">Membership Type</label>
                      <select
                        value={memberForm.membershipType}
                        onChange={(e) => setMemberForm({ ...memberForm, membershipType: e.target.value })}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                      >
                        <option value="general">General</option>
                        <option value="property">Property</option>
                        <option value="social">Social</option>                        <option value="associate">Associate</option>
                        <option value="junior">Junior</option>
                        <option value="emeritus">Emeritus</option>
                      </select>
                    </div>                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-2">
                        Member ID {isCreating && <span className="text-primary-600 font-normal">(leave blank to auto-generate)</span>}
                      </label>
                      <input
                        type="text"
                        value={memberForm.memberId}
                        onChange={(e) => setMemberForm({ ...memberForm, memberId: e.target.value })}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                        placeholder={isCreating ? "Auto-generated if left blank" : "Enter custom Member ID"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-primary-900 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={memberForm.phone}                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/70 backdrop-blur-sm"
                      />
                    </div>                  </div>

                  {/* Danger Zone for Editing Members */}
                  {editingMember && (
                    <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="text-lg font-medium text-red-900 mb-3">Danger Zone</h5>
                      <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-800">
                              <strong>Permanent Deletion:</strong> This will completely remove the member and ALL associated data including reservations, event registrations, and guest passes. This action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => editingMember && handleDeleteMember(editingMember)}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                      >
                        Permanently Delete Member
                      </button>
                    </div>
                  )}

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {isCreating ? 'Create Member' : 'Update Member'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingMember(null);
                        resetForm();
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Members List */}
            {!loading && (
              <>
                <div className="overflow-hidden shadow-xl ring-1 ring-primary-200 ring-opacity-50 rounded-lg">
                  <table className="min-w-full divide-y divide-primary-200">
                    <thead className="bg-gradient-to-r from-primary-950 to-primary-900 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider font-serif">
                          Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider font-serif">
                          Member ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider font-serif">
                          Membership                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider font-serif">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider font-serif">
                          Last Login
                        </th>
                        <th className="relative px-6 py-4">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-primary-200">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-primary-50/50 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-primary-900 font-serif">
                                  {member.first_name} {member.last_name}
                                </div>
                                <div className="text-sm text-primary-600">{member.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 font-medium">
                            {member.member_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 capitalize">
                            {member.membership_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              member.is_active 
                                ? 'bg-green-100 text-green-800 border border-green-200' 
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {member.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-700">
                            {member.last_login 
                              ? new Date(member.last_login).toLocaleDateString()
                              : 'Never'
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => startEdit(member)}
                              className="text-primary-600 hover:text-primary-800 mr-4 px-3 py-1 rounded-md hover:bg-primary-100 transition-colors duration-200"
                            >                              Edit
                            </button>
                            {member.is_active ? (
                              <button
                                onClick={() => handleDeactivateMember(member.id)}
                                className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-100 transition-colors duration-200"
                              >
                                Deactivate
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActivateMember(member)}
                                className="text-green-600 hover:text-green-800 px-3 py-1 rounded-md hover:bg-green-100 transition-colors duration-200"
                              >
                                Activate
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteMember(member)}
                              className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-100 transition-colors duration-200"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-primary-200">
                    <div className="text-sm text-primary-700 font-medium">
                      Showing {(currentPage - 1) * membersPerPage + 1} to {Math.min(currentPage * membersPerPage, totalMembers)} of {totalMembers} members
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm border border-primary-300 rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-primary-900 transition-colors duration-200"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-sm text-primary-900 font-serif font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm border border-primary-300 rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-primary-900 transition-colors duration-200"
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

export default AdminMembers;
