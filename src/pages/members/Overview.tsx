import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGolfBallTee, 
  faCalendarDays, 
  faUtensils, 
  faCog,
  faClock,
  faMapMarkerAlt,
  faCheck,
  faSpinner,
  faTableTennisPaddleBall
} from '@fortawesome/free-solid-svg-icons';

interface EventWithRegistration {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  location?: string;
  cost: number;
  status: string;
  is_registered?: boolean;
  registered_count?: number;
}

const MemberOverview = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithRegistration[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);

  const loadUpcomingEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        // Get only the next 3 upcoming events for the dashboard preview
        const nextEvents = data.events ? data.events.slice(0, 3) : [];
        setUpcomingEvents(nextEvents);
      } else if (response.status === 401) {
        // User not authenticated - this is normal for dashboard protected routes
        console.log('User not authenticated, events will not load');
      } else {
        console.error('Failed to fetch events:', response.status);
      }
    } catch (error) {
      console.error('Failed to load upcoming events:', error);
    } finally {
      setEventsLoading(false);
    }
  };  const quickActions = [
    {
      title: 'Book Tee Time',
      description: 'Reserve your spot on our championship courses',
      tabId: 'tee-times',
      icon: <FontAwesomeIcon icon={faGolfBallTee} />,
      color: 'bg-green-500'
    },
    {
      title: 'Tennis & Pickleball',
      description: 'Book tennis and pickleball courts',
      tabId: 'tennis-courts',
      icon: <FontAwesomeIcon icon={faTableTennisPaddleBall} />,
      color: 'bg-purple-500'
    },
    {
      title: 'Member Events',
      description: 'View and register for upcoming club events',
      tabId: 'events',
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
      color: 'bg-blue-500'
    },
    {
      title: 'Dining Reservations',
      description: 'Make reservations at our clubhouse restaurant',
      tabId: 'dining',
      icon: <FontAwesomeIcon icon={faUtensils} />,
      color: 'bg-orange-500'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      tabId: 'profile',
      icon: <FontAwesomeIcon icon={faCog} />,
      color: 'bg-gray-500'
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
    <div className="container-width section-padding py-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-950 rounded-xl p-8 mb-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-3">
            Welcome to Your Member Portal
          </h2>
          <p className="text-primary-200 text-lg">
            Access all your member benefits and manage your Birchwood experience from here.
          </p>
        </div>
      </div>      {/* Quick Actions */}
      <div className="mb-12">
        <h3 className="text-3xl font-serif font-bold text-primary-950 mb-8 text-center">
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: action.tabId }))}
              className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary-200 group text-left hover:scale-105 hover:bg-white"
            >
              <div className="text-4xl mb-4 text-primary-600">{action.icon}</div>
              <h4 className="font-serif font-bold text-primary-950 mb-3 group-hover:text-primary-700 text-lg">
                {action.title}
              </h4>
              <p className="text-sm text-primary-600 leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>      <div className="grid lg:grid-cols-2 gap-8">
        {/* Membership Benefits */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-primary-200">
          <h3 className="text-2xl font-serif font-bold text-primary-950 mb-6">
            Your Membership Benefits
          </h3>
          <ul className="space-y-4">
            {membershipBenefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-6 h-6 text-green-600 mr-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-primary-800 font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Events Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-primary-200">
          <h3 className="text-2xl font-serif font-bold text-primary-950 mb-6">
            Upcoming Club Events
          </h3>          {eventsLoading ? (
            <div className="text-center p-8">
              <div className="text-4xl mb-2 text-primary-600">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              </div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <div key={event.id || index} className="border-l-4 border-primary-500 pl-6 py-4 bg-primary-50/50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-serif font-bold text-primary-950 text-lg">{event.title}</h4>
                      <p className="text-sm text-primary-700 mt-2 leading-relaxed">{event.description}</p>                      <div className="flex items-center mt-3 text-sm text-primary-600 space-x-6">                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faCalendarDays} className="mr-1" /> 
                          {(() => {
                            // Parse date string manually to avoid timezone issues
                            const [year, month, day] = event.date.split('-').map(Number);
                            const date = new Date(year, month - 1, day);
                            return date.toLocaleDateString();
                          })()}
                        </span>
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faClock} className="mr-1" /> 
                          {event.time}
                        </span>
                        <span className="flex items-center">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" /> 
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-primary-900">
                        {event.cost > 0 ? `$${event.cost}` : 'Free'}
                      </span>                      {event.is_registered ? (
                        <div className="text-sm text-green-700 mt-2 font-medium flex items-center">
                          <FontAwesomeIcon icon={faCheck} className="mr-1" /> 
                          Registered
                        </div>
                      ) : (
                        <div className="text-sm text-primary-600 mt-2">Not registered</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-6 border-t border-primary-200">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'events' }))}
                  className="btn-primary"
                >
                  View All Events
                </button>
              </div>
            </div>          ) : (
            <div className="text-center p-8">
              <div className="text-4xl mb-4 text-primary-600">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              <h4 className="font-serif font-bold text-primary-950 mb-2 text-lg">No upcoming events</h4>
              <p className="text-sm text-primary-700 mb-6 leading-relaxed">Check back soon for new events and tournaments</p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('switchTab', { detail: 'events' }))}
                className="btn-primary"
              >
                View All Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;
