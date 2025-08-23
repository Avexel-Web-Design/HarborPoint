import { MapPin, Phone, Clock, Users, Shield } from 'lucide-react'

const ContactInfo = () => {
  const contactSections = [
    {
      title: "General Information",
      icon: <Phone className="w-6 h-6" />,
      contacts: [
        { label: "Clubhouse", phone: "(231) 526-6000", primary: true },
        { label: "Email Inquiries", email: "info@harborpointgolf.com" }
      ]
    },
    {
      title: "Golf Services",
      icon: <Users className="w-6 h-6" />,
      contacts: [
        { label: "Golf Pro Shop", phone: "(231) 526-6001" },
        { label: "Tee Time Reservations", phone: "(231) 526-6002" }
      ]
    },
    {
      title: "Dining & Events",
      icon: <Users className="w-6 h-6" />,
      contacts: [
        { label: "Dining Reservations", phone: "(231) 526-6003" },
        { label: "Private Events", phone: "(231) 526-6004" }
      ]
    },
    {
      title: "Membership",
      icon: <Shield className="w-6 h-6" />,
      contacts: [
        { label: "Membership Director", phone: "(231) 526-6005" },
        { label: "Member Services", phone: "(231) 526-6006" }
      ]
    }
  ];

  return (
    <section id="contact-info" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
            Contact Information
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our dedicated team is here to assist you with all your needs at Harbor Point Golf Club
          </p>
        </div>

        {/* Address and Hours */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Address */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-primary-950 text-white p-3 rounded-full mr-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary-950">Visit Us</h3>
            </div>
            <div className="space-y-3">
              <p className="text-lg text-gray-700">
                1 Harbor Point Drive<br />
                Harbor Point, MI 49740
              </p>
              <a 
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn-secondary mt-4"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-primary-950 text-white p-3 rounded-full mr-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-primary-950">Hours</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Clubhouse</span>
                <span className="text-gray-600">7:00 AM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Pro Shop</span>
                <span className="text-gray-600">6:30 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Dining</span>
                <span className="text-gray-600">11:00 AM - 9:00 PM</span>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                *Hours may vary seasonally. Please call ahead to confirm.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactSections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-primary-950 text-white p-2 rounded-full mr-3">
                  {section.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-primary-950">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-3">
                {section.contacts.map((contact, contactIndex) => (
                  <div key={contactIndex} className="border-b border-gray-100 pb-2 last:border-b-0">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {contact.label}
                    </div>
                    {contact.phone && (
                      <a 
                        href={`tel:${contact.phone.replace(/[^\d]/g, '')}`}
                        className={`text-sm hover:text-primary-700 transition-colors ${
                          (contact as any).primary ? 'text-primary-950 font-semibold' : 'text-gray-600'
                        }`}
                      >
                        {contact.phone}
                      </a>
                    )}
                    {(contact as any).email && (
                      <a 
                        href={`mailto:${(contact as any).email}`}
                        className="text-sm text-gray-600 hover:text-primary-700 transition-colors"
                      >
                        {(contact as any).email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contact */}
        <div className="mt-12 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <h3 className="text-lg font-serif font-bold text-red-800">Emergency Contact</h3>
              <p className="text-red-700">
                For emergencies on property, contact Security immediately at{' '}
                <a href="tel:231-526-6000" className="font-semibold underline">
                  (231) 526-6000
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
