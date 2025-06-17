const AboutHistory = () => {
  const timelineEvents = [
    {
      year: "1913",
      title: "The Beginning",
      description: "The Birchwood Farm Estate was established by Joseph E. Otis, of Chicago banking fame, as the model dairy and produce farm of Emmet County, and soon became known for the superiority of its farm products."
    },
    {
      year: "1951",
      title: "Club Formation",
      description: "The property transformed from a working farm into a private club, maintaining its commitment to excellence while embracing its new role as a premier recreational destination."
    },
    {
      year: "1959",
      title: "Golf Course Development",
      description: "The first golf course was established, taking advantage of the property's natural beauty and rolling terrain to create a challenging and scenic playing experience."
    },
    {
      year: "1962",
      title: "Clubhouse Construction",
      description: "The main clubhouse was built, featuring elegant dining facilities and gathering spaces that would become the heart of the Birchwood community."
    },
    {
      year: "1971",
      title: "Course Expansion",
      description: "Additional golf holes were added, creating the three distinct 9-hole courses that define Birchwood today: The Birches, The Woods, and The Farms."
    }
  ];

  return (
    <section id="about-history" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Our Rich Heritage
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Over a century of dedication to excellence, community, and the preservation 
            of Northern Michigan's natural beauty.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary-300 transform md:-translate-x-0.5"></div>

          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, index) => (
              <div key={event.year} className={`relative flex items-center ${
                index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
              }`}>
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-primary-600 rounded-full transform -translate-x-2 md:-translate-x-2 z-10 border-4 border-white shadow-lg"></div>
                
                {/* Content card */}
                <div className={`ml-16 md:ml-0 bg-gray-50 rounded-lg p-6 md:p-8 shadow-lg max-w-lg ${
                  index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                }`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-full font-bold text-lg">
                      {event.year}
                    </span>
                    <h3 className="text-2xl font-serif text-primary-950 font-bold">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-primary-50 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-serif text-primary-950 mb-4">
              Continuing the Legacy
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, Birchwood Farms Golf & Country Club continues to honor its heritage while 
              embracing the future. We remain committed to providing an exceptional experience 
              for our members and guests, maintaining the highest standards of service, and 
              preserving the natural beauty that makes Northern Michigan so special.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistory;
