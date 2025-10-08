import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const Adminsidebar = () => {
  return (
    <div
      style={{
        width: '300px',
        // height: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '40px',
        borderRight: '1px solid #ddd',
        borderRadius: '0px',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        fontFamily: 'serif',
        fontSize: '20px'
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* <NavLink
          to="/admindashboard"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : 'black',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            padding: '8px 12px',
            borderRadius: '8px',
          })}
        >
          📊 Dashboard
        </NavLink> */}
                <NavLink
          to="/admin/moviesetup"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : 'black',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            padding: '8px 12px',
            borderRadius: '8px',
          })}
        >
        🎬 Movie Setup
        </NavLink>
        <NavLink
          to="/admin/movies"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : 'black',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            padding: '8px 12px',
            borderRadius: '8px',
          })}
        >
          🎥 Movies
        </NavLink>
                <NavLink
          to="/admin/screens"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : 'black',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            padding: '8px 12px',
            borderRadius: '8px',
          })}
        >
          🏟️ Screens & Seats
        </NavLink>

        <NavLink
          to="/admin/users"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : 'black',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            padding: '8px 12px',
            borderRadius: '8px',
          })}
        >
          👥 Users Booking History
        </NavLink>

        





        <NavLink
          to="/admin/moviebite"
          style={({ isActive }) => ({
            textDecoration: 'none',
            color: isActive ? '#007bff' : 'black',
            fontWeight: isActive ? 'bold' : 'normal',
            backgroundColor: isActive ? '#e9ecef' : 'transparent',
            padding: '8px 12px',
            borderRadius: '8px',
          })}
        >
          🎥 MovieBite 🍿
        </NavLink>

        <hr />

        <NavLink
          to="/logout"
          style={{
            textAlign: 'center',
          }}
        >
          <Button style={{ backgroundColor: '#cf6c65' }}>Logout</Button>
        </NavLink>
      </nav>
    </div>
  );
};
