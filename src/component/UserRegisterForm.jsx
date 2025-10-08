import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import UserService from '../service/UserService';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.css';

export const UserRegisterForm = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: ""
  });

  const [errMsgs, setErrMsgs] = useState({
    userName: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedUserData = { ...userData, [name]: value };
    const updatedErrors = { ...errMsgs };

    if (name === 'user_name') {
      updatedErrors.userName = !/^[a-zA-Z\s]+$/.test(value)
        ? "Name should only contain letters"
        : "";
    } else if (name === 'email') {
      updatedErrors.email = !/^[a-zA-Z0-9._%+-]+@[a-z0-9]+\.[a-z]{2,4}$/.test(value)
        ? "Enter a valid email address"
        : "";
    } else if (name === 'phone') {
      updatedErrors.phone = !/^(?:0|91)?[6-9][0-9]{9}$/.test(value)
        ? "Enter a valid phone number"
        : "";
    } else if (name === 'password') {
      updatedErrors.password = value.length < 8
        ? "Password must be at least 8 characters"
        : "";
    }

    setUserData(updatedUserData);
    setErrMsgs(updatedErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      ...userData,
      role: { roleId: 2 }
    };

    try {
      const checkResponse = await UserService.checkEmail(user.email);
      if (checkResponse.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please use a different email address.',
        });
        return;
      }

      const response = await UserService.registerUser(user);
      console.log(response);
      if (response.status === 201) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Your account has been created successfully!',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          navigate("/login");
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: 'Something went wrong while registering.',
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Email already exists',
          text: 'Please use a different email address.',
        });
      } else {
        console.error("Error during registration:", err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred.',
        });
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.overlay} />

      <div style={styles.card}>
        <h2 className="text-center mb-4" style={{ fontWeight: '700', color: '#0A142F' }}>
          Create Your Account
        </h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>User Name</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              placeholder="Enter name"
              value={userData.userName}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {errMsgs.userName && <div className="text-danger mt-1">{errMsgs.userName}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              placeholder="Enter email"
              value={userData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {errMsgs.email && <div className="text-danger mt-1">{errMsgs.email}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={styles.label}>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={userData.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {errMsgs.phone && <div className="text-danger mt-1">{errMsgs.phone}</div>}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={styles.label}>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={userData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {errMsgs.password && <div className="text-danger mt-1">{errMsgs.password}</div>}
          </Form.Group>

          <Button
            type="submit"
            className="w-100"
            variant="primary"
            style={styles.button}
          >
            Register
          </Button>

          <div className="text-center mt-3" style={{ fontSize: '0.9rem' }}>
            Already have an account?{" "}
            <Link to="/login" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>
              Login here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1470&q=80')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10, 20, 47, 0.7)',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
    padding: '3rem 2.5rem',
    width: '400px',
    maxWidth: '100%',
    zIndex: 1,
  },
  label: {
    fontWeight: '600',
    color: '#0A142F',
  },
  input: {
    fontSize: '1rem',
    padding: '0.5rem 1rem',
  },
  button: {
    fontWeight: '600',
    fontSize: '1.1rem',
    padding: '0.6rem',
  }
};
