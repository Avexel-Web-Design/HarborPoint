import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faHeart, faHandsHelping, faTree } from '@fortawesome/free-solid-svg-icons';
import communityImage from '../../../images/community.jpg'

const AboutCommunity = () => {
  const communityFeatures = [
    {
      icon: faMapMarkerAlt,
      title: "Prime Location",
      description: "Located in the heart of Northern Michigan, surrounded by the natural beauty of Harbor Springs and the Petoskey area."
    },
    {
      icon: faHeart,
      title: "Community Spirit",
      description: "A close-knit community where lasting friendships are formed and traditions are celebrated year after year."
    },
    {
      icon: faHandsHelping,
      title: "Birchwood Outreach Fund",
      description: "Demonstrating our commitment to the local community through charitable giving and volunteer efforts since 2010."
    },
    {
      icon: faTree,
      title: "Environmental Stewardship",
      description: "Committed to preserving Northern Michigan's natural environment while providing world-class recreational facilities."
    }
  ];

  return (
    <section id="about-community" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Our Community & Location
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nestled in Northern Michigan's most beautiful setting, Birchwood is more than 
            a country club—it's a community dedicated to excellence and giving back.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-serif text-primary-950 mb-6">
                In the Heart of Northern Michigan
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Birchwood Farms is perfectly situated in Harbor Springs, one of Northern Michigan's 
                most charming lakeside communities. Known for natural beauty, small-town charm, 
                and proximity to the famous Tunnel of Trees and Petoskey Stone beaches.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our members enjoy easy access to the region's finest shopping, dining, and 
                cultural attractions, while being surrounded by pristine forests, crystal-clear 
                lakes, and rolling countryside.
              </p>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6">
              <h4 className="text-xl font-serif text-primary-950 mb-3">Location Details</h4>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> 600 Birchwood Drive, Harbor Springs, MI 49740
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> (231) 526-2166
              </p>
            </div>
          </div>

          <div className="relative">
            <img 
              src={communityImage} 
              alt="Birchwood Community" 
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {communityFeatures.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={feature.icon} className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-serif text-primary-950 mb-3">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Birchwood Outreach Fund Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-serif text-primary-950 mb-4">
              Birchwood Outreach Fund
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              The Birchwood Outreach Fund was formed in 2010 by a group of individual members 
              of the Birchwood Farms Golf & Country Club, with the specific objectives of 
              helping local charities and demonstrating Birchwood's commitment to Harbor Springs 
              and the surrounding communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutCommunity;
