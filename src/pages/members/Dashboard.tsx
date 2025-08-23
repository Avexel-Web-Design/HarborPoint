import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGolfBallTee, 
  faHome, 
  faCalendarDays, 
  faUtensils, 
  faUser,
  faTableTennisPaddleBall,
  faExternalLinkAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import MemberProfile from './Profile';
import MemberEvents from './Events';
import MemberTeeTimes from './TeeTimes';
import MemberDining from './Dining';
import MemberOverview from './Overview';
import MemberTennisCourts from './TennisCourts';

type TabType = 'overview' | 'profile' | 'tee-times' | 'tennis-courts' | 'events' | 'dining';

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

const TennisIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faTableTennisPaddleBall} className={className} />
);

const UserIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faUser} className={className} />
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faExternalLinkAlt} className={className} />
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <FontAwesomeIcon icon={faSignOutAlt} className={className} />
);

const MemberDashboard = () => {
  const { member, logout } = useAuth();
  
  // Initialize active tab from localStorage or URL params, fallback to 'overview'
  const getInitialTab = (): TabType => {    // Check URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const urlTab = urlParams.get('tab') as TabType;
    if (urlTab && ['overview', 'profile', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(urlTab)) {
      return urlTab;
    }
    
    // Check localStorage
    const savedTab = localStorage.getItem('memberDashboardTab') as TabType;
    if (savedTab && ['overview', 'profile', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(savedTab)) {
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
    if (savedTab && !['overview', 'profile', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(savedTab)) {
      localStorage.removeItem('memberDashboardTab');
    }
  }, []);

  // Handle URL parameter changes on initial load and browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTab = urlParams.get('tab') as TabType;
      if (urlTab && ['overview', 'profile', 'tee-times', 'tennis-courts', 'events', 'dining'].includes(urlTab)) {
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
    { id: 'tennis-courts' as TabType, name: 'Courts', icon: TennisIcon },
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
      case 'tennis-courts':
        return <MemberTennisCourts />;
      case 'events':
        return <MemberEvents />;
      case 'dining':
        return <MemberDining />;      default:
        return <MemberOverview />;
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
              Welcome, {member?.firstName}!
            </h1>
            <p className="text-xl text-primary-200 font-serif italic">
              Your Harbor Point Experience
            </p>
            <p className="text-primary-300 max-w-2xl mx-auto">
              {member?.membershipType} Member • ID: {member?.memberId}
            </p>
            <p className="text-primary-300 max-w-2xl mx-auto">
              Access your personalized dashboard to manage tee times, view upcoming events, 
              make dining reservations, and stay connected with your club community.
            </p>
          </div>          {/* Navigation Tabs */}
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
                  );                })}
                
                {/* Action Buttons at the very end */}
                <Link
                  to="/"
                  className="group inline-flex items-center px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 text-white hover:bg-white/20 hover:text-primary-200"
                >
                  <ExternalLinkIcon
                    className="-ml-0.5 mr-2 h-5 w-5 text-primary-300 group-hover:text-primary-200"
                  />
                  Main Site
                </Link>
                <button
                  onClick={logout}
                  className="group inline-flex items-center px-6 py-3 rounded-md font-medium text-sm transition-all duration-300 text-white hover:bg-white/20 hover:text-primary-200"
                >
                  <LogoutIcon
                    className="-ml-0.5 mr-2 h-5 w-5 text-primary-300 group-hover:text-primary-200"
                  />
                  Logout
                </button>
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

export default MemberDashboard;
