import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGolfBallTee, faUtensils, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const Features = () => {  const features = [
    {
      title: "Championship Golf Course",
      description: "Our 18-hole championship course offers a challenging yet enjoyable experience for golfers of all skill levels. Designed by renowned architect Robert Trent Jones, each hole presents unique challenges while showcasing the natural beauty of our birch-lined fairways.",
      image: <FontAwesomeIcon icon={faGolfBallTee} />,
      link: "/golf",
      highlights: ["18 Championship Holes", "Par 72, 7,200 Yards", "PGA Professional Staff", "Practice Facilities"]
    },
    {
      title: "Fine Dining Experience",
      description: "Savor exquisite cuisine in our award-winning restaurants. From casual lunch on the terrace to elegant dinner in our formal dining room, every meal is crafted with the finest ingredients and attention to detail.",
      image: <FontAwesomeIcon icon={faUtensils} />,
      link: "/dining",
      highlights: ["Award-Winning Cuisine", "Seasonal Menus", "Private Dining Rooms", "Extensive Wine Selection"]
    },
    {
      title: "Exclusive Events",
      description: "Host your most important celebrations in our stunning event spaces. Whether it's a wedding, corporate gathering, or private party, our experienced team will ensure your event is unforgettable.",
      image: <FontAwesomeIcon icon={faCalendarCheck} />,
      link: "/events",
      highlights: ["Wedding Ceremonies", "Corporate Events", "Private Parties", "Tournament Hosting"]
    }
  ]

  return (
    <section className="py-20 bg-primary-50">
      <div className="container-width section-padding">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
            Experience Excellence
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
            Discover the exceptional amenities and services that make Birchwood Farms 
            the premier destination for discerning members.
          </p>
        </div>

        <div className="space-y-16">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="text-6xl mb-4 text-primary-600">{feature.image}</div>
                <h3 className="text-3xl font-bold text-primary-950 font-serif">
                  {feature.title}
                </h3>
                <p className="text-lg text-primary-700 leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {feature.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-700 rounded-full"></div>
                      <span className="text-primary-800 font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
                
                <Link 
                  to={feature.link}
                  className="inline-flex items-center space-x-2 text-primary-950 font-semibold hover:text-primary-700 transition-colors group"
                >
                  <span>Learn More</span>
                  <svg 
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Visual */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <div className="aspect-w-16 aspect-h-10 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-8xl opacity-50">{feature.image}</div>
                      <div className="text-primary-950 font-serif font-semibold text-lg">
                        {feature.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
