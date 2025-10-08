import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card, Spinner, Form, Row, Col } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
import Api from "../../API/Api";

const SeatSelection = () => {
  const [seatClasses, setSeatClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatAllocationIds, setSelectedSeatAllocationIds] = useState([]);
  const [bookedSeatIds, setBookedSeatIds] = useState([]);
  const [numberOfTickets, setNumberOfTickets] = useState(0);
  const [movieName, setMovieName] = useState("");
  const [screenName, setScreenName] = useState("");

  const navigate = useNavigate();

  const movieId = localStorage.getItem("selectedMovieId");
  const selectedDate = localStorage.getItem("selectedDate");
  const showtime = localStorage.getItem("selectedShowtime");
  const screenId = localStorage.getItem("selectedScreenId");
  const movieSetupId = localStorage.getItem("movieSetupId");

  useEffect(() => {
    const fetchSeatLayoutWithBookings = async () => {
      try {
        const response = await Api.get("/getScreenManagementWithBooking", {
          params: { screenId, movieSetupId },
        });
        setSeatClasses(response.data.screenLayout.seatClasses || []);
        setBookedSeatIds(response.data.bookedSeatAllocationIds || []);
      } catch (error) {
        console.error("Error fetching seat layout with bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatLayoutWithBookings();
  }, [screenId, movieSetupId]);

  const getTotalPrice = () => {
    let total = 0;
    seatClasses.forEach((seatClass) => {
      seatClass.seatsetups.forEach((row) => {
        row.seatnumberallocation.forEach((seat) => {
          if (selectedSeats.includes(seat.seatNumber)) {
            total += seatClass.price_per_seat;
          }
        });
      });
    });
    return total;
  };

const autoSelectSeats = (seatClassName, clickedSeat) => {
  const seatClass = seatClasses.find((sc) => sc.seat_class === seatClassName);
  if (!seatClass) return;

  let seatsNeeded = numberOfTickets;
  let newSelectedSeats = [];
  let newSelectedIds = [];

  // Find the row containing the clicked seat
  const rowIndex = seatClass.seatsetups.findIndex((r) =>
    r.seatnumberallocation.some((s) => s.seatNumber === clickedSeat.seatNumber)
  );
  if (rowIndex === -1) return;

  const row = seatClass.seatsetups[rowIndex];

  // Available seats in the row (not booked & not already selected)
  const availableSeatsInRow = row.seatnumberallocation.filter(
    (seat) =>
      !bookedSeatIds.includes(seat.seatNumberAllocationId)
  );

  // Find index of clicked seat in availableSeatsInRow
  const clickedIndex = availableSeatsInRow.findIndex(
    (s) => s.seatNumber === clickedSeat.seatNumber
  );

  if (clickedIndex === -1) return;

  // Pick to the right first, then to the left
  const seatsToRight = availableSeatsInRow.slice(clickedIndex);
  const seatsToLeft = availableSeatsInRow.slice(0, clickedIndex).reverse();

  // Combine right then left
  const combinedSeats = [...seatsToRight, ...seatsToLeft];

  // Select seats from current row as much as possible
  const selectedFromRow = combinedSeats.slice(0, seatsNeeded);
  newSelectedSeats.push(...selectedFromRow.map((s) => s.seatNumber));
  newSelectedIds.push(...selectedFromRow.map((s) => s.seatNumberAllocationId));

  seatsNeeded -= selectedFromRow.length;

  // If still need more seats — move to other rows in the same seat class
  if (seatsNeeded > 0) {
    for (let i = 0; i < seatClass.seatsetups.length; i++) {
      if (i === rowIndex) continue; // skip already used row

      const otherRow = seatClass.seatsetups[i];
      const availableSeats = otherRow.seatnumberallocation.filter(
        (seat) =>
          !bookedSeatIds.includes(seat.seatNumberAllocationId)
      );

      if (availableSeats.length > 0) {
        const seatsToAdd = availableSeats.slice(0, seatsNeeded);
        newSelectedSeats.push(...seatsToAdd.map((s) => s.seatNumber));
        newSelectedIds.push(...seatsToAdd.map((s) => s.seatNumberAllocationId));
        seatsNeeded -= seatsToAdd.length;
      }

      if (seatsNeeded <= 0) break;
    }
  }

  if (seatsNeeded > 0) {
    alert(
      `Only ${
        numberOfTickets - seatsNeeded
      } seat(s) available in this seat class. Requested ${numberOfTickets}.`
    );
  }

  // Finally set selected seats
  setSelectedSeats(newSelectedSeats);
  setSelectedSeatAllocationIds(newSelectedIds);
};




const toggleSeatSelection = (seat, seatClassName) => {
  if (numberOfTickets <= 0) {
    alert("Please select the number of tickets first.");
    return;
  }
  autoSelectSeats(seatClassName, seat);
};


  useEffect(() => {
    const storedMovieName = localStorage.getItem("movieName");
    const storedScreenName = localStorage.getItem("screenName");
    if (storedMovieName) setMovieName(storedMovieName);
    if (storedScreenName) setScreenName(storedScreenName);
  }, []);

  const handleConfirmBooking = () => {
    if (selectedSeats.length !== numberOfTickets) {
      alert(`Please select exactly ${numberOfTickets} seats before proceeding.`);
      return;
    }

    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
    localStorage.setItem("selectedSeatAllocationIds", JSON.stringify(selectedSeatAllocationIds));
    localStorage.setItem("totalTicketPrice", getTotalPrice().toString());
    localStorage.setItem("numberOfTickets", numberOfTickets.toString());

    const userId = localStorage.getItem("userId");
    if (!userId) {
      localStorage.setItem("redirectUrl", window.location.pathname);
      navigate("/login");
    } else {
      navigate("/moviebitepage");
    }
  };

  const handleTicketCountChange = (e) => {
    const value = Number(e.target.value);
    setNumberOfTickets(value);
    setSelectedSeats([]);
    setSelectedSeatAllocationIds([]);
    localStorage.setItem("numberOfTickets", value);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="position-relative">
      {/* Back Button */}
      <Button
        variant="light"
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "-5px",
          left: "-5px",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <ArrowLeft size={20} />
      </Button>

      <Container>
        <Row className="align-items-center mb-3">
          <Col>
            <p className="text-muted mb-0">
              screenName: <strong>{screenName}</strong> | movieName: <strong>{movieName}</strong>
            </p>
            <p className="text-muted mb-0">
              Date: <strong>{selectedDate}</strong> | Showtime: <strong>{showtime}</strong>
            </p>
          </Col>

          <Col className="text-end">
            <Form.Label>Number of Tickets</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="10"
              value={numberOfTickets}
              onChange={handleTicketCountChange}
              style={{ maxWidth: "100px", marginLeft: "auto" }}
            />
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : seatClasses.length ? (
          <Card className="p-4 shadow-sm mb-4">
            {seatClasses.map((seatClass, idx) => (
              <div key={idx} className="mb-4">
                <div className="text-center mb-2">
                  <h5 className="text-dark mb-0">
                    {seatClass.seat_class}{" "}
                    <span className="bg-navy text-black">- ₹{seatClass.price_per_seat}</span>
                  </h5>
                </div>

                {seatClass.seatsetups.map((row, i) => (
                  <div
                    key={i}
                    className="mb-3 d-flex align-items-center justify-content-center gap-3"
                  >
                    <div
                      style={{ minWidth: "30px", textAlign: "center", fontWeight: "bold" }}
                    >
                      {row.rowLabel}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {row.seatnumberallocation.map((seat) => {
                        const isBooked = bookedSeatIds.includes(seat.seatNumberAllocationId);
                        const isSelected = selectedSeats.includes(seat.seatNumber);
                        return (
                          <Button
                            key={seat.seatNumberAllocationId}
                            variant="light"
                            size="sm"
                            disabled={isBooked}
                            onClick={() => toggleSeatSelection(seat, seatClass.seat_class)}
                            style={{
                              minWidth: 40,
                              backgroundColor: isBooked
                                ? "#d32f2f"
                                : isSelected
                                ? "#90ee90"
                                : "#ffffff",
                              border:
                                isSelected || isBooked ? "2px solid #90ee90" : "1px solid #90ee90",
                              color: isSelected || isBooked ? "rgb(255, 255, 255)" : " #90ee90",
                              fontWeight: "bold",
                            }}
                          >
                            {seat.seatNumber}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <div className="text-center mt-4 d-flex justify-content-center align-items-center">
              <div
                style={{
                  backgroundColor: "#e0f8f9",
                  padding: "12px 0",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  height: "10px",
                  width: "50%",
                }}
              ></div>
            </div>

            <p className="text-muted text-center">All eyes this way Please!</p>
          </Card>
        ) : (
          <p className="text-muted text-center">No seats available.</p>
        )}

        {selectedSeats.length > 0 && (
          <div className="text-center mt-3">
            <h6 className="mb-2">Selected Seats: {selectedSeats.join(", ")}</h6>
            <h5>Total Price: ₹{getTotalPrice()}</h5>
            <Button onClick={handleConfirmBooking} variant="danger" className="mt-2 px-4">
              Book {selectedSeats.length} Seat(s)
            </Button>
          </div>
        )}

        <div className="d-flex justify-content-center gap-4 mt-4">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#f2f6f6",
                border: "1px solid #90ee90",
                borderRadius: "50%",
              }}
            ></div>
            <span>Available</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#90ee90",
                borderRadius: "50%",
              }}
            ></div>
            <span>Selected</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: "#d32f2f",
                borderRadius: "50%",
              }}
            ></div>
            <span>Booked</span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SeatSelection;
