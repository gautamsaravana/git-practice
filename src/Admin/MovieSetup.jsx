import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Spinner,
  Container,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Api from "../API/Api";

const MovieSetup = () => {
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTimes, setShowTimes] = useState([]);
  const [customShowTime, setCustomShowTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const navigate = useNavigate();

  // Predefined showtimes (can be changed as needed)
  const predefinedShowTimes = [
    "10:00 AM",
    "1:00 PM",
    "4:00 PM",
    "7:00 PM",
  ];

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setLoading(true)
        const res = await Api.get("/fetchallscreen");
        setLoading(false);
        setScreens(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching screens:", err);
        setError("Failed to load screens. Please try again later.");
      }
    };

    fetchScreens();

    // Calculate date limits: tomorrow and 7 days after tomorrow
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const min = tomorrow.toISOString().split("T")[0];

    const maxDateObj = new Date(tomorrow);
    maxDateObj.setDate(maxDateObj.getDate() + 6); // 7 days total including tomorrow

    const max = maxDateObj.toISOString().split("T")[0];

    setMinDate(min);
    setMaxDate(max);
  }, []);

  // Handle checkbox toggle for showtimes
  const handleShowTimeChange = (time) => {
    if (showTimes.includes(time)) {
      setShowTimes(showTimes.filter((t) => t !== time));
    } else {
      setShowTimes([...showTimes, time]);
    }
  };

  // Add custom showtime to the list
  const handleAddCustomShowTime = () => {
    if (customShowTime.trim() === "") {
      alert("Please enter a valid showtime.");
      return;
    }

    if (showTimes.includes(customShowTime)) {
      alert("This showtime is already selected.");
      return;
    }

    setShowTimes([...showTimes, customShowTime]);
    setCustomShowTime("");
  };

  // Submit handler (connect to your backend here)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedScreen) {
      alert("Please select a screen");
      return;
    }
    if (!showDate) {
      alert("Please select a show date");
      return;
    }
    if (showTimes.length === 0) {
      alert("Please select at least one showtime");
      return;
    }

    // Prepare payload for backend
    const payload = {
      screenId: selectedScreen,
      showDate,
      showTimes,
      userId:1
    };

    try {
      const res = await Api.post("/add", payload);
      alert("Movie setup saved successfully!");
      // Optionally reset form or navigate away
      setSelectedScreen("");
      setShowDate("");
      setShowTimes("");
    } catch (error) {
      console.error("Error creating setup:", error);
      alert("Failed to save movie setup. Please try again.");
    }
  };

  return (
    <Container className="p-4">
      {/* Navigation buttons */}
      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        {/* <Button as={Link} to="/admindashboard" variant="secondary">
          Admin Dashboard
        </Button> */}
      </div>

      {/* Header */}
      <h2 className="mb-3">Movie Setup</h2>
      <p>Set up movie schedules and configurations here.</p>

      {/* Loading spinner */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" variant="primary" />
          <span className="visually-hidden">Loading screens...</span>
        </div>
      )}

      {/* Error alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Form */}
      {!loading && !error && (
        <Form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
          {/* Screen dropdown */}
          <Form.Group controlId="screenDropdown" className="mb-3">
            <Form.Label>Select a Screen:</Form.Label>
            <Form.Select
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
              required
            >
              <option value="">-- Choose a Screen --</option>
              {screens.map((screen) => (
                <option key={screen.screenId} value={screen.screenId}>
                  {screen.screenName} (Seats: {screen.seatingCapacity})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Show Date */}
          <Form.Group controlId="showDate" className="mb-3">
            <Form.Label>Select Show Date:</Form.Label>
            <Form.Control
              type="date"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
              required
              min={minDate}
              max={maxDate}
            />
            <Form.Text muted>
              Available dates: {minDate} to {maxDate}
            </Form.Text>
          </Form.Group>

          {/* Show Times Checkboxes */}
          <Form.Group controlId="showTimes" className="mb-3">
            <Form.Label>Select Show Times:</Form.Label>
            <Row>
              {predefinedShowTimes.map((time) => (
                <Col xs={6} key={time}>
                  <Form.Check
                    type="checkbox"
                    id={`showtime-${time}`}
                    label={time}
                    value={time}
                    checked={showTimes.includes(time)}
                    onChange={() => handleShowTimeChange(time)}
                  />
                </Col>
              ))}
            </Row>

            {/* Custom showtime input */}
            <div className="mt-3">
              <Form.Label>Add Custom Showtime:</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="e.g. 9:30 AM"
                  value={customShowTime}
                  onChange={(e) => setCustomShowTime(e.target.value)}
                />
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={handleAddCustomShowTime}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Display custom added times as checkboxes */}
            {showTimes
              .filter((time) => !predefinedShowTimes.includes(time))
              .map((time) => (
                <div key={time} className="mt-2">
                  <Form.Check
                    type="checkbox"
                    id={`showtime-${time}`}
                    label={time}
                    value={time}
                    checked={showTimes.includes(time)}
                    onChange={() => handleShowTimeChange(time)}
                  />
                </div>
              ))}
          </Form.Group>

          {/* Submit Button */}
          <Button type="submit" variant="primary">
            Save Setup
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default MovieSetup;
