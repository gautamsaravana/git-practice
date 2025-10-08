// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';

// const PrivateRoute = ({ allowedRoles }) => {
//   const userId = localStorage.getItem('userId');
//   const roleId = parseInt(localStorage.getItem('roleId'), 10);

//   if (!userId) {
    
//     return <Navigate to="/" replace />;
//   }

//   if (!allowedRoles.includes(roleId)) {
    
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />; 
// };

// export default PrivateRoute;