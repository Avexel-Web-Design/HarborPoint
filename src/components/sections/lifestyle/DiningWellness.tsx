import diningImage from '../../../images/dining.png'

const DiningWellness = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif mb-4">
            Dining & Wellness
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto mb-6"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto">
            Exceptional dining experiences and wellness activities in northern Michigan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Exceptional Dining
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                In Birchwood's <strong>Grill Room</strong>, you can watch white-tailed deer cross the golf course, 
                while you dine near the warmth of the 40-foot fieldstone fireplace. On any given night, 
                you will enjoy some of northern Michigan's finest cuisine with new friends, old friends, and close neighbors.
              </p>
              <p className="text-lg">
                The <strong>Casual Bar</strong> offers everything you look for in northern Michigan ambiance. 
                Take pleasure in watching your favorite sporting event on one of several high-definition televisions, 
                while sipping from a frosty pint of one of the various draft beer selections offered.
              </p>
              <p className="text-lg">
                Our <strong>Main Dining Room</strong> provides a beautiful setting and picturesque views for your 
                special event; ideal for weddings, receptions, birthdays, anniversaries, or other private parties.
              </p>
              <p className="text-lg">
                Sit back, relax, and decant a bottle of your favorite wine. You're up north in good hands at Birchwood.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={diningImage} 
                alt="Birchwood Dining Experience" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Wellness Section */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-primary-950 font-serif">
                Wellness & Active Lifestyle
              </h3>
              <div className="space-y-4 text-primary-800 leading-relaxed">
                <p className="text-lg">
                  Birchwood offers many <strong>active lifestyle opportunities</strong> designed to unite Members 
                  through shared experiences and events. Enjoy walking, hiking and biking in the 
                  unparalleled beauty of northern Michigan on Birchwood's well maintained trails.
                </p>
                <p className="text-lg">
                  The winter season offers many fun <strong>snowshoeing opportunities</strong> and access to 
                  seven miles of groomed cross country ski trails.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-primary-950 font-serif mb-4">
                Year-Round Activities
              </h4>              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm transition-transform duration-300 hover:translate-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-primary-800">Hiking & Walking Trails</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm transition-transform duration-300 hover:translate-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-primary-800">Biking Paths</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm transition-transform duration-300 hover:translate-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-primary-800">Cross Country Skiing</span>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm transition-transform duration-300 hover:translate-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  <span className="text-primary-800">Snowshoeing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DiningWellness
