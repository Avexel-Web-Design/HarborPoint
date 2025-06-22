import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGolfBallTee, 
  faHome, 
  faCalendarDays, 
  faUtensils, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';
import MemberProfile from './Profile';
import MemberEvents from './Events';
import MemberTeeTimes from './TeeTimes';
import MemberDining from './Dining';
import MemberOverview from './Overview';

type TabType = 'overview' | 'profile' | 'tee-times' | 'events' | 'dining';

const HomeIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faHome} className={className} />
);

const GolfBallTeeIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faGolfBallTee} className={className} />
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faCalendarDays} className={className} />
);

const DiningIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faUtensils} className={className} />
);

const UserIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faUser} className={className} />
);

const MemberDashboard = () => {
  const { member, logout } = useAuth();
  
  // Initialize active tab from localStorage or URL params, fallback to 'overview'
  const getInitialTab = (): TabType => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get('tab') as TabType;
    if (urlTab && ['overview', 'profile', 'tee-times', 'events', 'dining'].includes(urlTab)) {
      return urlTab;
    }
    
    // Check localStorage
    const savedTab = localStorage.getItem('memberDashboardTab') as TabType;
    if (savedTab && ['overview', 'profile', 'tee-times', 'events', 'dining'].includes(savedTab)) {
      return savedTab;
    }
    
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  // Save tab to localStorage and update URL when tab changes
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    localStorage.setItem('memberDashboardTab', tabId);
    
    // Update URL without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url.toString());
  };

  // Clean up invalid values in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('memberDashboardTab');
    if (savedTab && !['overview', 'profile', 'tee-times', 'events', 'dining'].includes(savedTab)) {
      localStorage.removeItem('memberDashboardTab');
    }
  }, []);

  // Handle URL parameter changes on initial load and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTab = urlParams.get('tab') as TabType;
      if (urlTab && ['overview', 'profile', 'tee-times', 'events', 'dining'].includes(urlTab)) {
        setActiveTab(urlTab);
        localStorage.setItem('memberDashboardTab', urlTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Listen for tab switch events from Overview component
  useEffect(() => {
    const handleTabSwitch = (event: any) => {
      handleTabChange(event.detail);
    };

    window.addEventListener('switchTab', handleTabSwitch);
    return () => window.removeEventListener('switchTab', handleTabSwitch);
  }, []);

  const tabs = [
    { id: 'overview' as TabType, name: 'Overview', icon: HomeIcon },
    { id: 'tee-times' as TabType, name: 'Tee Times', icon: GolfBallTeeIcon },
    { id: 'events' as TabType, name: 'Events', icon: CalendarIcon },
    { id: 'dining' as TabType, name: 'Dining', icon: DiningIcon },
    { id: 'profile' as TabType, name: 'Profile', icon: UserIcon },
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
              return (                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
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
