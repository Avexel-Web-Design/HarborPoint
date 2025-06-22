import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

const MemberDashboard = () => {
  const { member, logout } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState<EventWithRegistration[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    loadUpcomingEvents();
  }, []);  const loadUpcomingEvents = async () => {
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
  };

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
    },    {
      title: 'Dining Reservations',
      description: 'Make reservations at our clubhouse restaurant',
      link: '/members/dining',
      icon: '🍽️',
      color: 'bg-orange-500'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      link: '/members/profile',
      icon: '⚙️',
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
        </div>        {/* Upcoming Events Preview */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
            Upcoming Club Events
          </h3>          {eventsLoading ? (
            <div className="text-center p-8">
              <div className="text-4xl mb-2">⏳</div>
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={event.id || index} className="border-l-4 border-primary-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span className="mr-4">📅 {new Date(event.date).toLocaleDateString()}</span>
                        <span className="mr-4">🕐 {event.time}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                    <div className="text-right">                      <span className="text-xs text-gray-500">
                        {event.cost > 0 ? `$${event.cost}` : 'Free'}
                      </span>
                      {event.is_registered ? (
                        <div className="text-xs text-green-600 mt-1">✓ Registered</div>
                      ) : (
                        <div className="text-xs text-gray-400 mt-1">Not registered</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-4 border-t">
                <Link 
                  to="/members/events"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  View All Events
                </Link>
              </div>
            </div>          ) : (
            <div className="text-center p-8">
              <div className="text-4xl mb-2">📅</div>
              <h4 className="font-semibold text-gray-900 mb-1">No upcoming events</h4>
              <p className="text-sm text-gray-600 mb-4">Check back soon for new events and tournaments</p>
              <Link 
                to="/members/events"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium"
              >
                View All Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
