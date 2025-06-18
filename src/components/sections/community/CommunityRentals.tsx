const CommunityRentals = () => {
  return (
    <section id="community-rentals" className="py-20 bg-gray-50">
      <div className="container-width">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-primary-950 mb-6">
              Renting a Birchwood Home
            </h2>
            <p className="text-xl text-gray-600">
              Information for those interested in renting within our community
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-primary-950 mb-4">
                Important Information
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Birchwood does not directly handle the rental/lease agreements for homes within 
                the community. However, to access the amenities of the Association, renters must 
                complete the Registration and House Account forms and pay the Association Access Fee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-primary-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-primary-950 mb-4">
                  Rental Requirements
                </h4>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete Registration Form and House Account Form
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Pay the Association Access Fee
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Subject to Renter Rules & Regulations
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    One person and spouse/children under 21 per rental
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-primary-950 mb-4">
                  Access Fees
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  One Access Fee per dwelling (non-refundable) for maximum of six Rental Guest Cards:
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="font-medium">In Season</span>
                    <span className="font-bold text-primary-600">$750.00</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    (May 1 - September 30)
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="font-medium">Off Season</span>
                    <span className="font-bold text-primary-600">$250.00</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    (October 1 - April 30)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                Important Note
              </h4>
              <p className="text-sm text-yellow-700">
                The Access Fee is optional for those renting within the community. Renters are not 
                "guests" of the homeowner and may not be signed up as a guest by a homeowner. If 
                renters do not pay the Access Fee and obtain a Renter Card, they do not have 
                privileges to use the Birchwood amenities.
              </p>
            </div>

            <div className="mt-8 text-center">
              <h4 className="text-lg font-semibold text-primary-950 mb-4">
                Ready to Get Started?
              </h4>
              <p className="text-gray-600 mb-6">
                Download the rental packet and email completed forms to our Accounting Department
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Download Rental Packet
                </button>
                <a href="mailto:AR@birchwoodcc.com" className="btn-secondary">
                  Email Accounting Department
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunityRentals
