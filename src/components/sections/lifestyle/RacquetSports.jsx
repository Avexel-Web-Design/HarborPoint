const RacquetSports = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-950 font-serif mb-4">
            Racquet Sports
          </h2>
          <div className="w-24 h-1 bg-primary-700 mx-auto mb-6"></div>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto">
            World-class facilities for tennis, pickleball, and bocce enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Tennis Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Tennis Program
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                The Birchwood Tennis Program, offering <strong>nine Har-Tru Clay courts</strong>, will meet all 
                your individual and family tennis needs. Adult-group, private instruction and 
                daily organized play is available.
              </p>
              <p className="text-lg">
                Birchwood's junior program offers opportunities for players of all levels to receive 
                quality instruction. Private, Semi-Private and small group clinics are available by 
                appointment with our highly experienced Racquet Sports Professionals.
              </p>
              <p className="text-lg">
                The adult program features a blend of tournaments, mixers and social events, 
                with all Members and guests welcome.
              </p>
            </div>
          </div>

          {/* Tennis Image Placeholder */}
          <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl bg-primary-100">
              <div className="flex items-center justify-center">
                <div className="text-center text-primary-700">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p className="text-lg font-medium">Tennis Courts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Pickleball Image Placeholder */}
          <div className="relative lg:order-1">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl bg-primary-100">
              <div className="flex items-center justify-center">
                <div className="text-center text-primary-700">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p className="text-lg font-medium">Pickleball Courts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickleball Content */}
          <div className="space-y-6 lg:order-2">
            <h3 className="text-3xl font-bold text-primary-950 font-serif">
              Pickleball & Bocce
            </h3>
            <div className="space-y-4 text-primary-800 leading-relaxed">
              <p className="text-lg">
                Birchwood also offers a very active <strong>Pickleball Program</strong>, that includes open play, 
                clinics and leagues, on four dedicated Pickleball courts.
              </p>
              <p className="text-lg">
                Pickleball is one of the fastest growing sports across the nation, and is a wonderful 
                <strong> family sport</strong> that grandparents, parents, children and grandchildren can all enjoy together.
              </p>
              <p className="text-lg">
                Multiple dedicated <strong>bocce lanes</strong> finish out the Racquet Sports offerings, 
                providing another fun activity for members to enjoy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RacquetSports
