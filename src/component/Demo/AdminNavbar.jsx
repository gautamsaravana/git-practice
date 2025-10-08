import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export const AdminNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleLogout = () => {
  localStorage.removeItem('userId');
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
      className={`fixed-top ${isScrolled ? 'shadow-sm' : ''}`}
      style={{
        width: '100%',
        backgroundColor: isScrolled ? '#ffffff' : '#ffffff',
        padding: '14px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        fontFamily: 'Helvetica, Arial, sans-serif',
        transition: 'all 0.3s ease',
        backgroundColor:"#FCFAFB",
        zIndex: '1030',
        height:"12%"
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
         <img
          src="/WhatsApp Image 2025-06-04 at 10.51.58_28d1c01a.jpg"
          alt="ExpressCinema Logo"
          style={{ height: '65px', width: '160px' }}
        />
        {/* <h4>
            <span className="text-danger" style={{fontWeight:"bold",fontSize:"24px"}}>Express </span>Cinema
          </h4> */}
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <NavLink to="/admin/movies" style={navLinkStyle}>
          Movie
        </NavLink>
        <NavLink to="/admin/screens" style={navLinkStyle}>
          Screen & Seat
        </NavLink>
        <NavLink to="/admin/moviesetuplist" style={navLinkStyle}>
          Movie Setup
        </NavLink>
        <NavLink to="/admin/users" style={navLinkStyle}>
          Booking History
        </NavLink>
        <NavLink to="/admin/moviebite" style={navLinkStyle}>
          Movie Bite
        </NavLink>
        <NavLink to="/" style={navLinkStyle} onClick={handleLogout}>
          Log Out
        </NavLink>
      </div>
    </div>
  );
};

export default AdminNavbar;
