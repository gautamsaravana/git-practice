import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Navbar, Nav, Container, Button, Card } from "react-bootstrap";

export const AdminDashboard = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const adminOptions = [
    { text: "Movies", path: "/admin/movies" },
    { text: "Users", path: "/admin/users" },
    { text: "Screens & Seats", path: "/admin/screenseatclasses" },
    { text: "Movie_bite", path: "/admin/moviebite" },
    { text: "Movie_Setup", path: "/moviesetupwithmovie" },
  ];

  return (
    <div>
      <Navbar bg="light" variant="light" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold fs-4 d-flex align-items-center gap-2"
          >
            <img
              src="/Blue and Orange Circle Icon Business Logo (1).png"
              alt="App Logo"
              style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            />
            ExpressCinema
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto gap-3"></Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div
        className="d-flex flex-column align-items-center"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #b8c6db, #f5f7fa)",
          padding: "30px",
        }}
      >
        <div className="w-100 text-start mb-4">
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "45px",
              fontWeight: "bold",
              color: "darkred",
            }}
          >
            Admin Dashboard
          </h2>
        </div>

        <div className="d-flex justify-content-around align-items-center w-100 flex-wrap gap-4">
          <div>
            <img
              src="https://img.freepik.com/free-photo/representation-user-experience-interface-design_23-2150169860.jpg"
              alt="admin"
              style={{
                borderRadius: "30px",
                height: "300px",
                width: "300px",
                objectFit: "cover",
                marginRight: "50px",
              }}
            />
          </div>

          <div className="d-flex flex-column gap-3">
            {adminOptions.map((item, idx) => (
              <Card
                key={idx}
                as={Link}
                to={item.path}
                className="px-5 py-3 text-center text-decoration-none"
                style={{
                  backgroundColor: "#3b3054",
                  color: "#fff",
                  fontSize: "20px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontFamily: "'Poppins', sans-serif",
                  width: "250px",
                }}
              >
                {item.text}
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 text-center" style={{ color: "coral" }}>
          <p className="mt-0">Social Media</p>
          <div>
            <i className="fab fa-facebook mx-2"></i>
            <i className="fab fa-twitter mx-2"></i>
            <i className="fab fa-linkedin mx-2"></i>
            <i className="fab fa-instagram mx-2"></i>
          </div>
          <p className="mt-0">Copyright © 2025 - 3Edge Solutions.</p>
        </div>
      </div>
    </div>
  );
};
