import { Link } from 'react-router-dom'
import coverImage from '../../../images/cover.jpg'

const Cover = () => {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('welcome-section');
    if (nextSection) {
      const nextTop = nextSection.offsetTop;
      window.scrollTo({
        top: nextTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={coverImage} 
          alt="Harbor Point Golf Club" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white container-width section-padding">
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight">
            Harbor Point
            <span className="block text-primary-300">Golf Club</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-serif italic">
            Classic Resort Course - Harbor Springs, Michigan
          </p>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Enjoy Northern Michigan golf at its classical best. In the finest traditions of resort courses, 
            Harbor Point Golf Club offers a lasting and refined golf experience with spectacular views of Lake Michigan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/membership" className="btn-primary">
              Explore Membership
            </Link>
            <Link to="/golf" className="btn-secondary bg-white text-primary-950 hover:bg-gray-100">
              About Our Course
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={scrollToNextSection}
          className="group flex flex-col items-center space-y-2 text-white hover:text-primary-300 transition-colors duration-300 cursor-pointer"
          aria-label="Scroll down to next section"
        >
          <div className="animate-bounce">
            <svg 
              className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Cover;
