import React, { useEffect, useState } from "react";
import { Spinner, Alert, Container, Row, Col, Card } from "react-bootstrap";
import { QRCodeCanvas } from "qrcode.react";
import Api from "../../API/Api";

const UserBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    // handle ISO / YYYY-MM-DD safely
    if (dateString.includes("T")) {
      const d = new Date(dateString);
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      }
    }
    const [year, month, day] = String(dateString).split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  useEffect(() => {
    const currentUserName = localStorage.getItem("userName");

    Api.get("/fetchAllBookingHistory")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        const userBookings = all.filter(
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

  // Build QR payload containing full booking details (encoded JSON)
  const qrPayload = (booking) => {
    if (!booking) return "";
    const payload = {
      movieName: booking.movieName || "",
      screenName: booking.screenName || "",
      showDate: booking.showDate || "",
      showTime: booking.showTime || "",
      seats: booking.seats || "",
      transactionId: booking.transactionId || "",
      amount: booking.amount || "",
      snacks: booking.snacks || "",
      language: booking.language || "",
      userName: booking.userName || "",
      posterUrl: booking.posterUrl || "",
    };
    // encode to keep QR safe and reasonably compact
    return encodeURIComponent(JSON.stringify(payload));
  };

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
            {bookingHistory
              .slice() // clone to avoid mutating original
              .reverse() // recent records first
              .map((booking, index) => (
                <Col key={booking.transactionId || index} md={6} lg={4}>
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
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                        src={booking.posterUrl || "https://via.placeholder.com/80x120?text=No+Poster"}
                        alt={booking.movieName || "poster"}
                        style={{
                          height: "100px",
                          width: "70px",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 style={{ fontWeight: "700", marginBottom: "4px", fontSize: "1rem" }}>
                          {booking.movieName}
                        </h6>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                          {booking.language || "English"}, 2D
                        </p>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#777" }}>
                          {formatDate(booking.showDate)} | {booking.showTime}
                        </p>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "#777" }}>
                          🎬 {booking.screenName}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section */}
                    <div style={{ padding: "20px", textAlign: "center", borderBottom: "1px dashed #ddd" }}>
                      {/* QR contains full booking details as encoded JSON */}
                      <QRCodeCanvas value={qrPayload(booking)} size={100} includeMargin={true} />

                      <p style={{ fontSize: "0.9rem", color: "#333", marginTop: "10px", marginBottom: "5px" }}>
                        <strong>{booking.screenName}</strong> | Seats: {booking.seats}
                      </p>

                      <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "5px" }}>
                        Snacks: <strong>{booking.snacks && booking.snacks.trim() !== "" ? booking.snacks : "No snacks added"}</strong>
                      </p>

                      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "5px" }}>
                        Booking ID: <strong>{booking.transactionId || "N/A"}</strong>
                      </p>

                      <p style={{ fontSize: "0.8rem", color: "#888" }}>
                        Confirmation sent via email / WhatsApp
                      </p>
                    </div>

                    {/* Bottom Section - price centered, no actions */}
                    <div style={{ padding: "15px 20px", backgroundColor: "#f7f7f7", borderTop: "1px solid #eee", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <strong style={{ color: "#000", fontSize: "1rem" }}>₹ {booking.amount}</strong>
                    </div>

                    {/* Circular Cutouts */}
                    <div style={{ content: '""', position: "absolute", width: "20px", height: "20px", background: "#f9fafb", borderRadius: "50%", top: "50%", left: "-10px", transform: "translateY(-50%)" }} />
                    <div style={{ content: '""', position: "absolute", width: "20px", height: "20px", background: "#f9fafb", borderRadius: "50%", top: "50%", right: "-10px", transform: "translateY(-50%)" }} />
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
