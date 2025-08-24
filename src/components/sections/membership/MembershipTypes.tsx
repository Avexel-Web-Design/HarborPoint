import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const MembershipTypes = () => {
  const membershipTypes = [
    {
      id: 'family',
      title: 'Family Membership',
      subtitle: 'Golfing privileges for spouse and children/grandchildren under 25',
      description: 'Includes golfing privileges for both you and your spouse, and children and grandchildren under the age of 25. All members are responsible for cart fees, and greens fees are waived.',
      annualDues: '$4,950',
      initiationFee: '$14,000',
      features: [
        'Golfing privileges for member and spouse',
        'Children and grandchildren under 25 included',
        'Cart fees apply ($30 for 18 holes, $20 for 9 holes)',
        'No greens fees',
        'Initiation fee due with application'
      ],
      highlight: true
    },
    {
      id: 'single',
      title: 'Single Membership',
      subtitle: 'Golfing privileges for member and children/grandchildren under 25',
      description: 'Includes golfing privileges for the Member, and children and grandchildren under the age of 25. A spouse is considered a Social Member, and does not have golfing privileges with this Membership.',
      annualDues: '$3,825',
      initiationFee: '$8,500',
      features: [
        'Golfing privileges for member only',
        'Children and grandchildren under 25 included',
        'Spouse has social privileges only',
        'Cart fees apply ($30 for 18 holes, $20 for 9 holes)',
        'No greens fees',
        'Initiation fee due with application'
      ]
    },
    {
      id: 'associate-family',
      title: 'Associate Family Membership',
      subtitle: 'For golfers between the ages of 25 to 39 years',
      description: 'Includes golfing privileges for both you and your spouse, and children under the age of 25. When older spouse reaches the age of 40, this Membership will convert to a Family Membership.',
      annualDues: '$1,900',
      initiationFee: '$3,000',
      features: [
        'Ages 25-39 years only',
        'Golfing privileges for member and spouse',
        'Children under 25 included',
        'Cart fees apply ($30 for 18 holes, $20 for 9 holes)',
        'No greens fees',
        'Initiation fee can be paid in increments',
        'Converts to Family Membership at age 40'
      ]
    },
    {
      id: 'associate-single',
      title: 'Associate Single Membership',
      subtitle: 'For golfers between the ages of 25 to 39 years',
      description: 'Includes golfing privileges for the Member, and children under the age of 25. A spouse is considered a Social Member. Upon turning 40, this membership will convert into a Single Membership.',
      annualDues: '$1,200',
      initiationFee: '$2,000',
      features: [
        'Ages 25-39 years only',
        'Golfing privileges for member only',
        'Children under 25 included',
        'Spouse has social privileges only',
        'Cart fees apply ($30 for 18 holes, $20 for 9 holes)',
        'No greens fees',
        'Initiation fee can be paid in increments',
        'Converts to Single Membership at age 40'
      ]
    },
    {
      id: 'harbor-point-family',
      title: 'Harbor Point Family Membership',
      subtitle: 'For Harbor Point Stockholders and families',
      description: 'For our Harbor Point Family Membership we include Stockholders, children and grandchildren under the age of 25. Each family unit must purchase an individual membership.',
      annualDues: '$1,000',
      initiationFee: 'None',
      features: [
        'For Harbor Point Stockholders only',
        'Children and grandchildren under 25 included',
        'Cart fees apply, no greens fees',
        'No initiation fee',
        'Can be dropped or added on yearly basis',
        'Each family unit needs individual membership'
      ]
    },
    {
      id: 'social',
      title: 'Social Membership',
      subtitle: 'Clubhouse activities without golfing privileges',
      description: 'Our Social Membership is open to anyone, and one Member Sponsor is required. This membership does not include any golfing privileges. Grants access to all clubhouse activities including Special Events, Bridge, Mah Jongg, etc.',
      annualDues: '$825',
      initiationFee: 'None',
      features: [
        'No golfing privileges',
        'Access to all clubhouse activities',
        'Special Events, Bridge, Mah Jongg access',
        'One Member Sponsor required',
        'No initiation fee',
        'Open to anyone with sponsor'
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
                {membership.annualDues && (
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-primary-900">
                      Annual Dues: {membership.annualDues}
                    </div>
                    <div className="text-sm text-primary-700">
                      Initiation Fee: {membership.initiationFee}
                    </div>
                  </div>
                )}
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
            Ready to Join Harbor Point Golf Club?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            At this time we are welcoming a limited number of new members to our Club. Please note you will need to secure sponsorship by two current members or Harbor Point Stockholders for both Full and Associate Memberships.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact-form" className="btn-primary">
              Request Membership Information
            </a>
            <a href="tel:231-526-2951" className="btn-secondary">
              Call Pro Shop (231) 526-2951
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipTypes;
