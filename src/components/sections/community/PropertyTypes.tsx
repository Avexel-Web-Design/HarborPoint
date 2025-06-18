import homeImage from '../../../images/home.jpg'
import cottageImage from '../../../images/cottage.jpg'
import pondImage from '../../../images/pond.jpg'

const PropertyTypes = () => {
  const propertyTypes = [
    {
      title: "Homes",
      description: "Custom-built homes featuring premium finishes, spacious floor plans, and stunning views. Each home is thoughtfully designed to blend with the natural landscape.",
      image: homeImage,
      features: [
        "Custom architectural designs",
        "Premium finishes and materials",
        "Spacious lots with privacy",
        "Golf course and woodland views"
      ]
    },
    {
      title: "Condominiums", 
      description: "The new Ridge Condominium Association offers 20 units in four phases, featuring single-story ranch and two-story townhouse configurations.",
      image: cottageImage,
      features: [
        "First floor master suites",
        "Two-car attached garages",
        "Full basements",
        "Open concept floor plans",
        "Gas fireplaces and wood floors",
        "High-end appliance packages"
      ]
    },
    {
      title: "Building Sites",
      description: "Choose from golf course view, wooded, or open homesites for your new build. All sites offer generous setbacks and beautiful natural settings.",
      image: pondImage,
      features: [
        "Lake Michigan views available",
        "Majestic woodland settings", 
        "Pristine golf course scenes",
        "Generous setbacks for privacy",
        "Utilities ready for construction"
      ]
    }
  ]

  return (
    <section id="property-types" className="py-20 bg-white">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
            Property Types
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover your perfect home at Birchwood with our diverse selection of 
            properties, each offering unique features and breathtaking views.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {propertyTypes.map((property, index) => (
            <div key={index} className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold font-serif text-primary-950 mb-3">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {property.description}
                </p>
                <ul className="space-y-2">
                  {property.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ready to find your perfect property at Birchwood?
          </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact-info" className="btn-primary">
              Contact Our Team
            </a>
            <a href="#new-construction" className="btn-secondary">
              Learn About New Construction
            </a>            <a 
              href="/PropertyMap.pdf" 
              download="BirchwoodCC-PropertyMap.pdf"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-4-4m4 4l4-4m-4-4V4m0 0H8m4 0h4" />
              </svg>
              Download Property Map
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PropertyTypes
