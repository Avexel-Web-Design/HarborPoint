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
                Harbor Point Golf Club features <strong>18 championship holes</strong> that epitomize 
                excellence in golf course design. Set along Lake Michigan's stunning shoreline, our course 
                offers golfers breathtaking water views, meticulously maintained playing surfaces, and 
                strategic challenges that test every aspect of your game.
              </p>
              
              <p className="text-lg">
                Our championship layout seamlessly integrates with the natural Lake Michigan terrain, 
                featuring dramatic elevation changes, pristine fairways, and immaculate greens. Each hole 
                has been thoughtfully designed to showcase the spectacular beauty of the lakefront while 
                providing an exceptional golfing experience.
              </p>
              
              <p className="text-lg">
                From lakeside holes with stunning water views to tree-lined fairways that wind through 
                the Michigan landscape, Harbor Point offers a premier golfing experience that combines 
                natural beauty with championship-level design and conditioning.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">18</div>
                <div className="text-primary-700 font-medium">Championship Holes</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">6,800</div>
                <div className="text-primary-700 font-medium">Championship Yards</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">72</div>
                <div className="text-primary-700 font-medium">Championship Par</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">5</div>
                <div className="text-primary-700 font-medium">Tee Options</div>
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
