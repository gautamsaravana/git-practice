import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="light" variant="light" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 d-flex align-items-center gap-2">
          <img
            src="/Blue and Orange Circle Icon Business Logo (1).png"
            alt="App Logo"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
          ExpressCinema
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto gap-3">
            <Button
              as={Link}
              to="/"
              variant={isActive("/") ? "primary" : "outline-primary"}
              className="fw-semibold"
              size="sm"
            >
              Home
            </Button>

            <Button
              as={Link}
              to="/bookings"
              variant={isActive("/bookings") ? "info" : "outline-info"}
              className="fw-semibold"
              size="sm"
            >
              Bookings
            </Button>

            <Button
              as={Link}
              to="/register"
              variant={isActive("/register") ? "warning" : "outline-warning"}
              className="fw-semibold"
              size="sm"
            >
              Register
            </Button>

            <Button
              as={Link}
              to="/login"
              variant={isActive("/login") ? "danger" : "outline-danger"}
              className="fw-semibold"
              size="sm"
            >
              Login
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
