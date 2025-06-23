import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGolfBallTee, 
  faUsers, 
  faCalendarDays, 
  faUtensils,
  faTableTennisPaddleBall
} from '@fortawesome/free-solid-svg-icons';
import AdminTeeTimes from './AdminTeeTimes';
import AdminEvents from './AdminEvents';
import AdminDining from './AdminDining';
import AdminMembers from './AdminMembers';
import AdminTennisCourts from './AdminTennisCourts';

type TabType = 'members' | 'tee-times' | 'tennis-courts' | 'events' | 'dining';

const UsersIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faUsers} className={className} />
);

const GolfBallTeeIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faGolfBallTee} className={className} />
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faCalendarDays} className={className} />
);

const TennisIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faTableTennisPaddleBall} className={className} />
);

const DiningIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faUtensils} className={className} />
);

const AdminDashboard = () => {
  // Initialize active tab from localStorage or URL params, fallback to 'members'
  const getInitialTab = (): TabType => {
    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get('tab') as TabType;    if (urlTab && ['members', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(urlTab)) {
      return urlTab;
    }
    
    // Check localStorage
    const savedTab = localStorage.getItem('adminDashboardTab') as TabType;
    if (savedTab && ['members', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(savedTab)) {
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
    const savedTab = localStorage.getItem('adminDashboardTab');    if (savedTab && !['members', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(savedTab)) {
      localStorage.removeItem('adminDashboardTab');
    }
  }, []);

  // Handle URL parameter changes on initial load and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTab = urlParams.get('tab') as TabType;      if (urlTab && ['members', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(urlTab)) {
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
    { id: 'tennis-courts' as TabType, name: 'Courts', icon: TennisIcon },
    { id: 'events' as TabType, name: 'Events', icon: CalendarIcon },
    { id: 'dining' as TabType, name: 'Dining', icon: DiningIcon },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case 'members':
        return <AdminMembers />;
      case 'tee-times':
        return <AdminTeeTimes />;
      case 'tennis-courts':
        return <AdminTennisCourts />;
      case 'events':
        return <AdminEvents />;
      case 'dining':
        return <AdminDining />;
      default:
        return <AdminMembers />;
    }
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section with Navigation */}
      <section className="relative bg-gradient-to-r from-primary-900 via-primary-950 to-primary-900 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 container-width section-padding py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Admin Dashboard
            </h1>
            <p className="text-xl text-primary-200 font-serif italic">
              Manage Your Club Excellence
            </p>
            <p className="text-primary-300 max-w-2xl mx-auto">
              Access comprehensive tools to oversee member management, tee time scheduling, 
              event coordination, and dining reservations with elegance and efficiency.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <nav className="flex flex-wrap justify-center gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`group inline-flex items-center px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-white text-primary-950 shadow-lg'
                          : 'text-white hover:bg-white/20 hover:text-primary-200'
                      }`}
                    >
                      <Icon
                        className={`-ml-0.5 mr-2 h-5 w-5 ${
                          activeTab === tab.id
                            ? 'text-primary-950'
                            : 'text-primary-300 group-hover:text-primary-200'
                        }`}
                      />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <div className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
