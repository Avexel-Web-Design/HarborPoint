import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGolfBallTee, 
  faUsers, 
  faCalendarDays, 
  faUtensils 
} from '@fortawesome/free-solid-svg-icons';
import AdminTeeTimes from './AdminTeeTimes';
import AdminEvents from './AdminEvents';
import AdminDining from './AdminDining';
import AdminMembers from './AdminMembers';

type TabType = 'members' | 'tee-times' | 'events' | 'dining';

const UsersIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faUsers} className={className} />
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

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  
  // Initialize active tab from localStorage or URL params, fallback to 'members'
  const getInitialTab = (): TabType => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get('tab') as TabType;
    if (urlTab && ['members', 'tee-times', 'events', 'dining'].includes(urlTab)) {
      return urlTab;
    }
    
    // Check localStorage
    const savedTab = localStorage.getItem('adminDashboardTab') as TabType;
    if (savedTab && ['members', 'tee-times', 'events', 'dining'].includes(savedTab)) {
      return savedTab;
    }
    
    return 'members';
  };

  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);

  // Save tab to localStorage and update URL when tab changes
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    localStorage.setItem('adminDashboardTab', tabId);
    
    // Update URL without refreshing the page
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tabId);
    window.history.replaceState({}, '', url.toString());
  };

  // Clean up invalid values in localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem('adminDashboardTab');
    if (savedTab && !['members', 'tee-times', 'events', 'dining'].includes(savedTab)) {
      localStorage.removeItem('adminDashboardTab');
    }
  }, []);

  // Handle URL parameter changes on initial load and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTab = urlParams.get('tab') as TabType;
      if (urlTab && ['members', 'tee-times', 'events', 'dining'].includes(urlTab)) {
        setActiveTab(urlTab);
        localStorage.setItem('adminDashboardTab', urlTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const tabs = [
    { id: 'members' as TabType, name: 'Members', icon: UsersIcon },
    { id: 'tee-times' as TabType, name: 'Tee Times', icon: GolfBallTeeIcon },
    { id: 'events' as TabType, name: 'Events', icon: CalendarIcon },
    { id: 'dining' as TabType, name: 'Dining', icon: DiningIcon },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <AdminMembers />;
      case 'tee-times':
        return <AdminTeeTimes />;
      case 'events':
        return <AdminEvents />;
      case 'dining':
        return <AdminDining />;
      default:
        return <AdminMembers />;
    }
  };

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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon
                    className={`-ml-0.5 mr-2 h-5 w-5 ${
                      activeTab === tab.id
                        ? 'text-blue-500'
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

export default AdminDashboard;
