import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-2 mt-auto border-top">
      <div className="container text-center">
        {/* Brand */}
        <div className="mb-2">
          <h4>
            <span className="text-danger">Express</span>Cinema
          </h4>
        </div>

        {/* Navigation Links */}
        <div className="mb-2">
          <a href="/" className="text-light mx-2 text-decoration-none">Home</a>
          <a href="/movies" className="text-light mx-2 text-decoration-none">Movies</a>
          <a href="/about" className="text-light mx-2 text-decoration-none">About</a>
          <a href="/contact" className="text-light mx-2 text-decoration-none">Contact</a>
        </div>

        {/* Contact Information */}
        <div className="text-secondary small">
          <p className="mb-1">Email: support@expresscinema.com | Phone: +91 7095680082 </p>
          <p className="mb-0">© {new Date().getFullYear()} ExpressCinema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
