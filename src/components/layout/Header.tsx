import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoSvg from '../../images/logowhite.svg'
import nameLogo from '../../images/name.png'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Golf', path: '/golf' },
    { name: 'Lifestyle', path: '/lifestyle' },
    { name: 'Events', path: '/events' },
    { name: 'Membership', path: '/membership' },
    { name: 'Careers', path: '/careers' },
    { name: 'Community', path: '/community' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]
  return (    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      {/* Logo - Absolute positioned to screen corner */}
      <Link to="/" className="flex items-center space-x-3 absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 z-10">
        <img 
          src={logoSvg} 
          alt="Birchwood Farms Golf & Country Club" 
          className="h-14 w-14"
        />        <img 
          src={nameLogo} 
          alt="Birchwood Farms Golf & Country Club" 
          className="hidden sm:block lg:hidden [@media(min-width:1375px)]:block h-8"
        />
      </Link>
        <div className="max-w-7xl mx-auto relative">
        <div className="flex items-center justify-center h-20 relative px-4 sm:px-6 lg:px-8">
          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-1 backdrop-blur-sm rounded-full px-6 py-2 shadow-sm border border-white/20">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}                className="px-4 py-2 text-sm font-medium text-white hover:text-white/80 hover:bg-white/10 rounded-full transition-all duration-200 relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white transition-all duration-200 group-hover:w-3/4"></span>
              </Link>
            ))}          </nav>
        </div>
      </div>
      
      {/* Mobile menu button - Absolute positioned to screen corner */}
      <button
        className="lg:hidden absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-primary-200 hover:bg-white/10 rounded-full transition-all duration-200 z-10"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}        </svg>
      </button>
      
      {/* Mobile Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-white/20 backdrop-blur-sm">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-4 py-3 text-white hover:text-primary-200 hover:bg-white/10 rounded-lg transition-all duration-200 font-medium border-l-4 border-transparent hover:border-white/50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
