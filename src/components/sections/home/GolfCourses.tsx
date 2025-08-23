import { Link } from 'react-router-dom'

const GolfCourses = () => {  const courseFeatures = [
    {
      title: "Championship Design",
      description: "Our 18-hole championship course features expertly designed holes that challenge golfers of all skill levels while showcasing the natural beauty of Lake Michigan's shoreline.",
      features: ["18 championship holes", "Par 72 layout", "Multiple tee options", "Signature lakefront holes"]
    },
    {
      title: "Scenic Beauty",
      description: "Every hole offers stunning views and unique character, from dramatic lakefront vistas to tree-lined fairways that wind through pristine Michigan landscape.",
      features: ["Lake Michigan views", "Natural terrain", "Mature trees and landscaping", "Wildlife viewing"]
    },
    {
      title: "Premium Conditions",
      description: "Meticulously maintained by our expert grounds crew, Harbor Point's course delivers exceptional playing conditions year-round with pristine fairways and greens.",
      features: ["Pristine fairways", "Premium greens", "Professional maintenance", "Excellent drainage"]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
            Championship Golf at Harbor Point
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Experience 18 holes of championship golf set against the stunning backdrop of Lake Michigan, 
            where every round combines exceptional challenge with breathtaking natural beauty.
          </p>
        </div>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courseFeatures.map((section) => (
            <div key={section.title} className="bg-primary-50 rounded-2xl p-8 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-primary-950 font-serif">
                  {section.title}
                </h3>
              </div>
              
              <p className="text-primary-700 leading-relaxed">
                {section.description}
              </p>
              
              <div className="space-y-2">
                {section.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                    <span className="text-primary-800 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
          <div className="text-center mt-12">
          <Link to="/golf" className="btn-secondary">
            Explore Our Course
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GolfCourses
