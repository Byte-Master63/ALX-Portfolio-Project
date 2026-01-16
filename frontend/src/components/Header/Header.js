import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../Button/Button';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate('/profile');
  };

  const handleDashboardClick = () => {
    setShowDropdown(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showDropdown) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showDropdown]);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">Money Mate</span>
        </Link>

        <nav className="header-nav">
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="user-button" 
              onClick={toggleDropdown}
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <span className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
            </button>

            {showDropdown && (
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-header">
                  <p className="dropdown-name">{user?.name}</p>
                  <p className="dropdown-email">{user?.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item" 
                  onClick={handleDashboardClick}
                  role="menuitem"
                >
                  <span className="dropdown-icon">📊</span>
                  Dashboard
                </button>
                <button 
                  className="dropdown-item" 
                  onClick={handleProfileClick}
                  role="menuitem"
                >
                  <span className="dropdown-icon">👤</span>
                  My Profile
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item" 
                  onClick={handleLogout}
                  role="menuitem"
                >
                  <span className="dropdown-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
