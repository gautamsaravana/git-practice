import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const BookingSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0ffe0, #d4edda)",
        padding: "1rem",
      }}
    >
      <Card
        className="p-4 shadow text-center"
        style={{
          maxWidth: "450px",
          borderRadius: "20px",
          backgroundColor: "#f0fff0",
          color: "#155724",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success Icon"
          style={{
            width: "80px",
            marginBottom: "20px",
          }}
        />

        <h2 className="mb-3">Booking Confirmed! 🎉</h2>

        <p style={{ fontSize: "1.1rem", marginBottom: "25px" }}>
          Your tickets have been booked successfully.
        </p>

        {/* <img
          src="https://media.giphy.com/media/26xBwdIuRJiAIqHwA/giphy.gif"
          alt="Celebration"
          style={{
            width: "100%",
            borderRadius: "12px",
            marginBottom: "25px",
          }}
        /> */}

        <Button variant="success" onClick={handleGoHome}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
};

export default BookingSuccess;
