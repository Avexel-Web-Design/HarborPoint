import { useState } from 'react'
import { Send, User, Mail, Phone, MessageCircle } from 'lucide-react'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
  };

  const inquiryTypes = [
    { value: 'general', label: 'General Information' },
    { value: 'membership', label: 'Membership Inquiry' },
    { value: 'events', label: 'Events & Weddings' },
    { value: 'golf', label: 'Golf Services' },
    { value: 'dining', label: 'Dining Reservations' },
    { value: 'real-estate', label: 'Real Estate' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-width section-padding">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-600">
              Have a question or would like more information? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-950 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-950 focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-950 focus:border-transparent transition-all duration-300"
                      placeholder="(231) 555-0123"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Inquiry Type
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-950 focus:border-transparent transition-all duration-300"
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-950 focus:border-transparent transition-all duration-300"
                    placeholder="What can we help you with?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-950 focus:border-transparent transition-all duration-300 resize-vertical"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full md:w-auto btn-primary flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-8 sticky top-8">
                <h3 className="text-2xl font-serif font-bold text-primary-950 mb-6">
                  Other Ways to Reach Us
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Quick Response</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      For immediate assistance, call our main line:
                    </p>
                    <a 
                      href="tel:231-526-2166" 
                      className="text-primary-950 font-semibold hover:text-primary-700 transition-colors"
                    >
                      (231) 526-2166
                    </a>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Email Direct</h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Send us an email and we'll respond within 24 hours:
                    </p>
                    <a 
                      href="mailto:info@birchwoodcc.com" 
                      className="text-primary-950 font-semibold hover:text-primary-700 transition-colors break-all"
                    >
                      info@birchwoodcc.com
                    </a>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Visit Us</h4>
                    <p className="text-gray-600 text-sm">
                      600 Birchwood Drive<br />
                      Harbor Springs, MI 49740
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Follow Us</h4>
                    <div className="flex space-x-4">
                      <a 
                        href="https://www.facebook.com/Birchwoodcc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-950 hover:text-primary-700 transition-colors"
                      >
                        Facebook
                      </a>
                      <a 
                        href="https://www.instagram.com/birchwoodfarmsgcc/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-950 hover:text-primary-700 transition-colors"
                      >
                        Instagram
                      </a>
                      <a 
                        href="https://www.x.com/birchwoodcc/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-950 hover:text-primary-700 transition-colors"
                      >
                        X
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
