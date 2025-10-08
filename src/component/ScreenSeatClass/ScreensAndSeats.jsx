import React, { useEffect, useState } from "react";
import { Button, Form, Spinner, Card, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Api from "../../API/Api";

export const ScreenSeatForm = () => {
  const navigate = useNavigate();
  const { screenId } = useParams();
  const MySwal = withReactContent(Swal);

  // Screen data state
  const [screenData, setScreenData] = useState({
    screenName: "",
    seatingCapacity: "",
  });

  // Seat classes: array of { seat_class, total_seat_count, price_per_seat }
  const [seatClasses, setSeatClasses] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Validation error for seating capacity
  const [errMsg, setErrMsg] = useState("");

  // Dark mode toggle
  const [isDark, setIsDark] = useState(false);

  // Fetch screen and seat class data on mount or screenId change
  useEffect(() => {
    if (screenId) {
      fetchScreenById(screenId);
    } else {
      // New form: reset
      setScreenData({ screenName: "", seatingCapacity: "" });
      setSeatClasses([{ seat_class: "", total_seat_count: "", price_per_seat: "" }]);
    }
  }, [screenId]);

  const fetchScreenById = async (id) => {
    try {
      setLoading(true);
      const res = await Api.get(`/fetchonescreen/${id}`);
      setScreenData({
        screenName: res.data.screenName || "",
        seatingCapacity: res.data.seatingCapacity || "",
      });

      if (res.data.seatClasses && res.data.seatClasses.length > 0) {
        setSeatClasses(
          res.data.seatClasses.map((sc) => ({
            seat_class: sc.seat_class || "",
            total_seat_count: sc.total_seat_count || "",
            price_per_seat: sc.price_per_seat || "",
          }))
        );
      } else {
        setSeatClasses([{ seat_class: "", total_seat_count: "", price_per_seat: "" }]);
      }
    } catch (err) {
      console.error("Error fetching screen:", err);
      await MySwal.fire("Error", "Failed to load screen data.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle screen input change
  const handleScreenChange = (e) => {
    const { name, value } = e.target;
    setScreenData((prev) => ({ ...prev, [name]: value }));
    if (name === "seatingCapacity") {
      setErrMsg(""); // reset error on seating capacity change
    }
  };

  // Handle seat class input change
  const handleSeatClassChange = (index, e) => {
    const { name, value } = e.target;
    setSeatClasses((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  // Add new seat class
  const addSeatClass = () => {
    setSeatClasses((prev) => [...prev, { seat_class: "", total_seat_count: "", price_per_seat: "" }]);
  };

  // Remove seat class by index
  const removeSeatClass = (index) => {
    setSeatClasses((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate seating capacity vs sum of seat classes seats
  const validateSeatingCapacity = () => {
    const totalSeats = seatClasses.reduce((sum, sc) => sum + Number(sc.total_seat_count || 0), 0);
    if (Number(screenData.seatingCapacity) < totalSeats) {
      setErrMsg(
        `Seating capacity (${screenData.seatingCapacity}) cannot be less than total seats (${totalSeats}) in seat classes.`
      );
      return false;
    }
    setErrMsg("");
    return true;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSeatingCapacity()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare payload for screen
      const screenPayload = {
        screenName: screenData.screenName,
        seatingCapacity: Number(screenData.seatingCapacity),
      };

      // Save or update screen
      let savedScreenId = screenId;
      if (screenId) {
        await Api.put(`/updateScreen/${screenId}`, screenPayload);
      } else {
        const res = await Api.post("/saveScreen", screenPayload);
        savedScreenId = res.data.screenId;
      }

      // Save seat classes - assuming separate endpoint
      // You might want to send them all at once or update individually
      for (const sc of seatClasses) {
        const seatClassPayload = {
          seat_class: sc.seat_class,
          total_seat_count: Number(sc.total_seat_count),
          price_per_seat: Number(sc.price_per_seat),
          screens: { screenId: savedScreenId },
        };
        // Example: If updating seat classes with PUT or POST
        await Api.post("/savescreenseat", seatClassPayload);
      }

      await MySwal.fire("Success", "Screen and seat classes saved successfully.", "success");
      navigate("/listofScreens");
    } catch (err) {
      console.error("Error saving data:", err);
      await MySwal.fire("Error", "Failed to save screen or seat classes.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div
      className={`d-flex justify-content-center align-items-center min-vh-100`}
      style={{
        background: isDark
          ? "linear-gradient(to right, #141e30, #243b55)"
          : "linear-gradient(to right, #fdfbfb, #ebedee)",
      }}
    >
      <div
        className={`shadow-lg rounded-4 p-5 w-100`}
        style={{
          maxWidth: "900px",
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#f8fafc" : "#000000",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary">{screenId ? "Update Screen & Seats" : "Add Screen & Seats"}</h4>
          <Button variant="outline-secondary" size="sm" onClick={() => setIsDark(!isDark)}>
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="screenName">
            <Form.Label>Screen Name</Form.Label>
            <Form.Control
              type="text"
              name="screenName"
              value={screenData.screenName}
              onChange={handleScreenChange}
              placeholder="Eg: Screen 1"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="seatingCapacity">
            <Form.Label>Seating Capacity</Form.Label>
            <Form.Control
              type="number"
              name="seatingCapacity"
              value={screenData.seatingCapacity}
              onChange={handleScreenChange}
              placeholder="Eg: 100"
              min={1}
              required
            />
            {errMsg && <small className="text-danger">{errMsg}</small>}
          </Form.Group>

          <hr />

          <h5>Seat Classes</h5>
          {seatClasses.map((sc, index) => (
            <Card key={index} className="mb-3 p-3 shadow-sm">
              <Row className="align-items-center">
                <Col md={4}>
                  <Form.Group controlId={`seatClass_${index}`}>
                    <Form.Label>Seat Class</Form.Label>
                    <Form.Control
                      type="text"
                      name="seat_class"
                      value={sc.seat_class}
                      onChange={(e) => handleSeatClassChange(index, e)}
                      placeholder="Eg: Regular"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId={`totalSeats_${index}`}>
                    <Form.Label>Total Seats</Form.Label>
                    <Form.Control
                      type="number"
                      name="total_seat_count"
                      value={sc.total_seat_count}
                      onChange={(e) => handleSeatClassChange(index, e)}
                      min={1}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group controlId={`pricePerSeat_${index}`}>
                    <Form.Label>Price per Seat</Form.Label>
                    <Form.Control
                      type="number"
                      name="price_per_seat"
                      value={sc.price_per_seat}
                      onChange={(e) => handleSeatClassChange(index, e)}
                      min={0}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={2} className="d-flex justify-content-end mt-4">
                  {seatClasses.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeSeatClass(index)}
                      title="Remove this seat class"
                    >
                      &times;
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
          ))}

          <div className="mb-3">
            <Button variant="outline-primary" onClick={addSeatClass}>
              + Add Seat Class
            </Button>
          </div>

          <div className="text-center">
            <Button type="submit" disabled={loading} className="px-4 btn-success">
              {loading ? <Spinner animation="border" size="sm" /> : screenId ? "Update Screen" : "Add Screen"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ScreenSeatForm;
