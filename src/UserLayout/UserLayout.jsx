import React from 'react';
import { Outlet } from 'react-router-dom';
import { UserNavbar } from './UserNavbar';
import Footer from '../component/Demo/Footer';

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <UserNavbar />

      {/* Main content area */}
      <main className="flex-grow-1 py-0" style={{ marginTop: '0px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UserLayout;
