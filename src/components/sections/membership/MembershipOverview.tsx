import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const MembershipOverview = () => {
  return (
    <section id="membership-overview" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Membership at Harbor Point
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the finest in classic resort golf with access to our championship course, 
            elegant clubhouse dining, and an active golf community in Harbor Springs, Michigan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-serif text-primary-900">
              Why Choose Harbor Point?
            </h3>
            <div className="space-y-4">              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Classic Resort Course:</strong> Play on our championship 18-hole course with spectacular Lake Michigan views
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Elegant Clubhouse:</strong> Enjoy fine dining, social events, and the 19th Hole Bar
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Professional Instruction:</strong> Learn from PGA Professional Shaun Bezilla
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                </div>
                <p className="text-gray-700">
                  <strong>Tradition & History:</strong> Play one of Northern Michigan's oldest courses, established in 1896
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
                <span className="text-gray-700">Golf privileges (cart fees apply)</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Clubhouse dining access</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Golf tournaments and events</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Summer Suppers tradition</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Private event hosting</span>
              </div>
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-primary-600" />
                <span className="text-gray-700">Pro shop shopping privileges</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipOverview;
