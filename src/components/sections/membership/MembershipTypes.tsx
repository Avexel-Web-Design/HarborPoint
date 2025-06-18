import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const MembershipTypes = () => {
  const membershipTypes = [
    {
      id: 'general',
      title: 'General Membership',
      subtitle: 'Provides Privileges for All of the Club\'s Amenities & Services',
      description: 'Birchwood offers our premier General Membership, which includes unlimited golf, participation in all Club Tournaments, and unlimited use of all facilities including world-class Racquets Facilities, Fitness Center, Clubhouse dining and social activities. Enjoy holiday gatherings with family and friends including Fourth of July, Thanksgiving and Festive Holiday Celebrations.',
      features: [
        'Members play Golf at Cart Fee Only',
        'No Spending Requirements or Dining Minimums',
        'No Commitment Period so long as Membership Application Fee is Paid',
        'Full voting privileges',
        'Priority tee times',
        'Guest privileges'
      ],
      highlight: true
    },
    {
      id: 'property',
      title: 'Property Ownership',
      subtitle: 'Provides Privileges for All of the Club\'s Amenities & Services',
      description: 'Birchwood offers real estate opportunities unrivaled anywhere within the greater northern Michigan area. Every home/condominium and homesite (building site) includes a Birchwood full golfing membership and transfers with the sale or resale of the property. With a purchase of a home, you and your family will enjoy access to luxurious amenities and unlimited use of all facilities.',
      features: [
        'Property Owners play Unlimited Golf at Cart Fee Only',
        'No Residency Requirements',
        'No Spending Requirements or Dining Minimums',
        'Membership transfers with property',
        'Access to three 9-hole Jerry Mathews designed Golf Courses',
        'Full use of Racquets Programs and Fitness Center'
      ]
    },
    {
      id: 'social',
      title: 'Social Membership',
      subtitle: 'Provides Privileges for All of the Club\'s Amenities & Services Excluding Golf',
      description: 'Perfect for those who want to enjoy all of Birchwood\'s amenities and social activities without golf privileges. Access to dining, fitness, racquet sports, and all club events.',
      features: [
        'Annual Membership Fee, No Monthly Dues',
        'No Spending Requirements or Dining Minimums',
        'No Commitment Period',
        'Access to all facilities except golf',
        'Full dining and social privileges',
        'Participation in club events'
      ]
    },
    {
      id: 'associate',
      title: 'Associate Membership',
      subtitle: 'Provides Privileges for All of the Club\'s Services and Amenities',
      description: 'Available to Sponsored Family Members of Current Voting Members of the Association.',
      features: [
        'No Membership Fee, Monthly Dues Only',
        'Members Play Golf at Cart Fee Only',
        'No Spending Requirements or Dining Minimums',
        'No Commitment Period',
        'Must be sponsored by current voting member',
        'Full facility access'
      ]
    },
    {
      id: 'junior',
      title: 'Junior Membership',
      subtitle: 'Provides Privileges for All of the Club\'s Amenities & Services',
      description: 'Birchwood offers our premier Junior Membership, which includes unlimited golf, participation in all Club Tournaments, and unlimited use of all facilities including world-class Racquets Facilities, Fitness Center, Clubhouse dining and social activities.',
      features: [
        'Junior Members play Golf at Cart Fee Only',
        'Discounted Monthly Dues Based on Age',
        'Membership Application Fee may be paid in installments',
        'No Spending Requirements or Dining Minimums',
        'Age-based pricing structure',
        'Full tournament participation'
      ]
    },
    {
      id: 'emeritus',
      title: 'Emeritus Membership',
      subtitle: 'Provides Privileges for All of the Club\'s Services and Amenities',
      description: 'Available to Former Voting Members of the Association Who Left the Club in Good Standing.',
      features: [
        'No Initiation Fee, Monthly Dues Only',
        'Members Play Golf at Cart Fee Only',
        'No Spending Requirements or Dining Minimums',
        'No Commitment Period',
        'Must be former member in good standing',
        'Full facility privileges restored'
      ]
    }
  ];

  return (
    <section id="membership-types" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Membership Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the membership that best fits your lifestyle and needs
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {membershipTypes.map((membership) => (
            <div 
              key={membership.id}
              className={`
                relative p-8 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl
                ${membership.highlight 
                  ? 'bg-primary-50 border-2 border-primary-200' 
                  : 'bg-gray-50 border border-gray-200'
                }
              `}
            >
              {membership.highlight && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif text-primary-900 mb-2">
                  {membership.title}
                </h3>
                <p className="text-sm text-primary-700 font-medium mb-4">
                  {membership.subtitle}
                </p>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {membership.description}
              </p>

              <div className="space-y-3">
                <h4 className="font-semibold text-primary-900 mb-3">Key Features:</h4>                {membership.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center mt-0.5">
                      <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a 
                  href="#contact-form"
                  className={`
                    inline-block px-6 py-3 rounded-lg font-semibold transition-colors duration-300
                    ${membership.highlight
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                    }
                  `}
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-primary-50 p-8 rounded-lg">
          <h3 className="text-2xl font-serif text-primary-900 mb-4">
            Ready to Join the Birchwood Community?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Contact our membership team to schedule a tour and learn more about which membership option is right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact-form" className="btn-primary">
              Request Information
            </a>
            <a href="tel:231-526-2166" className="btn-secondary">
              Call (231) 526-2166
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipTypes;
