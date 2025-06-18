import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import logoWhite from '../../images/logowhite.svg'
import wordmark from '../../images/name.png'

const Footer = () => {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="container-width section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">            <Link to="/" className="flex items-center space-x-3 mb-6">
              <img 
                src={logoWhite} 
                alt="Birchwood Farms Logo" 
                className="h-10 w-10" 
              />
              <img 
                src={wordmark} 
                alt="Birchwood Farms Golf & Country Club" 
                className="h-9" 
              />
            </Link>
            <p className="text-primary-200 mb-6 max-w-md font-serif leading-relaxed">
              Experience the perfect blend of championship golf, fine dining, and 
              exclusive membership privileges in a stunning natural setting.
            </p>            <div className="flex space-x-4">
              {/* Social Media Icons */}
              <a href="https://www.facebook.com/Birchwoodcc" className="text-primary-200 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Facebook</span>
                <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/birchwoodfarmsgcc/" className="text-primary-200 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Instagram</span>
                <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
              </a>
              <a href="https://x.com/birchwoodcc" className="text-primary-200 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Twitter</span>
                <FontAwesomeIcon icon={faXTwitter} className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4"> </h3>
            <ul className="space-y-2">
              <li><Link to="/golf" className="text-primary-200 hover:text-white transition-colors"> </Link></li>
              <li><Link to="/dining" className="text-primary-200 hover:text-white transition-colors"> </Link></li>
              <li><Link to="/events" className="text-primary-200 hover:text-white transition-colors"> </Link></li>
              <li><Link to="/membership" className="text-primary-200 hover:text-white transition-colors"> </Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-4">Contact</h3>
            <div className="space-y-2 text-primary-200">
              <p>600 Birchwood Drive</p>
              <p>Harbor Springs, MI 49740</p>
              <p>(231) 526-2166</p>
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
