import { Link } from 'react-router-dom'
import membershipImage from '../../../images/membership.jpg'

const GolfMembership = () => {
  const membershipBenefits = [
    "Unlimited golf on all three courses",
    "Priority tee time reservations", 
    "Access to member-only events and tournaments",
    "Complimentary use of practice facilities",
    "Preferred rates on golf instruction",
    "Reciprocal privileges at select clubs",
    "Guest privileges for friends and family",
    "Pro shop discounts on merchandise"
  ]

  const membershipTypes = [
    {
      type: "Full Golf Membership",
      description: "Complete access to all golf facilities and amenities",
      highlights: ["Unlimited golf", "All course access", "Full club privileges"]
    },
    {
      type: "Social Membership", 
      description: "Limited golf privileges with full social club access",
      highlights: ["Limited golf rounds", "Social club access", "Event participation"]
    },
    {
      type: "Associate Membership",
      description: "Perfect for seasonal residents and frequent visitors",
      highlights: ["Seasonal access", "Flexible terms", "Reciprocal benefits"]
    }
  ]

  return (
    <section id="membership" className="py-20 bg-white">
      <div className="container-width section-padding">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
            Join the Birchwood Golf Family
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Experience the privilege of membership at northern Michigan's premier private golf club. 
            Discover the perfect membership option for your lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={membershipImage} 
                alt="Birchwood Golf Membership" 
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-primary-950 text-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold font-serif">You</div>
                <div className="text-sm">Belong Here</div>
              </div>
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-primary-950 font-serif">
                Membership Benefits
              </h3>
              <p className="text-lg text-primary-700 leading-relaxed">
                As a Birchwood member, you'll enjoy exclusive access to our championship courses 
                and a community of passionate golfers who share your love for the game.
              </p>
            </div>

            <div className="space-y-3">
              {membershipBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-primary-800 leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-primary-950 to-primary-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold font-serif">
              Ready to Experience Birchwood Golf?
            </h3>
            <p className="text-lg text-primary-100 leading-relaxed">
              Join a legacy of excellence and become part of northern Michigan's most prestigious 
              golf community. Contact our membership team to learn more about available options 
              and begin your journey with Birchwood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership" className="btn-primary bg-white text-primary-950 hover:bg-gray-100">
                Learn About Membership
              </Link>
              <a href="tel:231-526-2166" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-950">
                Call (231) 526-2166
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GolfMembership
