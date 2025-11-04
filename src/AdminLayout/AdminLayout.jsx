import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../component/Demo/AdminNavbar';
import Footer from '../component/Demo/Footer';

const AdminLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <main className="flex-grow-1 pt-3 mt-2">
  <Outlet />
</main>

      <Footer />
    </div>
  );
};

export default AdminLayout;
