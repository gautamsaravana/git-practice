import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container } from "react-bootstrap";
import Api from "../API/Api";

const BookingHistory = () => {
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
    Api.get("/fetchAllBookingHistory")
      .then((res) => {
        setBookingHistory(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch booking history.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading booking history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
        padding: "50px 0",
        width: "100%",
      }}
    >
      <Container fluid>
        {/* Fluid container to stretch width */}
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
            overflowX: "auto", // handle overflow horizontally
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontWeight: "700", color: "#0A142F" }}
          >
            📋 Booking History (Admin)
          </h2>

          <div style={{ minWidth: "1200px" }}>
            {/* Wrap table in div to control min-width */}
            <Table
              striped
              bordered
              hover
              responsive
              className="mb-0"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
              }}
            >
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Booking ID</th>
                  <th>User Name</th>
                  <th>Movie</th>
                  <th>Screen</th>
                  <th>Show Date</th>
                  <th>Show Time</th>
                  <th>Seats</th>
                  <th>Total Amount (₹)</th>
                  <th>Transaction ID</th>
                  <th>Snacks</th>
                </tr>
              </thead>
              <tbody>
                {bookingHistory.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookingHistory.map((booking, index) => (
                    <tr key={booking.bookingId}>
                      <td>{index + 1}</td>
                      <td>{booking.bookingId}</td>
                      <td>{booking.userName}</td>
                      <td>{booking.movieName}</td>
                      <td>{booking.screenName}</td>
                      <td>{formatDate(booking.showDate)}</td>
                      <td>{booking.showTime}</td>
                      <td>{booking.seats}</td>
                      <td>₹ {booking.amount}</td>
                      <td>{booking.transactionId}</td>
                      <td>{booking.snacks || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingHistory;
