import { Link } from 'react-router-dom'
import BirchwoodLogo from '../ui/BirchwoodLogo'

const Footer = () => {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="container-width section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <BirchwoodLogo className="h-10 w-10 text-white" />
              <div className="flex flex-col">
                <span className="text-xl font-bold font-serif">
                  Birchwood Farms
                </span>
                <span className="text-sm text-primary-200 font-sans tracking-wide">
                  GOLF & COUNTRY CLUB
                </span>
              </div>
            </Link>
            <p className="text-primary-200 mb-6 max-w-md font-serif leading-relaxed">
              Experience the perfect blend of championship golf, fine dining, and 
              exclusive membership privileges in a stunning natural setting.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons - placeholders for now */}
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-200 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.338-1.297C3.595 14.135 3.018 12.014 3.018 9.405c0-2.611.577-4.732 2.093-6.298C6.001 1.74 7.152 1.25 8.449 1.25c1.297 0 2.448.49 3.338 1.857 1.516 1.566 2.093 3.687 2.093 6.298 0 2.609-.577 4.73-2.093 6.296-.89 1.297-2.041 1.287-3.338 1.287z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/golf" className="text-primary-200 hover:text-white transition-colors">Golf</Link></li>
              <li><Link to="/dining" className="text-primary-200 hover:text-white transition-colors">Dining</Link></li>
              <li><Link to="/events" className="text-primary-200 hover:text-white transition-colors">Events</Link></li>
              <li><Link to="/membership" className="text-primary-200 hover:text-white transition-colors">Membership</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4">Contact</h3>
            <div className="space-y-2 text-primary-200">
              <p>123 Birchwood Drive</p>
              <p>Golf Valley, State 12345</p>
              <p>(555) 123-4567</p>
              <p>info@birchwoodfarms.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-800 mt-12 pt-8 text-center text-primary-300">
          <p>&copy; 2025 Birchwood Farms Golf & Country Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
