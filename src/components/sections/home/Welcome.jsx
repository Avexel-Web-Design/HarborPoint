import { Link } from 'react-router-dom'
import communityImg from '../../../images/community.jpg'
import homeImg from '../../../images/home.jpg'

const Welcome = () => {
  return (
    <section className="py-20 bg-primary-50">
      <div className="container-width section-padding">
        {/* Community Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                A Sense of Community and Friendship
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <p className="text-lg text-primary-700 leading-relaxed">
              If you're looking for your own private, resort-style community in the heart of 
              northern Michigan, Birchwood is just the Club for you. Our 1,600 acre community 
              includes some of the finest real estate in northern Michigan as well as an exceptional 
              clubhouse and recreational campus.
            </p>
            
            <Link to="/membership" className="btn-primary inline-block">
              Learn More About Membership
            </Link>
          </div>
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
        </div>

        {/* Welcome Home Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="lg:order-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                Welcome Home
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <p className="text-lg text-primary-700 leading-relaxed">
              Birchwood is a private, residential community featuring over 400 unique homes 
              and condominiums, with spectacular views of Little Traverse Bay, along the famed 
              Tunnel of Trees. Just five miles north of downtown Harbor Springs, the community 
              offers four seasons of recreation and fun.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <span className="text-primary-800">Heated outdoor swimming pool</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <span className="text-primary-800">Miles of walking and ski trails</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                <span className="text-primary-800">Outdoor racquets facilities</span>
              </div>
            </div>
            
            <Link to="/community" className="btn-secondary inline-block">
              Live Here
            </Link>
          </div>
            <div className="lg:order-1 relative">
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
      </div>
    </section>
  )
}

export default Welcome
