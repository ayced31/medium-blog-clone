import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="medium-container">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-gray-900 medium-typography">
            Medium
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/login" className="medium-nav-link">
              Sign in
            </Link>
            <Link 
              to="/signup" 
              className="medium-button-primary"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};