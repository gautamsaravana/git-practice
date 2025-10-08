import React, { useEffect, useState } from "react";
import { Container, Button, Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { ArrowLeft } from "react-bootstrap-icons";
import Api from "../API/Api";

const SnackSelection = () => {
  const [movieBites, setMovieBites] = useState([]);
  const [snackItems, setSnackItems] = useState([]);
  const [seatTotal, setSeatTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const baseSeatPrice = location.state?.seatTotal || 0;

  useEffect(() => {
    fetchMovieBites();
    setSeatTotal(baseSeatPrice);
  }, [baseSeatPrice]);

  const fetchMovieBites = async () => {
    try {
      const res = await Api.get("/allmoviebites");
      console.log("Fetched bites:", res.data);
      setMovieBites(res.data);
    } catch (error) {
      console.error("Error fetching bites:", error);
      Swal.fire("Error", "Failed to load movie bites", "error");
    } finally {
      setLoading(false);
    }
  };

  const addSnack = (bite) => {
    const existingSnack = snackItems.find((item) => item.biteId === bite.biteId);
    if (existingSnack) {
      const updatedSnacks = snackItems.map((item) =>
        item.biteId === bite.biteId ? { ...item, quantity: item.quantity + 1 } : item
      );
      setSnackItems(updatedSnacks);
    } else {
      setSnackItems([
        ...snackItems,
        { biteId: bite.biteId, snackName: bite.biteName, quantity: 1, price: bite.bitePrice },
      ]);
    }
    setSeatTotal((prev) => prev + bite.bitePrice);
  };

  const removeSnack = (bite) => {
    const existingSnack = snackItems.find((item) => item.biteId === bite.biteId);
    if (existingSnack) {
      if (existingSnack.quantity === 1) {
        const updatedSnacks = snackItems.filter((item) => item.biteId !== bite.biteId);
        setSnackItems(updatedSnacks);
      } else {
        const updatedSnacks = snackItems.map((item) =>
          item.biteId === bite.biteId ? { ...item, quantity: item.quantity - 1 } : item
        );
        setSnackItems(updatedSnacks);
      }
      setSeatTotal((prev) => prev - bite.bitePrice);
    }
  };

  useEffect(() => {
    const savedSnacks = JSON.parse(localStorage.getItem("selectedSnacks")) || [];
    const savedTotal = parseFloat(localStorage.getItem("snackTotalPrice")) || baseSeatPrice;
    setSnackItems(savedSnacks);
    setSeatTotal(savedTotal);
  }, [baseSeatPrice]);

  useEffect(() => {
    localStorage.setItem("selectedSnacks", JSON.stringify(snackItems));
    localStorage.setItem("snackTotalPrice", seatTotal);
  }, [snackItems, seatTotal]);

  const handleProceed = () => {
    navigate("/bookingsummary");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getSnackQuantity = (biteId) => {
    const item = snackItems.find((snack) => snack.biteId === biteId);
    return item ? item.quantity : 0;
  };

  return (
    <div>
      <Button
        variant="light"
        onClick={handleBack}
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
          position: "fixed",
        }}
      >
        <ArrowLeft size={24} />
      </Button>

      <Container className="my-4 position-relative">
        <h3 className="mb-4 text-center">Select Your Movie Bites</h3>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <Row>
              {movieBites.map((bite) => (
                <Col md={4} sm={6} xs={12} key={bite.biteId} className="mb-4">
                  <Card
                    className={`w-40 shadow-sm ${
                      getSnackQuantity(bite.biteId) > 0 ? "border-success border-2" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      width: "220px",
                      fontSize: "0.85rem",
                      padding: "10px",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={bite.moviebiteUrl}
                      alt={bite.biteName}
                      height="100"
                      style={{ objectFit: "contain", padding: "5px" }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback.jpg";
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{bite.biteName}</Card.Title>
                      <Card.Text>₹{bite.bitePrice}</Card.Text>

                      <div className="d-flex justify-content-between align-items-center">
                        <Button variant="outline-primary" size="sm" onClick={() => addSnack(bite)}>
                          +
                        </Button>

                        <Badge bg="secondary">{getSnackQuantity(bite.biteId)}</Badge>

                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeSnack(bite)}
                          disabled={getSnackQuantity(bite.biteId) === 0}
                        >
                          -
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <hr />
            <h5>Total Price: ₹{seatTotal.toFixed(2)}</h5>

            <div className="d-flex justify-content-between mt-4">
              <Button variant="outline-secondary" onClick={handleProceed}>
                Skip & Proceed to Payment
              </Button>
              <Button variant="primary" onClick={handleProceed}>
                Proceed to Payment
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default SnackSelection;
