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
                Your Classic Resort Golf Experience
              </h2>
              <div className="w-24 h-1 bg-primary-700"></div>
            </div>
            
            <div className="space-y-6 text-primary-800 leading-relaxed">
              <p className="text-lg">
                Harbor Point Golf Club offers a <strong>classic resort course</strong> designed in the finest 
                traditions of Northern Michigan golf. Most well known for having superb greens, enjoyable routing 
                and spectacular views of Lake Michigan, our course has hosted Michigan Amateur Qualifying, 
                GAM Women's Atlas Cup Matches & 2019 GAM Women's Senior Championships.
              </p>
              
              <p className="text-lg">
                Our course was originally established in 1896 and designed by David Foulis from the famous 
                St. Andrews family of golfers. The club was recognized as a great walker's course by Golf Digest 
                Places to Play, ensuring a memorable experience whether walking or riding.
              </p>
              
              <p className="text-lg">
                Members and guests alike will enjoy a brisk three to three and a half hour round. 
                Harbor Point Golf Club is a semi-private facility, with tee-times for public play available 
                from opening day on May 8th through June 8th and from September 2nd to closing October 12th.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">18</div>
                <div className="text-primary-700 font-medium">Championship Holes</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">5,881</div>
                <div className="text-primary-700 font-medium">Yards (Black Tees)</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">71</div>
                <div className="text-primary-700 font-medium">Par</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="text-3xl font-bold text-primary-950 font-serif">1896</div>
                <div className="text-primary-700 font-medium">Established</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={overheadImage} 
                alt="Harbor Point Golf Course Overhead View" 
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
