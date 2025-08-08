import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Plus, Menu, X } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-primary-400">SociaLite</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/feed"
              className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Feed</span>
            </Link>
            
            <Link
              to="/create-post"
              className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Post</span>
            </Link>

            <Link
              to={`/profile/${user?.id}`}
              className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-dark-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span>{user?.username}</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-dark-300 hover:bg-dark-700 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark-300 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-dark-700 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/feed"
                className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Feed</span>
              </Link>
              
              <Link
                to="/create-post"
                className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="w-5 h-5" />
                <span>Create Post</span>
              </Link>

              <Link
                to={`/profile/${user?.id}`}
                className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-dark-300 hover:text-primary-400 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
