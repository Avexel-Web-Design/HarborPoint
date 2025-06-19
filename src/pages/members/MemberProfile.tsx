import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MemberProfile = () => {
  const { member, logout, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  
  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: member?.firstName || '',
    lastName: member?.lastName || '',
    phone: member?.phone || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  
  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileData({
      firstName: member?.firstName || '',
      lastName: member?.lastName || '',
      phone: member?.phone || ''
    });
    setProfileMessage('');
  };

  const handleProfileSave = async () => {
    setProfileLoading(true);
    setProfileMessage('');
    
    try {
      const success = await updateProfile(profileData);
      if (success) {
        setProfileMessage('Profile updated successfully!');
        setIsEditingProfile(false);
      } else {
        setProfileMessage('Failed to update profile. Please try again.');
      }
    } catch (error) {
      setProfileMessage('An error occurred. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileMessage('');
    setProfileData({
      firstName: member?.firstName || '',
      lastName: member?.lastName || '',
      phone: member?.phone || ''
    });
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters long.');
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage('');
    
    try {
      const success = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (success) {
        setPasswordMessage('Password changed successfully! You will be redirected to login.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        setPasswordMessage('Failed to change password. Please check your current password.');
      }
    } catch (error) {
      setPasswordMessage('An error occurred. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
    setPasswordMessage('');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Member Profile
              </h1>
              <p className="text-gray-600">
                Manage your account information and preferences
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/members/dashboard" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-width section-padding py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Information
              </h2>
            </div>
              <div className="p-6">
              {profileMessage && (
                <div className={`mb-4 p-3 rounded ${
                  profileMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {profileMessage}
                </div>
              )}
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member ID
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    {member?.memberId}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Membership Type
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    {member?.membershipType}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    {member?.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded border">
                      {member?.firstName}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded border">
                      {member?.lastName}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  {isEditingProfile ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                      placeholder="Optional"
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded border">
                      {member?.phone || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Actions
                </h3>
                <div className="space-y-4">
                  {isEditingProfile ? (
                    <div className="flex space-x-4">
                      <button
                        onClick={handleProfileSave}
                        disabled={profileLoading}
                        className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        onClick={handleProfileCancel}
                        disabled={profileLoading}
                        className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleProfileEdit}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                  
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    disabled={isEditingProfile}
                    className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium ml-4"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Modal */}
          {isChangingPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Change Password
                  </h3>
                </div>
                
                <div className="p-6">
                  {passwordMessage && (
                    <div className={`mb-4 p-3 rounded ${
                      passwordMessage.includes('successfully') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {passwordMessage}
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                        minLength={8}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Must be at least 8 characters long
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={handlePasswordCancel}
                      disabled={passwordLoading}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasswordChange}
                      disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
                    >
                      {passwordLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
