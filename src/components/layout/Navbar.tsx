import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Heart, Search, Palette } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { categories } from '../../data/products';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cart } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Palette className="h-8 w-8 text-indigo-400" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 text-transparent bg-clip-text">
                Trios Art
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-300 hover:text-white flex items-center transition-colors">
                Shop
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map(category => (
                  <Link
                    key={category.id}
                    to={`/shop/${category.id}`}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Signed in as<br />
                    <span className="font-medium text-white">{user?.name}</span>
                  </div>
                  <div className="border-t border-gray-700"></div>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    Your Profile
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                    Your Orders
                  </Link>
                  <div className="border-t border-gray-700"></div>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Home
          </Link>
          <div className="block px-3 py-2 text-base font-medium text-white">
            <span>Shop</span>
            <div className="pl-4 mt-2 space-y-1">
              {categories.map(category => (
                <Link
                  key={category.id}
                  to={`/shop/${category.id}`}
                  className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Contact
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Your Profile
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Your Orders
              </Link>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 p-4 shadow-lg">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full p-2 rounded-l-md bg-gray-800 text-white border-0 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-r-md hover:bg-indigo-700 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}