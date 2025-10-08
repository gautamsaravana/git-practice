import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert, Container } from "react-bootstrap";
import Api from "../../API/Api";

const UserBookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateString; // fallback if format is unexpected
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
      }}
    >
      <Container>
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontWeight: "700", color: "#0A142F" }}
          >
            🎫 My Booking History
          </h2>

          <Table
            striped
            bordered
            hover
            responsive
            className="mb-0"
            style={{ borderRadius: "10px", overflow: "hidden" }}
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
                <th>Snacks</th> {/* Added Snacks header */}
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
                    <td>{booking.snacks || "-"}</td> {/* Display snacks or dash if empty */}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Container>
    </div>
  );
};

export default UserBookingHistory;
