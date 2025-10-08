import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import Api from "../../API/Api";
import "bootstrap/dist/css/bootstrap.min.css";
import { ArrowLeft } from "react-bootstrap-icons";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const validateCardNumber = (num) => /^\d{16}$/.test(num);
  // const validateName = (name) => name.trim().length > 0;
  const validateName = (name) => {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(name.trim());
};

  const validateExpiry = (exp) => {
    if (!/^\d{2}\/\d{2}$/.test(exp)) return false;
    const [month, year] = exp.split("/").map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  };

  useEffect(() => {
    const storedSnackPrice =
      parseFloat(localStorage.getItem("snackTotalPrice")) || 0;
    const storedTicketPrice =
      parseFloat(localStorage.getItem("totalTicketPrice")) || 0;
    const storedTotal = storedTicketPrice + storedSnackPrice;
    setTotalPrice(isNaN(storedTotal) ? 0 : storedTotal);
  }, []);

const handlePayment = async () => {
  setPaymentError("");
  setLoading(true);

  if (!validateCardNumber(cardNumber)) {
    setPaymentError("Card number must be exactly 16 digits.");
    setLoading(false);
    return;
  }
  if (!validateName(cardHolderName)) {
    setPaymentError("Cardholder's name must be characters and spaces only.");
    setLoading(false);
    return;
  }
  if (!validateExpiry(expiry)) {
    setPaymentError("Expiry date must be in MM/YY format and a future date.");
    setLoading(false);
    return;
  }
  if (!cvv || cvv.length !== 3 || !/^\d{3}$/.test(cvv)) {
    setPaymentError("CVV must be exactly 3 digits.");
    setLoading(false);
    return;
  }

  try {
    const bookingStatus = "CONFIRMED";
    const storedSelectedSeats = JSON.parse(localStorage.getItem("selectedSeats")) || [];
    const selectedAllocationIds = JSON.parse(localStorage.getItem("selectedSeatAllocationIds")) || [];
    const numberofTickets = storedSelectedSeats.length;
    const userId = parseInt(localStorage.getItem("userId"));
    const movieSetupId = localStorage.getItem("movieSetupId");

    if (!userId) {
      setPaymentError("User not logged in.");
      setLoading(false);
      return;
    }

    // 1️⃣ Save booking ticket
    const bookingRequest = {
      userId,
      movieSetupId,
      totalPrice,
      bookingStatus,
      numberofTickets,
    };
    const bookingResponse = await Api.post("/saveBookingTicket", bookingRequest);
    const bookingTicketId = bookingResponse.data.bookingTicketId;

    // 2️⃣ Save seat ticket mappings
    for (const allocationId of selectedAllocationIds) {
      const bookingTicketNumberRequest = {
        seatnumberallocation: { seatNumberAllocationId: allocationId },
        bookingticket: { bookingTicketId },
      };
      await Api.post("/addbookingticketnumber", bookingTicketNumberRequest);
    }

    // 3️⃣ Save movie bites (snacks) if any
const selectedSnacks = JSON.parse(localStorage.getItem("selectedSnacks")) || [];

console.log(selectedSnacks);

// {
//   "bookingTicketId": 20,
//   "snacks": [
//     {
//       "biteId": 4,
//       "quantity": 2
//     }
//   ]
// }

if (selectedSnacks.length > 0) {
  // Map snacks to include biteId and quantity
  const bitesPayload = selectedSnacks.map(snack => ({
    biteId: snack.biteId,     // assuming your snack id is under 'id'
    quantity: snack.quantity
  }));

  const movieBitesRequest = {
    bookingTicketId,
    snacks: bitesPayload,
  };

  await Api.post("/addmoviebiteswithbooking", movieBitesRequest);
}


    // 4️⃣ Save payment details
    const paymentRequest = {
      paymentStatus: "SUCCESS",
      cardnumber: cardNumber,
      expiredate: expiry,
      bookingticket: { bookingTicketId },
    };
    await Api.post("/savePayment", paymentRequest);

    // 5️⃣ Update payment success status in booking
    await Api.post(`/paymentSuccess/${bookingTicketId}`);

    // 6️⃣ Mark payment success
    setPaymentSuccess(true);

    // 7️⃣ Clear localStorage
    localStorage.removeItem("selectedMovieId");
    localStorage.removeItem("selectedMovieName");
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("selectedSeatAllocationIds");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedShowtime");
    localStorage.removeItem("snackTotalPrice");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("selectedSnacks"); // also clear snacks now

    // 8️⃣ Redirect after delay
    setTimeout(() => {
      navigate("/bookingsuccess");
    }, 1500);

  } catch (error) {
    console.error(error);
    setPaymentError("Payment failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f0f9ff, #e0fff3)",
      }}
    >
      {/* Top-left Back Button */}
      <div className="p-3">
        <Button
          variant="light"
          onClick={() => navigate(-1)}
          style={{
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <ArrowLeft size={24} />
        </Button>
      </div>

      {/* Main Payment Section */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          minHeight: "90vh",
          padding: "1rem",
        }}
      >
        <Card
          className="w-50 p-4 shadow"
          style={{
            background: "linear-gradient(135deg, #ffffff, #e8fefc)",
            color: "#003d4d",
            borderRadius: "15px",
          }}
        >
          <h3
            className="text-center mb-4"
            style={{ textShadow: "1px 1px 2px #ccc" }}
          >
            Card Payment
          </h3>

          <div
            className="mb-4"
            style={{
              fontWeight: "600",
              fontSize: "1.4rem",
              color: "#006b5f",
              backgroundColor: "#e6f9f7",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
          </div>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter 16-digit card number"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, ""))
                }
                maxLength={16}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name on Card</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3 d-flex gap-3">
              
              <Form.Control
                type="text"
                placeholder="ExpiryDate(MM/YY)"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                maxLength={5}
              />
              <Form.Control
                type="password"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                maxLength={3}
              />
            </Form.Group>
          </Form>

          <Button
            variant="success"
            onClick={handlePayment}
            className="w-100 mb-3 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  className="me-2"
                  style={{ width: "1.2rem", height: "1.2rem" }}
                />
                Processing...
              </>
            ) : (
              <>Pay ₹{totalPrice.toFixed(2)}</>
            )}
          </Button>

          {paymentSuccess && (
            <Alert variant="success" className="text-center">
              Payment Successful! Booking Confirmed 🎉
            </Alert>
          )}

          {paymentError && (
            <Alert variant="danger" className="text-center">
              {paymentError}
            </Alert>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;

