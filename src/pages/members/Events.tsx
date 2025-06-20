import { Link } from 'react-router-dom';

const MemberEvents = () => {
  const upcomingEvents = [
    {
      title: 'Member-Guest Tournament',
      date: 'July 15-16, 2025',
      description: 'Annual two-day tournament for members and their guests',
      status: 'Registration Open'
    },
    {
      title: 'Summer Solstice Dinner',
      date: 'June 21, 2025',
      description: 'Elegant dinner celebration on the longest day of the year',
      status: 'Coming Soon'
    },
    {
      title: 'Junior Golf Camp',
      date: 'July 8-12, 2025',
      description: 'Week-long golf instruction for young members',
      status: 'Registration Open'
    },
    {
      title: 'Wine Tasting Evening',
      date: 'August 5, 2025',
      description: 'Featuring wines from Michigan vineyards',
      status: 'Save the Date'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Member Events
              </h1>
              <p className="text-gray-600">
                Stay up to date with club tournaments and social events
              </p>
            </div>
            <Link 
              to="/members/dashboard" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container-width section-padding py-8">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-4xl mr-4">📅</div>
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
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Upcoming Events
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {event.title}
                      </h3>
                      <p className="text-primary-600 font-medium mb-2">
                        {event.date}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {event.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'Registration Open' 
                          ? 'bg-green-100 text-green-800'
                          : event.status === 'Coming Soon'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                  <p className="font-medium text-gray-900">Events Coordinator</p>
                  <p className="text-gray-600">events@birchwoodcc.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberEvents;
