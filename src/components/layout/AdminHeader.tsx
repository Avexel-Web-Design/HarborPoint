import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'
import logoSvg from '../../images/logo.svg'
import nameLogo from '../../images/name.png'

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { logout } = useAdminAuth()
  
  return (
    <header className="bg-primary-950 shadow-lg relative z-50">
      {/* Logo and Title Section */}
      <div className="container-width section-padding">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <img 
              src={logoSvg} 
              alt="Birchwood Farms Golf & Country Club" 
              className="h-12 w-12"
            />            <div className="flex flex-col">
              <img 
                src={nameLogo} 
                alt="Birchwood Farms Golf & Country Club" 
                className="h-6 hidden sm:block"
              />
            </div>
          </Link>          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-primary-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Main Site
            </Link>
            <button
              onClick={logout}
              className="bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white hover:text-primary-200 hover:bg-primary-800 rounded-md transition-colors duration-200"
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
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-900 border-t border-primary-800">          <div className="container-width section-padding py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-primary-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Main Site
              </Link>
              <button
                onClick={() => {
                  logout()
                  setIsMenuOpen(false)
                }}
                className="bg-primary-800 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 text-left"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default AdminHeader
