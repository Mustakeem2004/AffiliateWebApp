import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isAdmin, onLogout, darkMode, setDarkMode }) => {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-100'} border-b`}>
      <div className="container mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🛍️</span>
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              ShopLinks
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>

            {isAdmin && (
              <>
                <span className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                  Admin
                </span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
