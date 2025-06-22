import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, User, Car, UtensilsCrossed, Home } from 'lucide-react';
import MemberProfile from './Profile';
import MemberEvents from './Events';
import MemberTeeTimes from './TeeTimes';
import MemberDining from './Dining';
import MemberOverview from './Overview';

type TabType = 'overview' | 'profile' | 'tee-times' | 'events' | 'dining';

const MemberDashboard = () => {
  const { member, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  // Listen for tab switch events from Overview component
  useEffect(() => {
    const handleTabSwitch = (event: any) => {
      setActiveTab(event.detail);
    };

    window.addEventListener('switchTab', handleTabSwitch);
    return () => window.removeEventListener('switchTab', handleTabSwitch);
  }, []);

  const tabs = [
    { id: 'overview' as TabType, name: 'Overview', icon: Home },
    { id: 'tee-times' as TabType, name: 'Tee Times', icon: Car },
    { id: 'events' as TabType, name: 'Events', icon: Calendar },
    { id: 'dining' as TabType, name: 'Dining', icon: UtensilsCrossed },
    { id: 'profile' as TabType, name: 'Profile', icon: User },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <MemberOverview />;
      case 'profile':
        return <MemberProfile />;
      case 'tee-times':
        return <MemberTeeTimes />;
      case 'events':
        return <MemberEvents />;
      case 'dining':
        return <MemberDining />;
      default:
        return <MemberOverview />;
    }
  };

  const handleLogout = async () => {
    await logout();
  };

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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-width section-padding">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon
                    className={`-ml-0.5 mr-2 h-5 w-5 ${
                      activeTab === tab.id
                        ? 'text-primary-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MemberDashboard;
