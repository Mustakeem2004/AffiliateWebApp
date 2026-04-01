import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError('Wrong password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Admin Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            Login
          </button>
        </form>

        <Link to="/" className="block text-center text-gray-400 hover:text-white mt-4 text-sm">
          ← Back
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
