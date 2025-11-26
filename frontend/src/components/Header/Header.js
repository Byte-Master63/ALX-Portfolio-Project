import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import Button from '../Button/Button';
import './Header.css';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">Money Mate</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>
            <span className="nav-icon">👤</span>
            Profile
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* User Menu - Desktop */}
          <div className="user-menu desktop-only">
            <button className="user-button" onClick={toggleDropdown}>
              <span className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
            </button>

            {showDropdown && (
              <>
                <div className="dropdown-backdrop" onClick={() => setShowDropdown(false)} />
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">👤</span>
                    Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button mobile-only"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <>
          <div className="mobile-backdrop" onClick={closeMobileMenu} />
          <nav className="mobile-nav">
            <div className="mobile-nav-header">
              <div className="mobile-user-info">
                <div className="user-avatar-large">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="mobile-user-name">{user?.name}</p>
                  <p className="mobile-user-email">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="mobile-nav-links">
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive('/')}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className={`mobile-nav-link ${isActive('/profile')}`}
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">👤</span>
                Profile
              </Link>
            </div>

            <div className="mobile-nav-footer">
              <button className="mobile-logout-button" onClick={handleLogout}>
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;
