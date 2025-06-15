const Cover = () => {
  const scrollToHero = () => {
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
      const heroTop = heroSection.offsetTop;
      window.scrollTo({
        top: heroTop - 80, // Adjust this value to fine-tune the scroll position
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/src/images/cover.jpg')`,
        }}
      >
        {/* Optional overlay for better text visibility if needed */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <button
          onClick={scrollToHero}
          className="group flex flex-col items-center space-y-2 text-white hover:text-primary-300 transition-colors duration-300 cursor-pointer"
          aria-label="Scroll down to hero section"
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
