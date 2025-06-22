import { useAuth } from '../../contexts/AuthContext';

const MemberProfile = () => {
  const { member } = useAuth();

  return (
    <div className="container-width section-padding py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Account Information
            </h2>
          </div>
            
            <div className="p-6">
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
                    First Name
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    {member?.firstName}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    {member?.lastName}
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
                    Phone
                  </label>
                  <div className="bg-gray-50 p-3 rounded border">
                    {member?.phone || 'Not provided'}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md font-medium cursor-not-allowed"
                  >
                    Edit Profile (Coming Soon)
                  </button>
                  <button
                    disabled
                    className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md font-medium cursor-not-allowed ml-4"
                  >
                    Change Password (Coming Soon)                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    );
};

export default MemberProfile;
