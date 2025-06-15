import { Link } from 'react-router-dom'

const CallToAction = () => {
  return (
    <>
      {/* Events Section */}
      <section className="py-20 bg-primary-50">
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
                The expansive Birchwood property features a classic Lake Michigan backdrop, 
                which makes for an exquisite setting for any wedding or special event. 
                Create memories that will last a lifetime in our stunning venues.
              </p>
              
              <Link to="/events" className="btn-primary inline-block">
                We'd Love To Hear From You
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="aspect-w-16 aspect-h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl opacity-50">💒</div>
                    <div className="text-primary-950 font-serif font-semibold text-lg">
                      Weddings & Events
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You Belong Here Section */}
      <section className="py-20 bg-primary-950 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <pattern id="birch" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="8" y="0" width="4" height="20" fill="currentColor" />
                  <line x1="8" y1="5" x2="12" y2="5" stroke="white" strokeWidth="0.5" />
                  <line x1="8" y1="10" x2="12" y2="10" stroke="white" strokeWidth="0.5" />
                  <line x1="8" y1="15" x2="12" y2="15" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#birch)" />
            </svg>
          </div>
        </div>

        <div className="container-width section-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold font-serif">
                YOU BELONG HERE
              </h2>
              <div className="w-32 h-1 bg-white mx-auto"></div>
            </div>
            
            <p className="text-xl leading-relaxed text-primary-100 font-serif max-w-3xl mx-auto">
              Join the distinguished members of Birchwood Farms and become part of 
              a legacy that celebrates the finest traditions of northern Michigan hospitality, 
              championship golf, and lifelong friendships.
            </p>
            
            <div className="space-y-8">
              <Link to="/membership" className="btn-primary inline-block text-lg px-8 py-4">
                Learn More About Membership At Birchwood
              </Link>
              
              <div className="text-primary-200">
                <p className="mb-4">Ready to experience the Birchwood difference?</p>
                <div className="space-y-2">
                  <p>600 Birchwood Drive, Harbor Springs, MI 49740</p>
                  <p>(231) 526-2166</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CallToAction
