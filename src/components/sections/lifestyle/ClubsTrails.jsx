import pondImage from '../../../images/pond.jpg'
import clubsImage from '../../../images/clubs.jpg'

const ClubsTrails = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif mb-4">
            Clubs & Outdoor Activities
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto mb-6"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto">
            Connect with fellow members through shared interests and outdoor adventures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl bg-primary-100">
              <div className="flex items-center justify-center">
                <div className="text-center text-primary-700">
                  <img 
                    src={clubsImage} 
                    alt="Birchwood Clubs and Outdoor Activities" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Clubs Within The Club
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                Birchwood offers so many <strong>Clubs within the Club</strong> - a personal way for fellow 
                Members to share in hobbies, interests, and commonalities.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-semibold text-primary-950">Bridge Club</h4>
                  <p className="text-sm text-primary-700">Regular games & tournaments</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-semibold text-primary-950">Mahjongg</h4>
                  <p className="text-sm text-primary-700">Weekly social games</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-semibold text-primary-950">Book Club</h4>
                  <p className="text-sm text-primary-700">Monthly discussions</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-semibold text-primary-950">Stitch 'n Sip</h4>
                  <p className="text-sm text-primary-700">Crafting & socializing</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-semibold text-primary-950">Poker Night</h4>
                  <p className="text-sm text-primary-700">Regular friendly games for all skill levels</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-primary-600">
                  <h4 className="font-semibold text-primary-950">And More</h4>
                  <p className="text-sm text-primary-700">New clubs forming regularly</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative lg:order-2">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={pondImage} 
                alt="Birchwood Hiking Trails and Fishing Ponds" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 lg:order-1">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Hiking Trails & Fishing Ponds
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                Enjoy walking, hiking and biking in the <strong>unparalleled beauty of northern Michigan</strong> 
                on Birchwood's well maintained trails.
              </p>
              <p className="text-lg">
                The winter season offers many fun snowshoeing opportunities and access to 
                <strong> seven miles of groomed cross country ski trails</strong>.
              </p>
              <p className="text-lg">
                Birchwood also offers <strong>two fully stocked, catch and release fishing ponds</strong> for 
                Member and guest use.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ClubsTrails
