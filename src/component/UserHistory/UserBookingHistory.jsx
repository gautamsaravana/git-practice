import React, { useEffect, useState } from "react";
import { Spinner, Alert, Container, Row, Col, Card } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import Api from "../../API/Api";
import { TelephoneFill, XCircleFill } from "react-bootstrap-icons";

const UserBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    const currentUserName = localStorage.getItem("userName");

    Api.get("/fetchAllBookingHistory")
      .then((res) => {
        const userBookings = res.data.filter(
          (booking) => booking.userName === currentUserName
        );
        setBookingHistory(userBookings);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch booking history.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spinner animation="border" variant="primary" />
        <p style={{ marginTop: "10px" }}>Loading booking history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" style={{ marginTop: "50px", textAlign: "center" }}>
        {error}
      </Alert>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f9fafb, #eef2f3)",
        paddingTop: "20px",
        paddingBottom: "40px",
      }}
    >
      <Container style={{ padding: "0 15px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "700",
            color: "#1a1a1a",
            letterSpacing: "0.5px",
          }}
        >
          🎟️ My Booking History
        </h2>

        {bookingHistory.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>No bookings found.</p>
        ) : (
          <Row style={{ rowGap: "20px", marginTop: "0px" }}>
            {bookingHistory.map((booking, index) => (
              <Col key={index} md={6} lg={4}>
                <Card
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    border: "none",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    position: "relative",
                    transition: "transform 0.3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {/* Top Section */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      padding: "15px",
                      borderBottom: "1px dashed #ddd",
                    }}
                  >
                    <img
                      src={
                        booking.posterUrl ||
                        "https://via.placeholder.com/80x120?text=No+Poster"
                      }
                      alt={booking.movieName}
                      style={{
                        height: "100px",
                        width: "70px",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h6
                        style={{
                          fontWeight: "700",
                          marginBottom: "4px",
                          fontSize: "1rem",
                        }}
                      >
                        {booking.movieName}
                      </h6>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: "#555",
                        }}
                      >
                        {booking.language || "English"}, 2D
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.85rem",
                          color: "#777",
                        }}
                      >
                        {formatDate(booking.showDate)} | {booking.showTime}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.85rem",
                          color: "#777",
                        }}
                      >
                        🎬 {booking.screenName}
                      </p>
                    </div>
                  </div>

                  {/* Middle Section */}
                  <div
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      borderBottom: "1px dashed #ddd",
                    }}
                  >
                    <QRCodeCanvas
                      value={booking.transactionId || "Booking"}
                      size={80}
                      includeMargin={true}
                    />

                    <p
                      style={{
                        fontSize: "0.9rem",
                        color: "#333",
                        marginTop: "10px",
                        marginBottom: "5px",
                      }}
                    >
                      <strong>{booking.screenName}</strong> | Seats:{" "}
                      {booking.seats}
                    </p>

                    {/* Snacks */}
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#555",
                        marginBottom: "5px",
                      }}
                    >
                       Snacks:{" "}
                      <strong>
                        {booking.snacks && booking.snacks.trim() !== ""
                          ? booking.snacks
                          : "No snacks added"}
                      </strong>
                    </p>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#666",
                        marginBottom: "5px",
                      }}
                    >
                      Booking ID:{" "}
                      <strong>{booking.transactionId || "N/A"}</strong>
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#888",
                      }}
                    >
                      Confirmation sent via email / WhatsApp
                    </p>
                  </div>

                  {/* Bottom Section */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px 20px",
                      backgroundColor: "#f7f7f7",
                      borderTop: "1px solid #eee",
                    }}
                  >
                    <div style={{ display: "flex", gap: "15px" }}>
                      <XCircleFill
                        size={20}
                        color="#dc3545"
                        title="Cancel booking"
                        style={{ cursor: "pointer" }}
                      />
                      <TelephoneFill
                        size={20}
                        color="#007bff"
                        title="Contact support"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                    <div>
                      <strong style={{ color: "#000" }}>
                        ₹ {booking.amount}
                      </strong>
                    </div>
                  </div>

                  {/* Circular Cutouts */}
                  <div
                    style={{
                      content: '""',
                      position: "absolute",
                      width: "20px",
                      height: "20px",
                      background: "#f9fafb",
                      borderRadius: "50%",
                      top: "50%",
                      left: "-10px",
                      transform: "translateY(-50%)",
                    }}
                  ></div>
                  <div
                    style={{
                      content: '""',
                      position: "absolute",
                      width: "20px",
                      height: "20px",
                      background: "#f9fafb",
                      borderRadius: "50%",
                      top: "50%",
                      right: "-10px",
                      transform: "translateY(-50%)",
                    }}
                  ></div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default UserBookingHistory;
