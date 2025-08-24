const CareersOverview = () => {
  return (
    <section id="careers-overview" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-8">
            About Harbor Point Golf Club
          </h2>
          <div className="prose lg:prose-lg mx-auto text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              Harbor Point Golf Club is a classic resort course located in Harbor Springs, Michigan, 
              offering an exceptional golf experience with spectacular views of Lake Michigan. 
              Established in 1896 and designed by David Foulis from the famous St. Andrews family 
              of golfers, our course represents over 125 years of golf tradition.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              As we gear up for each golf season, we have a number of positions we are looking to fill. 
              Harbor Point Golf Club continuously strives to provide excellent service and maintain 
              the highest standards of hospitality in northern Michigan's golf community.
            </p>
            <div className="mt-12 bg-primary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold font-serif text-primary-950 mb-4">
                Why Work at Harbor Point Golf Club?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Golf Tradition</h4>
                  <p className="text-sm">
                    Be part of one of Northern Michigan's oldest golf courses with a rich 
                    history and commitment to excellence.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Seasonal Opportunities</h4>
                  <p className="text-sm">
                    Join our seasonal team with opportunities in golf operations, dining, 
                    and course maintenance during our active season.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Scenic Location</h4>
                  <p className="text-sm">
                    Work in a beautiful Lake Michigan setting at a course recognized 
                    by Golf Digest as a great walker's course.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareersOverview
