import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/members/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-950 to-primary-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold text-white mb-2">
              Birchwood Farms
            </h2>
            <p className="text-xl text-primary-200 font-serif italic mb-1">Golf & Country Club</p>
            <p className="text-primary-300">Member Portal</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white/10 backdrop-blur-md py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-white/20">            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-white/30 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/10 backdrop-blur-sm text-white"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-white/30 rounded-lg placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 bg-white/10 backdrop-blur-sm text-white"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-medium text-primary-950 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-serif"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white/10 backdrop-blur-sm text-white rounded-md">
                    New to Birchwood?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  to="/membership"
                  className="w-full inline-flex justify-center py-3 px-6 border border-white/30 rounded-lg shadow-lg bg-white/10 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/20 transition-all duration-200"
                >
                  Learn about membership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
