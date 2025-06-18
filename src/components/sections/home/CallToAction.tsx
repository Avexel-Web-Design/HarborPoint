import { Link } from 'react-router-dom'
import overheadImg from '../../../images/overhead.png'

const CallToAction = () => {
  return (
    <>
      {/* You Belong Here Section */}
      <section className="py-20 bg-primary-950 text-white relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${overheadImg})` }}
        >
          <div className="absolute inset-0 bg-primary-950 bg-opacity-70"></div>
        </div>

        <div className="container-width section-padding relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold font-serif">
                YOU BELONG HERE
              </h2>
              <div className="w-32 h-1 bg-white mx-auto"></div>
            </div>
            
            <p className="text-xl leading-relaxed text-primary-100 font-serif max-w-3xl mx-auto">
              Join the distinguished members of Birchwood Farms and become part of 
              a legacy that celebrates the finest traditions of northern Michigan hospitality, 
              championship golf, and lifelong friendships.
            </p>
            
            <div className="space-y-8">
              <Link to="/membership" className="btn-primary inline-block text-lg px-8 py-4">
                Learn More About Membership At Birchwood
              </Link>
              
              <div className="text-primary-200">
                <p className="mb-4">Ready to experience the Birchwood difference?</p>
                <div className="space-y-2">
                  <p>600 Birchwood Drive, Harbor Springs, MI 49740</p>
                  <p>(231) 526-2166</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default CallToAction
