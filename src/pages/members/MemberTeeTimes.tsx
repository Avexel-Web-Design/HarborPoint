import { Link } from 'react-router-dom';

const MemberTeeTimes = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container-width section-padding">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900">
                Tee Time Reservations
              </h1>
              <p className="text-gray-600">
                Book your tee times on our championship courses
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <div className="text-4xl mr-4">🏌️</div>
              <div>
                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                  Online Tee Time Booking Coming Soon!
                </h2>
                <p className="text-blue-700">
                  We're working on bringing you the convenience of online tee time reservations. 
                  In the meantime, please call the pro shop to book your tee times.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Book Your Tee Time
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Pro Shop</p>
                  <p className="text-gray-600">(231) 526-2166</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Pro Shop Hours</p>
                  <p className="text-gray-600">7:00 AM - 7:00 PM (Seasonal)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                The Birches
              </h4>
              <p className="text-gray-600 mb-4">
                Our signature 9-hole course featuring tree-lined fairways and challenging water hazards.
              </p>
              <div className="text-sm text-gray-500">
                <p>Par: 36</p>
                <p>Length: 3,200 yards</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                The Farms
              </h4>
              <p className="text-gray-600 mb-4">
                Rolling farmland terrain with strategic bunkering and elevated greens.
              </p>
              <div className="text-sm text-gray-500">
                <p>Par: 36</p>
                <p>Length: 3,150 yards</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                The Woods
              </h4>
              <p className="text-gray-600 mb-4">
                Forested course with natural beauty and challenging shot placement.
              </p>
              <div className="text-sm text-gray-500">
                <p>Par: 36</p>
                <p>Length: 3,100 yards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTeeTimes;
