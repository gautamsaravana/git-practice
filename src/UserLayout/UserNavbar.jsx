import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const UserNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const userId = localStorage.getItem('userId');
      setIsLoggedIn(!!userId);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus); // to listen for changes in other tabs too

    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    navigate('/'); // redirect to home
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#007bff' : '#333',
    fontWeight: isActive ? 'bold' : '900',
    padding: '10px 18px',
    borderRadius: '8px',
    backgroundColor: isActive ? '#e6f0ff' : 'transparent',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    letterSpacing: '0.5px',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '80px',
        backgroundColor: isScrolled ? '#ffffff' : '#ffffff',
        padding: '14px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        fontFamily: 'Helvetica, Arial, sans-serif',
        transition: 'all 0.3s ease',
        zIndex: '1030',
        backgroundColor:`#FCFAFB`,
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/WhatsApp Image 2025-06-04 at 10.51.58_28d1c01a.jpg"
          alt="ExpressCinema Logo"
          style={{ height: '70px', width: '160px' }}
        />
        {/* <h4>
          <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'black' }}>
            <span className='text-danger'>Express </span>Cinema
          </span>
        </h4> */}
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <NavLink to="/" style={navLinkStyle}>
          Home
        </NavLink>
        <NavLink to="/movies" style={navLinkStyle}>
          Movies
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink to="/bookings" style={navLinkStyle}>
              My Bookings
            </NavLink>
            
          </>
        )}
        {!isLoggedIn && (
          <NavLink to="/login" style={navLinkStyle}>
            Login
          </NavLink>
        )}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#333',
              fontWeight: '900',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default UserNavbar;
