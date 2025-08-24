const CoursesDetail = () => {
  const courseStats = [
    { tee: 'Black', yardage: 5881, par: 71, rating: 68.8, slope: 131 },
    { tee: 'White (Men\'s)', yardage: 5676, par: 71, rating: 67.7, slope: 129 },
    { tee: 'White (Ladies\')', yardage: 5676, par: 71, rating: 73.2, slope: 131 },
    { tee: 'Green (Men\'s)', yardage: 4889, par: 71, rating: 64.3, slope: 117 },
    { tee: 'Green (Ladies\')', yardage: 4889, par: 71, rating: 69.0, slope: 122 }
  ];

  const seasonInfo = [
    {
      season: 'Spring Public Play',
      dates: 'May 8 - June 8',
      rates: {
        '18 Holes with Cart': '$90',
        '18 Holes Walking': '$55',
        '9 Holes with Cart': '$60',
        '9 Holes Walking': '$35'
      }
    },
    {
      season: 'Summer - Members Only',
      dates: 'June 9 - September 1',
      rates: {
        'Members Only': 'Cart fees apply for members'
      }
    },
    {
      season: 'Fall Public Play',
      dates: 'September 2 - October 12',
      rates: {
        '18 Holes with Cart': '$90',
        '18 Holes Walking': '$55',
        '9 Holes with Cart': '$60',
        '9 Holes Walking': '$35'
      }
    }
  ];

  return (
    <section id="course-details" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Course Information
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed by David Foulis from the famous St. Andrews family of golfers, 
            Harbor Point Golf Club offers 18 holes of classic resort golf.
          </p>
        </div>

        {/* Course Statistics */}
        <div className="bg-primary-50 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-serif text-primary-950 text-center mb-8">
            Tee Information & Course Rating
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-200">
                  <th className="text-left py-3 px-4 font-serif text-primary-950">Tees</th>
                  <th className="text-center py-3 px-4 font-serif text-primary-950">Yardage</th>
                  <th className="text-center py-3 px-4 font-serif text-primary-950">Par</th>
                  <th className="text-center py-3 px-4 font-serif text-primary-950">Rating</th>
                  <th className="text-center py-3 px-4 font-serif text-primary-950">Slope</th>
                </tr>
              </thead>
              <tbody>
                {courseStats.map((stat, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-primary-25'}>
                    <td className="py-3 px-4 font-medium text-primary-900">{stat.tee}</td>
                    <td className="py-3 px-4 text-center text-primary-800">{stat.yardage}</td>
                    <td className="py-3 px-4 text-center text-primary-800">{stat.par}</td>
                    <td className="py-3 px-4 text-center text-primary-800">{stat.rating}</td>
                    <td className="py-3 px-4 text-center text-primary-800">{stat.slope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Season & Rates */}
        <div className="grid md:grid-cols-3 gap-8">
          {seasonInfo.map((season, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-2xl font-serif text-primary-950 mb-2">{season.season}</h4>
              <p className="text-primary-700 font-medium mb-4">{season.dates}</p>
              <div className="space-y-2">
                {Object.entries(season.rates).map(([type, rate]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-gray-700">{type}:</span>
                    <span className="font-semibold text-primary-900">{rate}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="mt-16 bg-primary-600 text-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-serif mb-4">Important Information</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold mb-2">Dress Code</h4>
              <p className="text-primary-100">Golf attire is required. Jeans are not permitted on the course, and all golfers must wear a collared shirt.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Reservations</h4>
              <p className="text-primary-100">Please call the Pro Shop at (231) 526-2951 for advance tee time reservations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesDetail;