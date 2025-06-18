import cottageImage from '../../../images/cottage.jpg'
import overheadImage from '../../../images/overhead.png'

const CommunityOverview = () => {
  return (
    <section id="community-overview" className="py-20 bg-gray-50">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950">
              Discover Birchwood Living
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Birchwood is a private, residential community of distinct homes, condominiums 
              and building sites nestled in the rolling landscapes of Northern Michigan. 
              Our community offers a unique blend of natural beauty, luxury living, and 
              world-class amenities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              From golf course views to majestic woodland settings and pristine Lake Michigan 
              vistas, each homesite offers generous setbacks and breathtaking scenery. 
              Whether you're looking for a primary residence, vacation home, or investment 
              property, Birchwood provides an unparalleled living experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#property-types" className="btn-primary">
                View Property Types
              </a>
              <a href="#community-amenities" className="btn-secondary">
                Explore Amenities
              </a>
            </div>
          </div>
          <div className="relative">
            <img 
              src={cottageImage} 
              alt="Birchwood Community Home" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
        
        {/* Overhead view section */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold font-serif text-primary-950 mb-8">
            Experience Northern Michigan's Premier Community
          </h3>
          <div className="relative max-w-4xl mx-auto">
            <img 
              src={overheadImage} 
              alt="Aerial View of Birchwood Community" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <div className="text-center text-white space-y-4">
                <h4 className="text-2xl md:text-3xl font-bold font-serif">
                  Expansive Natural Setting
                </h4>
                <p className="text-lg max-w-2xl mx-auto">
                  Spread across hundreds of acres of pristine Northern Michigan landscape
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunityOverview
