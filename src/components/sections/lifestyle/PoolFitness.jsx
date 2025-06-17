import poolImage from '../../../images/pool.jpg'
import gymImage from '../../../images/gym.png'

const PoolFitness = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif mb-4">
            Pool & Fitness
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto mb-6"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto">
            Stay active and refreshed with our premium aquatic and fitness facilities
          </p>
        </div>

        {/* Pool Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Outdoor, Heated Swimming Pool
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                Experience the comfort of our <strong>outdoor, heated swimming pools</strong>, designed to meet 
                the needs of all ages. Enjoy lap swimming, water aerobics and volleyball.
              </p>
              <p className="text-lg">
                Our <strong>zero-entry kiddie pool</strong> is offered for the fun and enjoyment of our younger 
                members and guests, complete with water jets for added entertainment.
              </p>
              <p className="text-lg">
                Swimming lessons are available throughout the summer season. If swimming is not your style, 
                enjoy the sun on our spacious pool decks with a variety of lounge furniture.
              </p>
              <p className="text-lg">
                For your refreshment and food enjoyment, our <strong>Three-Way House</strong> is located at the 
                north end of the pool and our locker rooms are easily accessible with showers and vanities.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={poolImage} 
                alt="Birchwood Outdoor Heated Swimming Pool" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Fitness Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative lg:order-1">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={gymImage} 
                alt="Birchwood Fitness Center" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 lg:order-2">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Fitness Center & Exercise Classes
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                Birchwood's <strong>Fitness Center</strong> offers high quality equipment, including cardio and 
                strength training machines. All strength training machines are individual stations, 
                and along with a variety of free weights, offer complete circuit and strength training workouts.
              </p>
              <p className="text-lg">
                Full service men's and women's locker rooms are located nearby for post workout convenience. 
                The Fitness Center is open daily from <strong>6:00am - 10:00pm, year round</strong>.
              </p>
              <p className="text-lg">
                Join in on <strong>Member-led Fitness Sessions, Yoga Classes and Stretching & Flexibility Classes</strong> 
                offered throughout the year!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PoolFitness
