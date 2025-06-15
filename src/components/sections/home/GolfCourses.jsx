import { Link } from 'react-router-dom'

const GolfCourses = () => {
  const courses = [
    {
      name: "The Woods",
      description: "A challenging 9-hole course that winds through mature hardwood forests, offering dramatic elevation changes and breathtaking views of the surrounding wilderness.",
      holes: 9,
      par: 36,
      yardage: "3,200",
      features: ["Mature hardwood forest", "Elevation changes", "Scenic wilderness views", "Challenging layout"],
      icon: "🌲"
    },
    {
      name: "The Farms",
      description: "Our signature 9-hole course featuring rolling farmland terrain with strategic water hazards and meticulously maintained fairways that provide both beauty and challenge.",
      holes: 9,
      par: 36,
      yardage: "3,400",
      features: ["Rolling farmland", "Strategic water hazards", "Open fairways", "Classic design"],
      icon: "🚜"
    },
    {
      name: "The Birches",
      description: "Named after the iconic birch groves that line the fairways, this 9-hole course offers a more intimate golfing experience with technical shot-making requirements.",
      holes: 9,
      par: 35,
      yardage: "3,100",
      features: ["Birch-lined fairways", "Technical challenges", "Intimate setting", "Precision play"],
      icon: "🌳"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={course.name} className="bg-primary-50 rounded-2xl p-8 space-y-6 hover:shadow-lg transition-shadow">
              <div className="text-center space-y-4">
                <div className="text-5xl">{course.icon}</div>
                <h3 className="text-2xl font-bold text-primary-950 font-serif">
                  {course.name}
                </h3>
              </div>
              
              <p className="text-primary-700 leading-relaxed">
                {course.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 text-center py-4 bg-white rounded-lg">
                <div>
                  <div className="text-2xl font-bold text-primary-950">{course.holes}</div>
                  <div className="text-sm text-primary-700">Holes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-950">Par {course.par}</div>
                  <div className="text-sm text-primary-700">Par</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-950">{course.yardage}</div>
                  <div className="text-sm text-primary-700">Yards</div>
                </div>
              </div>
              
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
