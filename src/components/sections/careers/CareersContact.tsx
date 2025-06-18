import { Mail, Phone, MapPin } from 'lucide-react'

const CareersContact = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
              Contact Human Resources
            </h2>
            <p className="text-lg text-gray-700">
              Have questions about career opportunities at Birchwood? 
              We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold font-serif text-primary-950 mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-4">                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary-950">Email</p>
                      <a 
                        href="mailto:brooke@birchwoodcc.com"
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-300"
                      >
                        brooke@birchwoodcc.com
                      </a>
                    </div>
                  </div>
                    <div className="flex items-start">
                    <Phone className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary-950">Phone</p>
                      <a 
                        href="tel:231-526-2166"
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-300"
                      >
                        (231) 526-2166
                      </a>
                    </div>
                  </div>
                    <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-primary-950">Address</p>
                      <a 
                        href="https://goo.gl/maps/hyEArE7cCdAdgCNc8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-300"
                      >
                        600 Birchwood Drive<br />
                        Harbor Springs, MI 49740
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-primary-950 mb-3">
                  Application Process
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  All applications are processed through our online portal. Click the "Apply Now" 
                  button to view current openings and submit your application. We review all 
                  applications carefully and will contact qualified candidates for interviews.
                </p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col justify-center">              <div className="bg-primary-900 text-white p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold font-serif mb-4">
                  Questions About Careers?
                </h3>
                <p className="text-primary-100 mb-6">
                  Our Human Resources team is here to help! Contact us if you have questions 
                  about our application process, available positions, or working at Birchwood.
                </p>
                <div className="space-y-4">
                  <button 
                    onClick={() => {
                      const applicationsSection = document.getElementById('careers-applications');
                      if (applicationsSection) {
                        const applicationsTop = applicationsSection.offsetTop;
                        window.scrollTo({
                          top: applicationsTop,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="btn-primary bg-white text-primary-950 hover:bg-gray-100 inline-block w-full"
                  >
                    View Job Openings
                  </button>
                  <p className="text-primary-200 text-sm">
                    Equal Opportunity Employer
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <h4 className="text-lg font-semibold text-primary-950 mb-3">
                  Follow Us
                </h4>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="https://www.facebook.com/Birchwoodcc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-300"
                  >
                    Facebook
                  </a>
                  <span className="text-gray-400">|</span>
                  <a 
                    href="https://www.instagram.com/birchwoodfarmsgcc/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-300"
                  >
                    Instagram
                  </a>
                  <span className="text-gray-400">|</span>
                  <a 
                    href="https://x.com/birchwoodcc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 transition-colors duration-300"
                  >
                    X
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CareersContact
