import { Link } from 'react-router-dom'
import communityImg from '../../../images/community.jpg'
import homeImg from '../../../images/home.jpg'
import weddingImg from '../../../images/wedding.jpg'

const Welcome = () => {
  return (
    <section id="welcome-section" className="py-20 bg-primary-50">
      <div className="container-width section-padding">

        {/* Welcome Home Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="lg:order-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                Welcome to Excellence
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <p className="text-lg text-primary-700 leading-relaxed">
              Harbor Point Golf Club is a prestigious private club nestled along Lake Michigan's 
              stunning shoreline. Our exclusive membership community offers unparalleled access 
              to championship golf, luxury amenities, and breathtaking waterfront views in one 
              of Michigan's most coveted locations.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <span className="text-primary-800">Championship 18-hole golf course</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <span className="text-primary-800">Stunning Lake Michigan views</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <span className="text-primary-800">Elegant clubhouse and dining</span>
              </div>
            </div>
            
            <Link to="/membership" className="btn-primary inline-block">
              Discover Membership
            </Link>
          </div>
            <div className="lg:order-2 relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-w-16 aspect-h-10 rounded-xl overflow-hidden">
                <img 
                  src={homeImg} 
                  alt="Little Traverse Bay Views"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Community Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="aspect-w-16 aspect-h-10 rounded-xl overflow-hidden">
                <img 
                  src={communityImg} 
                  alt="Resort-Style Community"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                An Exclusive Golf Experience
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <p className="text-lg text-primary-700 leading-relaxed">
              Harbor Point Golf Club offers an unmatched golfing experience with our 
              championship course designed to challenge and inspire. Set against the 
              backdrop of Lake Michigan, every round delivers both beauty and exceptional 
              play for our distinguished members.
            </p>
            
            <Link to="/membership" className="btn-secondary inline-block">
              Learn More About Membership
            </Link>
          </div>
        </div>
      </div>
      <div className="container-width section-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                  Plan Your Special Day With Us
                </h2>
                <div className="w-24 h-1 bg-primary-700"></div>
              </div>
              
              <p className="text-lg text-primary-700 leading-relaxed">
                Harbor Point Golf Club provides the perfect setting for your most important 
                celebrations. Our elegant facilities and spectacular Lake Michigan views 
                create an unforgettable atmosphere for weddings, corporate events, and 
                special occasions.
              </p>
              
              <Link to="/events" className="btn-primary inline-block">
                We'd Love To Hear From You
              </Link>
            </div>
              <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="aspect-w-16 aspect-h-10 rounded-xl overflow-hidden">
                  <img 
                    src={weddingImg} 
                    alt="Weddings & Events"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
    
  )
}

export default Welcome
