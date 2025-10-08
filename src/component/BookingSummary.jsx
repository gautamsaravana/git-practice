import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Table,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";

import Api from "../API/Api";

const BookingSummary = () => {
  const navigate = useNavigate();

  const [movieName, setMovieName] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [ticketPrice, setTicketPrice] = useState(0);
  const [snackPrice, setSnackPrice] = useState(0);
  const [snackItems, setSnackItems] = useState([]);
  const [screenName, setScreenName] = useState("");

  useEffect(() => {
    const movieId = localStorage.getItem("selectedMovieId");
    if (movieId) {
      Api.get(`/fetchMovie/${movieId}`)
        .then((res) => setMovieName(res.data.movieTitle || ""))
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    const storedSelectedSeats =
      JSON.parse(localStorage.getItem("selectedSeats")) || [];
    const storedShowDate = localStorage.getItem("selectedDate") || "";
    const storedShowTime = localStorage.getItem("selectedShowtime") || "";
    const storedSnackPrice =
      parseFloat(localStorage.getItem("snackTotalPrice")) || 0;
    const storedTicketPrice =
      parseFloat(localStorage.getItem("totalTicketPrice")) || 0;
    const storedSnacks =
      JSON.parse(localStorage.getItem("selectedSnacks")) || [];
    const storedScreenName = localStorage.getItem("screenName") || "";

    setSelectedSeats(storedSelectedSeats);
    setShowDate(storedShowDate);
    setShowTime(storedShowTime);
    setSnackPrice(storedSnackPrice);
    setTicketPrice(storedTicketPrice);
    setSnackItems(storedSnacks);
    setScreenName(storedScreenName);
  }, []);

  const handleProceedToPayment = () => {
    navigate("/payment");
  };

  return (
    <>
      {/* ⬅️ Back Arrow button positioned top-left, outside of the card */}
      <Button
        variant="light"
        onClick={() => navigate(-1)}
        style={{
          top: "30px",
          left: "20px",
          borderRadius: "50%",
          width: "45px",
          height: "45px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 2000,
        }}
      >
        <ArrowLeft size={24} />
      </Button>

      <Container className="my-5">
        <Card
          className="p-4 shadow-lg rounded-4 border-0"
          style={{ background: "#f9f9fb" }}
        >
          <h2 className="mb-4 text-center" style={{ color: "#d9534f" }}>
            🎟️ Booking Summary
          </h2>

          <Table bordered hover className="mb-4 rounded-3 overflow-hidden">
            <tbody>
              <tr>
                <th style={{ background: "#eee" }}>Movie Name</th>
                <td>
                  <strong>{movieName}</strong>
                </td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Screen Name</th>
                <td>
                  <strong>{screenName}</strong>
                </td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Show Date</th>
                <td>{showDate}</td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Show Time</th>
                <td>{showTime}</td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Selected Seats</th>
                <td>
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat, idx) => (
                      <Badge key={idx} bg="primary" className="me-2">
                        {seat}
                      </Badge>
                    ))
                  ) : (
                    "No seats selected"
                  )}
                </td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Ticket Price</th>
                <td>₹{ticketPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Snack Price</th>
                <td>₹{snackPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Snacks</th>
                <td>
                  {snackItems.length > 0 ? (
                    snackItems.map((snack, idx) => (
                      <div key={idx}>
                        <Badge bg="success" className="me-2">
                          {snack.snackName}
                        </Badge>{" "}
                        × {snack.quantity}
                      </div>
                    ))
                  ) : (
                    <span>No snacks added</span>
                  )}
                </td>
              </tr>
              <tr>
                <th style={{ background: "#eee" }}>Total Price</th>
                <td>
                  <h5 className="text-success">
                    ₹{(ticketPrice + snackPrice).toFixed(2)}
                  </h5>
                </td>
              </tr>
            </tbody>
          </Table>

          <Row className="mt-4">
            <Col xs={12} md={6} className="text-center mb-3 mb-md-0">
              <Button
                variant="secondary"
                size="lg"
                className="w-100"
                onClick={() => navigate("/moviebitepage")}
              >
                ⬅️ Back to Seats
              </Button>
            </Col>
            <Col xs={12} md={6} className="text-center">
              <Button
                variant="danger"
                size="lg"
                className="w-100"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment 💳
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
};

export default BookingSummary;
