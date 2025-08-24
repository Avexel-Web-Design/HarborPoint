const AboutHistory = () => {
  const timelineEvents = [
    {
      year: "1896",
      title: "Early Beginnings",
      description: "Local history indicates a rough golf course was in play at the location of the Harbor Point Golf Course, marking the early beginnings of golf in Harbor Springs."
    },
    {
      year: "1899",
      title: "Course Development",
      description: "Alexander F. Stevenson of Chicago, along with others from the Midwest, formed a stock company to purchase the land and develop the course."
    },
    {
      year: "1899",
      title: "Design by David Foulis",
      description: "The course was designed by David Foulis, who was from the famous St. Andrews family of golfers, bringing Scottish golf tradition to Northern Michigan."
    },
    {
      year: "1941",
      title: "Harbor Point Association",
      description: "The course was taken over by the Harbor Point Association, which continues to manage the course today, ensuring its continued excellence and preservation."
    },
    {
      year: "2019",
      title: "Tournament Recognition",
      description: "Harbor Point hosted the GAM Women's Senior Championships, continuing its tradition of hosting prestigious golf events and tournaments."
    }
  ];

  return (
    <section id="about-history" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Harbor Point Golf Club History
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            One of Northern Michigan's oldest golf courses, with over 125 years of 
            golf tradition in Harbor Springs.
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
              Classic Resort Golf Today
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              Harbor Point Golf Club is one of the oldest courses in Northern Michigan. Most well known 
              for having superb greens, enjoyable routing and spectacular views of Lake Michigan, the club 
              was recognized as a great walker's course by Golf Digest Places to Play. We continue to honor 
              the traditions established by David Foulis while providing an exceptional golf experience.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistory;
