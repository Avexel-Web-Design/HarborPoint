import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const { member, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  const quickActions = [
    {
      title: 'Book Tee Time',
      description: 'Reserve your spot on our championship courses',
      link: '/members/tee-times',
      icon: '🏌️',
      color: 'bg-green-500'
    },
    {
      title: 'Member Events',
      description: 'View and register for upcoming club events',
      link: '/members/events',
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      title: 'Dining Reservations',
      description: 'Make reservations at our clubhouse restaurant',
      link: '#',
      icon: '🍽️',
      color: 'bg-orange-500'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      link: '/members/profile',
      icon: '⚙️',
      color: 'bg-gray-500'
    },
    {
      title: 'Guest Passes',
      description: 'Generate guest passes for friends and family',
      link: '#',
      icon: '🎫',
      color: 'bg-purple-500'
    },
    {
      title: 'Billing & Payments',
      description: 'View statements and manage payment methods',
      link: '#',
      icon: '💳',
      color: 'bg-indigo-500'
    }
  ];

  const membershipBenefits = [
    'Unlimited golf on all three courses',
    'Priority tee time reservations',
    'Clubhouse dining privileges',
    'Access to fitness center and pool',
    'Participation in member tournaments',
    'Reciprocal club privileges'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Welcome, {member?.firstName}!
              </h1>
              <p className="text-gray-600">
                {member?.membershipType} Member • ID: {member?.memberId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Main Site
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
        {/* Welcome Section */}
        <div className="bg-primary-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-serif font-bold text-primary-900 mb-2">
            Welcome to Your Member Portal
          </h2>
          <p className="text-primary-700">
            Access all your member benefits and manage your Birchwood experience from here.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 group"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Membership Benefits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
              Your Membership Benefits
            </h3>
            <ul className="space-y-3">
              {membershipBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-600">Account created</span>
                <span className="text-gray-400">Today</span>
              </div>
              <div className="text-sm text-gray-500">
                No recent activity. Start exploring your member benefits!
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
            Coming Soon
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🏌️‍♂️</div>
              <h4 className="font-semibold text-gray-900 mb-1">Online Tee Times</h4>
              <p className="text-sm text-gray-600">Book your tee times online</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="font-semibold text-gray-900 mb-1">Tournament Registration</h4>
              <p className="text-sm text-gray-600">Sign up for member tournaments</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📱</div>
              <h4 className="font-semibold text-gray-900 mb-1">Mobile App</h4>
              <p className="text-sm text-gray-600">Access your account on the go</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
