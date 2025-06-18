import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';

const AboutContact = () => {
  const contactInfo = [
    {
      icon: faPhone,
      title: "Clubhouse & Membership",
      details: ["(231) 526-2166", "Toll Free: (800) 915-0829"]
    },
    {
      icon: faPhone,
      title: "Golf Pro Shop",
      details: ["(231) 526-6245"]
    },
    {
      icon: faPhone,
      title: "Racquet Sports Center",
      details: ["(231) 526-2372"]
    },
    {
      icon: faPhone,
      title: "Security/Emergency",
      details: ["(231) 526-2751"]
    }
  ];

  const additionalContacts = [
    {
      title: "Golf Course Maintenance",
      phone: "(231) 526-2683"
    },
    {
      title: "General Maintenance",
      phone: "(231) 526-7460"
    },
    {
      title: "Clubhouse Fax",
      phone: "(231) 526-9411"
    }
  ];

  return (
    <section id="about-contact" className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
            Contact Information
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We look forward to welcoming you at Birchwood Farms Golf & Country Club! 
            Get in touch with us for any inquiries or assistance.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Main Contact Information */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif text-primary-950 mb-8">
              Club Phone Numbers
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((contact, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <FontAwesomeIcon icon={contact.icon} className="w-6 h-6 text-primary-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-primary-950">
                      {contact.title}
                    </h4>
                  </div>
                  {contact.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700 mb-1">
                      <a href={`tel:${detail.replace(/[^\d]/g, '')}`} className="hover:text-primary-600 transition-colors">
                        {detail}
                      </a>
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* Additional Contacts */}
            <div className="bg-primary-50 rounded-lg p-6">
              <h4 className="text-xl font-serif text-primary-950 mb-4">
                Additional Contacts
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                {additionalContacts.map((contact, index) => (
                  <div key={index} className="text-center">
                    <p className="font-semibold text-primary-950 mb-1">
                      {contact.title}
                    </p>
                    <p className="text-gray-700">
                      <a href={`tel:${contact.phone.replace(/[^\d]/g, '')}`} className="hover:text-primary-600 transition-colors">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address and Social Media */}
          <div className="space-y-8">
            <div className="bg-primary-600 text-white rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-6 h-6 mr-3" />
                <h4 className="text-xl font-serif">Visit Us</h4>
              </div>
              <p className="mb-4 leading-relaxed">
                600 Birchwood Drive<br />
                Harbor Springs, MI 49740
              </p>
              <a 
                href="https://goo.gl/maps/hyEArE7cCdAdgCNc8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white text-primary-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Directions
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faEnvelope} className="w-6 h-6 mr-3 text-primary-600" />
                <h4 className="text-xl font-serif text-primary-950">Email Us</h4>
              </div>
              <p className="text-gray-700">
                <a href="mailto:info@birchwoodcc.com" className="hover:text-primary-600 transition-colors">
                  info@birchwoodcc.com
                </a>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-xl font-serif text-primary-950 mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/Birchwoodcc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/birchwoodfarmsgcc/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
                </a>
                <a 
                  href="https://x.com/birchwoodcc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 text-center">
              <h4 className="text-xl font-serif text-primary-950 mb-4">
                Career Opportunities
              </h4>
              <p className="text-gray-700 mb-4">
                Join the premier private club of Northern Michigan
              </p>
              <a 
                href="/careers" 
                className="inline-block bg-primary-600 text-white px-6 py-2 rounded font-semibold hover:bg-primary-700 transition-colors"
              >
                Work at Birchwood
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
