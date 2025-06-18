import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const MembershipOverview = () => {
  return (
    <section id="membership-overview" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Membership at Birchwood
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the finest in country club living with access to championship golf, 
            world-class amenities, and an active community of like-minded individuals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-serif text-primary-900">
              Why Choose Birchwood?
            </h3>
            <div className="space-y-4">              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Championship Golf:</strong> Play unlimited golf on our three unique 9-hole courses
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>World-Class Amenities:</strong> Access to fitness center, racquet sports, and pool facilities
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Exceptional Dining:</strong> Enjoy fine dining and social gatherings year-round
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Community Events:</strong> Participate in tournaments, holiday celebrations, and social activities
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h4 className="text-2xl font-serif text-primary-900 mb-6 text-center">
              Membership Benefits Include
            </h4>            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Unlimited golf privileges</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Access to all club facilities</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Participation in club tournaments</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Clubhouse dining privileges</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Special events and celebrations</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Reciprocal privileges with other clubs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipOverview;
