import communityImage from '../../../images/community.jpg'

const LifestyleOverview = () => {
  return (
    <section id="lifestyle-overview" className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                Luxury Resort-Style Living
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <div className="space-y-6 text-primary-800 leading-relaxed">
              <p className="text-lg">
                The <strong>1,600 acre association</strong> boasts 27 holes of picturesque northern Michigan golf, 
                nine Har-tru clay tennis courts, four pickleball courts, multiple dining facilities, 
                fitness center and an array of social activities.
              </p>
              
              <p className="text-lg">
                An abundance of trails for hiking, snow shoeing and cross country skiing offer 
                <strong> four seasons of recreational bliss</strong> throughout the Birchwood campus.
              </p>
              
              <p className="text-lg">
                From world-class recreational facilities to fine dining experiences, every amenity 
                is designed to enhance your northern Michigan lifestyle and create lasting memories 
                with family and friends.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">1,600</div>
                <div className="text-primary-700 font-medium">Acres</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">9</div>
                <div className="text-primary-700 font-medium">Tennis Courts</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">4</div>
                <div className="text-primary-700 font-medium">Pickleball Courts</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">7</div>
                <div className="text-primary-700 font-medium">Miles of Trails</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={communityImage} 
                alt="Birchwood Community Lifestyle" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary-950 text-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold font-serif">Resort-Style</div>
                <div className="text-sm">Amenities for All Ages</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LifestyleOverview
