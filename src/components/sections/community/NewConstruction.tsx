import constructionImage from '../../../images/construction.jpg'

const NewConstruction = () => {
  return (
    <section id="new-construction" className="py-20 bg-primary-50">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950">
              Build Your Dream Home
            </h2>
            <p className="text-xl text-primary-800 font-serif italic">
              In the Heart of Northern Michigan
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Craft your private sanctuary in the heart of beautiful northern Michigan. 
              Choose from golf course view, wooded or open homesites for your new build 
              within the expansive Birchwood property.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Birchwood homesites offer generous setbacks that include beautiful Lake Michigan 
              views, majestic woodland settings and pristine golf course scenes. Our building 
              requirements ensure that every home maintains the highest standards of quality 
              and aesthetic appeal.
            </p>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-primary-100">
              <h3 className="text-xl font-bold text-primary-950 mb-4">
                The Ridge Condominium Association
              </h3>
              <p className="text-gray-600 mb-4">
                Currently under construction - 20 units in four phases featuring:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Single Story Ranch Configuration
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Two-Story Townhouse Configuration
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  First Floor Master Suites
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Two-Car Attached Garages
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full Basements
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Open Concept Floor Plans
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Gas Fireplaces & Wood Floors
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  High-End Appliance Packages
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact-info" className="btn-primary">
                Learn More About Construction
              </a>
              <a href="#property-types" className="btn-secondary">
                View Building Sites
              </a>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src={constructionImage} 
              alt="New Construction at Birchwood" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold font-serif text-primary-950 mb-6 text-center">
            Building Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <svg className="w-12 h-12 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="text-lg font-semibold text-primary-950 mb-2">Property Map</h4>
              <p className="text-sm text-gray-600 mb-4">
                View available lots and their locations throughout the community
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Download Map →
              </button>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <svg className="w-12 h-12 text-primary-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h4 className="text-lg font-semibold text-primary-950 mb-2">Building Rules & Regulations</h4>
              <p className="text-sm text-gray-600 mb-4">
                Review building requirements, rules, and preferred builder list
              </p>
              <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                Download Guidelines →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewConstruction
