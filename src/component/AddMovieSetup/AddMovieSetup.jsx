import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, Container, Alert, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Api from '../../API/Api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const AddMovieSetup = () => {
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTimes, setShowTimes] = useState([]);
  const [customShowTime, setCustomShowTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
      const userId = localStorage.getItem('userId');


  const navigate = useNavigate();
  const predefinedShowTimes = ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [screenRes, movieRes] = await Promise.all([
          Api.get('/fetchallscreen'),
          Api.get('/fetchAllMovies'),
        ]);
        setScreens(screenRes.data);
        setMovies(movieRes.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const min = tomorrow.toISOString().split('T')[0];
    const maxDateObj = new Date(tomorrow);
    maxDateObj.setDate(maxDateObj.getDate() + 6);
    const max = maxDateObj.toISOString().split('T')[0];

    setMinDate(min);
    setMaxDate(max);
  }, []);

  const handleShowTimeChange = (time) => {
    setShowTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleAddCustomShowTime = () => {
    if (customShowTime.trim() !== '' && !showTimes.includes(customShowTime)) {
      setShowTimes((prev) => [...prev, customShowTime]);
      setCustomShowTime('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedMovie || !selectedScreen || !showDate || showTimes.length === 0) {
      MySwal.fire({
        icon: 'warning',
        title: 'Incomplete Details',
        text: 'Please fill all fields and select at least one showtime.',
      });
      return;
    }

    try {
      for (const time of showTimes) {
        const payload = {
          movieId: selectedMovie,
          screenId: selectedScreen,
          showDate,
          showtime: time,
          userId: userId,
        };
        await Api.post('/add', payload);
      }

      await MySwal.fire({
        icon: 'success',
        title: 'Setup Saved!',
        text: 'Movie setup(s) saved successfully.',
        confirmButtonText: 'Okay',
      });

      // Reset form
      setSelectedScreen('');
      setSelectedMovie('');
      setShowDate('');
      setShowTimes([]);
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error creating setup:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Failed!',
        text: 'Failed to save movie setup. Please try again.',
      });
    }
  };

  return (
    <Container className="p-4">
      <div className="d-flex justify-content-between mb-3">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <h2 className="mb-3">Movie Setup with Movie Selection</h2>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" role="status" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
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

          {/* Show Times */}
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
            <InputGroup className="mt-3">
              <Form.Control
                type="text"
                placeholder="Add custom time (e.g. 9:45 PM)"
                value={customShowTime}
                onChange={(e) => setCustomShowTime(e.target.value)}
              />
              <Button variant="outline-primary" onClick={handleAddCustomShowTime}>
                + Add
              </Button>
            </InputGroup>

            {/* Show selected times */}
            {showTimes.length > 0 && (
              <div className="mt-2">
                <strong>Selected Showtimes:</strong> {showTimes.join(', ')}
              </div>
            )}
          </Form.Group>

          <Button type="submit" variant="primary">
            Save Setup
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default AddMovieSetup;
