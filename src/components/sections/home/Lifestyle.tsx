import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGolfBallTee, 
  faPersonSwimming, 
  faPersonHiking, 
  faTableTennisPaddleBall, 
  faUtensils, 
  faPersonSkiing 
} from '@fortawesome/free-solid-svg-icons'

const Lifestyle = () => {  const activities = [
    {
      title: "Championship Golf",
      description: "18 holes of championship golf with spectacular Lake Michigan views",
      icon: faGolfBallTee,
      link: "/golf"
    },
    {
      title: "Fine Dining",
      description: "Award-winning cuisine with seasonal menus and lake views",
      icon: faUtensils,
      link: "/dining"
    },
    {
      title: "Lake Michigan Views",
      description: "Breathtaking vistas from every hole and clubhouse location",
      icon: faPersonHiking,
      link: "/lifestyle"
    },
    {
      title: "Private Events",
      description: "Elegant venues for weddings and corporate gatherings",
      icon: faTableTennisPaddleBall,
      link: "/events"
    },
    {
      title: "Luxury Amenities",
      description: "World-class facilities and exclusive member services",
      icon: faPersonSwimming,
      link: "/lifestyle"
    },
    {
      title: "Seasonal Activities",
      description: "Year-round recreation and entertainment opportunities",
      icon: faPersonSkiing,
      link: "/lifestyle"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center space-y-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
              Join In All of the Fun
            </h2>
            <div className="w-24 h-1 bg-primary-700 mx-auto"></div>
          </div>
          
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Four seasons of recreation and luxury await you at Harbor Point Golf Club. 
            From championship golf to exclusive dining, experience the finest amenities Michigan has to offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <Link
              key={activity.title}
              to={activity.link}
              className="group bg-primary-50 rounded-2xl p-8 text-center space-y-4 hover:bg-primary-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="text-4xl mb-4 text-primary-700">
                <FontAwesomeIcon icon={activity.icon} />
              </div>
              <h3 className="text-xl font-bold text-primary-950 font-serif group-hover:text-primary-700 transition-colors">
                {activity.title}
              </h3>
              <p className="text-primary-700 leading-relaxed">
                {activity.description}
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary-950 font-semibold group-hover:text-primary-700 transition-colors">
                <span>Learn More</span>
                <svg 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/lifestyle" className="btn-secondary">
            Explore Our Active Lifestyle
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Lifestyle
