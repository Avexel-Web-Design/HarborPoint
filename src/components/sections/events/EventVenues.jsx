import weddingImage from '../../../images/wedding.jpg'
import weddingImage2 from '../../../images/wedding2.jpg'
import weddingImage3 from '../../../images/wedding3.jpg'
import diningImage from '../../../images/wedding4.jpg'

const EventGallery = () => {
  const images = [
    {
      src: weddingImage,
      alt: "Wedding Ceremony at Birchwood Farms"
    },
    {
      src: weddingImage2,
      alt: "Wedding Ceremony at Birchwood Farms"
    },
    {
      src: weddingImage3,
      alt: "Wedding at Birchwood Farms"
    },
    {
      src: diningImage,
      alt: "Elegant Dining Experience"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-4">
            Stunning Views, Unparalleled Service
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            The culinary department will not disappoint your guests. We work with local farms and the best 
            purveyors in the area to serve only the freshest and highest quality of ingredients. Our 
            mouthwatering cuisine will be a highlight of your celebration at Birchwood Farms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            Stunning views, unparalleled service, inclusive pricing and exquisite cuisine, 
            what are you waiting for? Contact our Director of Catering at (231) 526-2166, ext. 543, 
            to start planning the most exciting day of your life!
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventGallery;
