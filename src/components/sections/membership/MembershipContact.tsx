import { useState } from 'react'

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  retired: string;
  preferredCommunication: string;
  membershipInterest: string;
  hearAbout: string;
  hearAboutOther: string;
  golf: string;
  dining: string;
  pool: string;
  fitness: string;
  racquetSports: string;
  clubEvents: string;
  [key: string]: string;
}

const MembershipContact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    retired: '',
    preferredCommunication: '',
    membershipInterest: '',
    hearAbout: '',
    hearAboutOther: '',
    golf: '',
    dining: '',
    pool: '',
    fitness: '',
    racquetSports: '',
    clubEvents: ''
  });

  const [showThankYou, setShowThankYou] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setShowThankYou(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowThankYou(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        retired: '',
        preferredCommunication: '',
        membershipInterest: '',
        hearAbout: '',
        hearAboutOther: '',
        golf: '',
        dining: '',
        pool: '',
        fitness: '',
        racquetSports: '',
        clubEvents: ''
      });
    }, 3000);
  };

  return (
    <section id="contact-form" className="py-20 bg-gray-50">
      <div className="container-width section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif text-primary-950 mb-4">
              Request Information
            </h2>
            <p className="text-xl text-gray-600">
              Inquire about Membership at Birchwood
            </p>
          </div>

          {showThankYou ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-green-800 mb-2">
                Thank You for Your Inquiry!
              </h3>
              <p className="text-green-700">
                We will follow up shortly with more information about membership at Birchwood.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label htmlFor="street" className="block text-sm font-semibold text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Retired?
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="retired"
                        value="yes"
                        checked={formData.retired === 'yes'}
                        onChange={handleInputChange}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="retired"
                        value="no"
                        checked={formData.retired === 'no'}
                        onChange={handleInputChange}
                        className="mr-2 text-primary-600 focus:ring-primary-500"
                      />
                      No
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="preferredCommunication" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Communication
                  </label>
                  <select
                    id="preferredCommunication"
                    name="preferredCommunication"
                    value={formData.preferredCommunication}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="phone">Phone Call</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="membershipInterest" className="block text-sm font-semibold text-gray-700 mb-2">
                    What Membership Are You Most Interested In?
                  </label>
                  <select
                    id="membershipInterest"
                    name="membershipInterest"
                    value={formData.membershipInterest}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="general">General</option>
                    <option value="social">Social</option>
                    <option value="junior">Junior</option>
                    <option value="associate">Associate</option>
                    <option value="emeritus">Emeritus</option>
                    <option value="property">Property</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hearAbout" className="block text-sm font-semibold text-gray-700 mb-2">
                    How Did You Hear About Birchwood?
                  </label>
                  <select
                    id="hearAbout"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="social-media">Social Media</option>
                    <option value="current-member">Current Member</option>
                    <option value="friend">Friend</option>
                    <option value="tv-ad">TV Ad</option>
                    <option value="print-ad">Print Ad</option>
                    <option value="local-realtor">Local Realtor</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {formData.hearAbout === 'other' && (
                <div className="mb-6">
                  <label htmlFor="hearAboutOther" className="block text-sm font-semibold text-gray-700 mb-2">
                    Please specify:
                  </label>
                  <input
                    type="text"
                    id="hearAboutOther"
                    name="hearAboutOther"
                    value={formData.hearAboutOther}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
              )}

              {/* Interest Levels */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  What is your level of interest in the following activities? (1-10 scale)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { key: 'golf', label: 'Golf' },
                    { key: 'dining', label: 'Dining' },
                    { key: 'pool', label: 'Pool' },
                    { key: 'fitness', label: 'Fitness Center' },
                    { key: 'racquetSports', label: 'Racquet Sports' },
                    { key: 'clubEvents', label: 'Club Events' }
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      <select
                        id={key}
                        name={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      >
                        <option value="">Select...</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn-primary px-12 py-4 text-lg"
                >
                  Submit Request
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 text-center">
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Birchwood Farms Golf & Country Club</strong>
              </p>
              <p className="text-gray-600">
                600 Birchwood Drive, Harbor Springs, MI 49740
              </p>
              <p className="text-gray-600">
                Phone: <a href="tel:231-526-2166" className="text-primary-600 hover:text-primary-700">(231) 526-2166</a>
              </p>
            </div>
            <div className="flex justify-center space-x-6 mt-6">
              <a href="https://www.facebook.com/Birchwoodcc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/birchwoodfarmsgcc/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.897 16.92c.687.687 1.651 1.116 2.694 1.116c2.096 0 3.793-1.697 3.793-3.793c0-2.096-1.697-3.793-3.793-3.793c-1.043 0-2.007.429-2.694 1.116l1.229 1.229c.875-.807 2.026-1.297 3.323-1.297c2.527 0 4.571 2.044 4.571 4.571s-2.044 4.571-4.571 4.571z"/>
                </svg>
              </a>
              <a href="https://twitter.com/birchwoodcc" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MembershipContact;
