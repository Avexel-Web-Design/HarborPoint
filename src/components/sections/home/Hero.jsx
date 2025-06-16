import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section id="hero-section" className="relative bg-gradient-to-br from-primary-50 to-white min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-950"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-primary-700"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-primary-800"></div>
        <div className="absolute bottom-40 right-10 w-20 h-20 rounded-full bg-primary-600"></div>
      </div>

      <div className="container-width section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-950 font-serif leading-tight">
                Welcome to
                <span className="block text-primary-700">Birchwood</span>
                <span className="block">Farms</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-700 font-serif italic">
                Where Tradition Meets Excellence
              </p>
            </div>
            
            <p className="text-lg text-primary-800 leading-relaxed max-w-xl">
              Experience the perfect harmony of championship golf, exquisite dining, 
              and unparalleled hospitality in our pristine countryside setting. 
              Join a legacy of excellence that spans generations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/membership" className="btn-primary text-center">
                Explore Membership
              </Link>
              <Link to="/golf" className="btn-secondary text-center">
                View Courses
              </Link>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative">
            <div className="bg-primary-950 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="space-y-6">                  <div className="w-24 h-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-primary-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-950 font-serif mb-2">
                      Northern Michigan Paradise
                    </h3>
                    <p className="text-primary-700">
                      1,600 acres of pristine beauty overlooking Little Traverse Bay
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-950">3</div>
                      <div className="text-primary-700">Golf Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-950">400+</div>
                      <div className="text-primary-700">Residences</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-950">1,600</div>
                      <div className="text-primary-700">Acres</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-700 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
