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
                Plan Your Special Day With Us
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                Birchwood Farms Golf & Country Club is a private, residential golf community 
                nestled in the rolling hills of Harbor Springs, Michigan. We are a premier wedding 
                venue showcasing spectacular Lake Michigan views and emphasizing priority on 
                membership experiences and satisfaction.
              </p>
              
              <p className="text-lg leading-relaxed">
                Our members receive preferred booking and incentivized pricing. We do accept a 
                limited number of non-member weddings each year, dependent on availability. However, 
                we offer a wide-range of membership options to fit your unique lifestyle.
              </p>
              
              <p className="text-lg leading-relaxed">
                Weddings receive unmatched personalized and professional service from our Catering 
                Department. Your Vision is our Vision for your special day and it is our sole focus 
                the day of your event. Unlike venues that host multiple weddings on the same day, 
                you are it! From the first look to the last dance, you have our full attention.
              </p>
              
              <p className="text-lg leading-relaxed">
                We offer upfront pricing and our inclusive packages offer everything you need to have 
                an amazing day at Birchwood Farms. Our inclusive packages include room rental, food, 
                bar, service fee, tax, and more. There are no hidden fees! We take your budget 
                seriously so you can focus on the details.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={weddingImage} 
                alt="Wedding at Birchwood Farms" 
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
