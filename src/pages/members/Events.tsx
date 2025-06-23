import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarDays, 
  faClock,
  faMapMarkerAlt,
  faCheck,
  faSpinner
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

const MemberEvents = () => {
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
        // Show all events in the Events tab
        setUpcomingEvents(data.events || []);
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
  return (
    <div className="container-width section-padding py-8">
      <div className="max-w-4xl mx-auto">{/* Coming Soon Notice */}          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-4xl mr-4 text-yellow-600">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-yellow-900 mb-2">
                  Event Registration Coming Soon!
                </h2>
                <p className="text-yellow-700">
                  Online event registration and calendar integration are in development. 
                  Contact the clubhouse to register for events.
                </p>
              </div>
            </div>
          </div>{/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>
            </div>
            
            {eventsLoading ? (
              <div className="text-center p-8">
                <div className="text-4xl mb-2 text-primary-600">
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                </div>
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {upcomingEvents.map((event, index) => (
                  <div key={event.id || index} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {event.title}
                        </h3>                        <div className="flex items-center text-primary-600 font-medium mb-2">                          <span className="mr-4 flex items-center">
                            <FontAwesomeIcon icon={faCalendarDays} className="mr-1" />
                            {(() => {
                              // Parse date string manually to avoid timezone issues
                              const [year, month, day] = event.date.split('-').map(Number);
                              const date = new Date(year, month - 1, day);
                              return date.toLocaleDateString();
                            })()}
                          </span>
                          <span className="mr-4 flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                            {event.time}
                          </span>
                          {event.location && (
                            <span className="flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                              {event.location}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">
                          {event.description}
                        </p>
                        <div className="text-sm text-gray-500">
                          Cost: {event.cost > 0 ? `$${event.cost}` : 'Free'}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                          event.status === 'open' 
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'closed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status === 'open' ? 'Registration Open' : 
                           event.status === 'closed' ? 'Registration Closed' : 
                           event.status}
                        </span>                        {event.is_registered ? (
                          <div className="text-sm text-green-600 flex items-center">
                            <FontAwesomeIcon icon={faCheck} className="mr-1" />
                            Registered
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">Not registered</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>            ) : (
              <div className="text-center p-8">
                <div className="text-4xl mb-2 text-primary-600">
                  <FontAwesomeIcon icon={faCalendarDays} />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">No upcoming events</h4>
                <p className="text-gray-600">Check back soon for new events and tournaments</p>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Event Registration & Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Clubhouse</p>
                  <p className="text-gray-600">(231) 526-2166</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Events Coordinator</p>                  <p className="text-gray-600">events@birchwoodcc.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>      </div>
    );
};

export default MemberEvents;
