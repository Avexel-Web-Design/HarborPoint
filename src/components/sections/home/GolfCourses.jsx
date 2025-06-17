import { Link } from 'react-router-dom'

const GolfCourses = () => {  const courses = [
    {
      name: "The Birches",
      description: "Navigate challenging dogleg holes with downhill tee shots and uphill approaches to bunker-protected greens. This course rewards strategic thinking and precise club selection through birch-lined fairways.",
      yardage: "3,320",
      features: ["Challenging doglegs", "Elevation changes", "Bunker-protected greens", "Strategic shot placement"]
    },
    {
      name: "The Woods",
      description: "Experience breathtaking elevated tee boxes with stunning Lake Michigan views and dramatic 90-100 foot elevation drops. This course demands precision and strategic play through mature hardwood terrain.",
      yardage: "3,450",
      features: ["Lake Michigan views", "Dramatic elevation drops", "Elevated tee boxes", "Precision required"]
    },
    {
      name: "The Farms",
      description: "Classic farmland golf featuring strategic fairway bunkers and well-guarded greens where pin placement creates unique challenges. Every shot requires careful consideration of the course's traditional design.",
      yardage: "3,420",
      features: ["Strategic fairway bunkers", "Well-guarded greens", "Traditional farmland design", "Pin placement challenges"]
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
            Three Distinct Golf Experiences
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Discover 27 holes of championship golf across three unique 9-hole courses, 
            each offering its own character and challenges amidst northern Michigan's natural beauty.
          </p>
        </div>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={course.name} className="bg-primary-50 rounded-2xl p-8 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-primary-950 font-serif">
                  {course.name}
                </h3>
                <p className="text-sm text-primary-600 font-medium">
                  {course.yardage} yards
                </p>
              </div>
              
              <p className="text-primary-700 leading-relaxed">
                {course.description}
              </p>
              
              <div className="space-y-2">
                {course.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                    <span className="text-primary-800 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                to={`/golf/${course.name.toLowerCase().replace(' ', '-')}`}
                className="block text-center bg-primary-950 text-white py-3 rounded-lg font-serif font-semibold hover:bg-primary-800 transition-colors"
              >
                Explore {course.name}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/golf" className="btn-secondary">
            View All Golf Information
          </Link>
        </div>
      </div>
    </section>
  )
}

export default GolfCourses
