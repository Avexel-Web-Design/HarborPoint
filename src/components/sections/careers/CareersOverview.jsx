const CareersOverview = () => {
  return (
    <section id="careers-overview" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-8">
            About Birchwood Farms
          </h2>
          <div className="prose lg:prose-lg mx-auto text-gray-700">
            <p className="text-lg leading-relaxed mb-6">
              Birchwood Farms Golf & Country Club is a private, residential community located 
              on the bluff of Lake Michigan, along the Famed Tunnel of Trees. The 1,600 acre 
              association boasts 27 holes of picturesque northern Michigan golf, Har-tru clay 
              tennis courts, pickleball courts, multiple dining facilities, fitness center and 
              an array of social activities.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              An abundance of trails for hiking, snow shoeing and cross country skiing offer 
              four seasons of recreational bliss throughout the Birchwood campus. Birchwood 
              continuously strives to be the premier private club in northern Michigan, where 
              their employees are empowered to provide excellence every day.
            </p>
            <div className="mt-12 bg-primary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold font-serif text-primary-950 mb-4">
                Why Work at Birchwood?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Excellence First</h4>
                  <p className="text-sm">
                    Join a team committed to providing exceptional service and maintaining 
                    the highest standards of hospitality.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Career Growth</h4>
                  <p className="text-sm">
                    We believe in empowering our employees and providing opportunities 
                    for professional development and advancement.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900 mb-2">Beautiful Setting</h4>
                  <p className="text-sm">
                    Work in one of northern Michigan's most beautiful locations, surrounded 
                    by natural beauty and world-class facilities.
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
