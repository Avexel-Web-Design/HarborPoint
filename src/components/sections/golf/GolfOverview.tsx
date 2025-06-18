import overheadImage from '../../../images/overhead.png'

const GolfOverview = () => {
  return (
    <section id="golf-overview" className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif">
                Your Premier Private Golf Destination
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <div className="space-y-6 text-primary-800 leading-relaxed">
              <p className="text-lg">
                At the heart of the Birchwood community are <strong>27 breathtaking holes</strong> of true 
                northern Michigan golf. Golfers find themselves surrounded by untouched forest and 
                gorgeous views of Lake Michigan, while playing on fairways and greens that can only 
                be described as "meticulous."
              </p>
              
              <p className="text-lg">
                The original 18-hole layout, <strong>Farms to Birches</strong>, winds through scenic woodlands 
                of mature hardwoods and is a true test to even the most seasoned of golfers. With 
                manicured fairways and generous greens, every round on this course is a new challenge.
              </p>
              
              <p className="text-lg">
                An additional nine exceptional holes were added on the west side of the property in 1998, 
                rightly given the name, <strong>The Woods</strong>. Crafted by renowned designer Jerry Mathews, 
                this masterpiece shows his attention to detail and the ability to utilize the terrain's 
                natural, undulating topography.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">27</div>
                <div className="text-primary-700 font-medium">Championship Holes</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">6,734</div>
                <div className="text-primary-700 font-medium">Maximum Yards</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">8</div>
                <div className="text-primary-700 font-medium">Tee Box Options</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">3</div>
                <div className="text-primary-700 font-medium">Distinct Courses</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={overheadImage} 
                alt="Birchwood Golf Course Overhead View" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GolfOverview
