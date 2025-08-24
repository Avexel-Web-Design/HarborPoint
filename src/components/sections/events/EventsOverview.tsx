import weddingImage from '../../../images/wedding.jpg'

const EventsOverview = () => {
  return (
    <section id="events-overview" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950">
                Clubhouse Dining & Events
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                The Harbor Point Golf Club dining room and 19th Hole Bar provide an elegant setting 
                for dining and social gatherings. Available for use by Golf Club & Social Members, 
                Harbor Point Residents, and their guests from June 9th to September 1st.
              </p>
              
              <p className="text-lg leading-relaxed">
                Our Summer Suppers are a long standing tradition at Harbor Point Golf Club. 
                We host special dinner events including "Perch on the Porch" - our most popular 
                dinner experience featuring Pan Fried Perch, Corn Pudding, and Homemade Rolls 
                served buffet style with spectacular views.
              </p>
              
              <p className="text-lg leading-relaxed">
                Harbor Point Golf Club Members and Harbor Point Residents have the ability to rent 
                out the clubhouse facility for private events. We offer personalized service for 
                weddings, corporate events, and special occasions with our spectacular Lake Michigan views.
              </p>
              
              <p className="text-lg leading-relaxed">
                Lunch service is available Monday-Saturday from 11am-3pm during the season. 
                For reservations and private event inquiries, please contact the Clubhouse Manager 
                at (231) 526-2511.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={weddingImage} 
                alt="Clubhouse Dining at Harbor Point Golf Club" 
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-200 rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary-300 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsOverview;
