import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Spinner,
  Container,
  Alert,
  Row,
  Col,
  InputGroup,
  Modal,
} from 'react-bootstrap';

import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import Api from '../../API/Api';

const AlertModal = ({ show, onClose, title, message, variant = 'primary' }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton className={`bg-${variant} text-white`}>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant={variant} onClick={onClose}>OK</Button>
    </Modal.Footer>
  </Modal>
);

const MovieSetupWithMovies = () => {
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
  const [releaseDate, setReleaseDate] = useState('');
  const [skippedShowtimes, setSkippedShowtimes] = useState([]);
  const [showSkippedModal, setShowSkippedModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('primary');
  
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
    tomorrow.setDate(today.getDate() + 1);
    setMinDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const handleMovieChange = (e) => {
    const selectedId = e.target.value;
    setSelectedMovie(selectedId);
    setFormErrors((prev) => ({ ...prev, selectedMovie: null }));

    const movie = movies.find((m) => m.movieId === parseInt(selectedId));
    if (movie) {
      setReleaseDate(movie.releaseDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const movieRelease = new Date(movie.releaseDate);
      const minSelectableDate = movieRelease > tomorrow ? movieRelease : tomorrow;
      setMinDate(minSelectableDate.toISOString().split('T')[0]);
    }
  };

  const handleShowTimeChange = (time) => {
    setShowTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
    setFormErrors((prev) => ({ ...prev, showTimes: null }));
  };

  const handleAddCustomShowTime = () => {
    const newTime = customShowTime.trim();
    if (newTime === '') {
      setFormErrors((prev) => ({ ...prev, customShowTime: 'Please enter a valid showtime.' }));
      return;
    }

    const lowerNewTime = newTime.toLowerCase();
    const isDuplicate =
      showTimes.some((time) => time.toLowerCase() === lowerNewTime) ||
      predefinedShowTimes.some((time) => time.toLowerCase() === lowerNewTime);

    if (isDuplicate) {
      setFormErrors((prev) => ({
        ...prev,
        customShowTime: `${newTime} already exists.`,
      }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, customShowTime: null }));
    setShowTimes((prev) => [...prev, newTime]);
    setCustomShowTime('');
  };

  const showAlert = (title, message, variant = 'primary') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVariant(variant);
    setAlertShow(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!selectedMovie) newErrors.selectedMovie = 'Movie is required.';
    if (!selectedScreen) newErrors.selectedScreen = 'Screen is required.';
    if (!showDate) newErrors.showDate = 'Show date is required.';
    if (showTimes.length === 0) newErrors.showTimes = 'Select at least one showtime.';

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const skipped = [];

    try {
      for (const time of showTimes) {
        const checkResult = await Api.get('/checkExistingSetup', {
          params: {
            screenId: selectedScreen,
            showDate: showDate,
            showtime: time,
          },
        });

        if (checkResult.data.exists) {
          skipped.push(time);
          continue;
        }

        const payload = {
          movieId: selectedMovie,
          screenId: selectedScreen,
          showDate,
          showtime: time,
          userId: userId,
        };

        await Api.post('/add', payload);
      }

      if (skipped.length > 0) {
        setSkippedShowtimes(skipped);
        setShowSkippedModal(true);
      } else {
        showAlert('Success', 'All movie setups added successfully!', 'success');
        setTimeout(() => navigate(-1), 2500);  // <--- go back to previous page
      }

      setSelectedScreen('');
      setSelectedMovie('');
      setShowDate('');
      setShowTimes([]);
      setReleaseDate('');
    } catch (error) {
      console.error('Error creating setup:', error);
      showAlert('Error', 'Failed to process movie setup.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <>
          {/* Back button fixed at top-left */}
          <Button
            variant="light"
            onClick={() => navigate("/admin/moviesetuplist")}
            style={{
              position: "fixed",
              top: "85px",
              left: "15px",
              zIndex: 1500, // above other content
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
            }}
          >
            <ArrowLeft className="me-2" />
            
          </Button>
    <Container className="d-flex flex-column justify-content-center align-items-center mt-5" style={{ minHeight: '100vh' }}>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', width: '100%' }} className="shadow p-4 rounded bg-white">
          <h2 className="mb-3 text-center">Movie Setup</h2>

          {/* Movie Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Select a Movie:</Form.Label>
            <Form.Select value={selectedMovie} onChange={handleMovieChange}>
              <option value="">-- Choose a Movie --</option>
              {movies.map((movie) => (
                <option key={movie.movieId} value={movie.movieId}>
                  {movie.movieTitle}
                </option>
              ))}
            </Form.Select>
            {formErrors.selectedMovie && <div className="text-danger">{formErrors.selectedMovie}</div>}
            {releaseDate && (
              <div className="text-muted mt-1">Release Date: {new Date(releaseDate).toLocaleDateString()}</div>
            )}
          </Form.Group>

          {/* Screen Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Select a Screen:</Form.Label>
            <Form.Select value={selectedScreen} onChange={(e) => { setSelectedScreen(e.target.value); setFormErrors((prev) => ({ ...prev, selectedScreen: null })); }}>
              <option value="">-- Choose a Screen --</option>
              {screens.map((screen) => (
                <option key={screen.screenId} value={screen.screenId}>
                  {screen.screenName} (Seats: {screen.seatingCapacity})
                </option>
              ))}
            </Form.Select>
            {formErrors.selectedScreen && <div className="text-danger">{formErrors.selectedScreen}</div>}
          </Form.Group>

          {/* Show Date */}
          <Form.Group className="mb-3">
            <Form.Label>Select Show Date:</Form.Label>
            <Form.Control type="date" value={showDate} min={minDate}
              onChange={(e) => { setShowDate(e.target.value); setFormErrors((prev) => ({ ...prev, showDate: null })); }}
            />
            {formErrors.showDate && <div className="text-danger">{formErrors.showDate}</div>}
          </Form.Group>

          {/* Showtimes */}
          <Form.Group className="mb-3">
            <Form.Label>Select Showtimes:</Form.Label>
            <Row>
              {predefinedShowTimes.map((time) => (
                <Col xs={6} key={time} className="mb-2">
                  <Form.Check type="checkbox" label={time}
                    checked={showTimes.includes(time)}
                    onChange={() => handleShowTimeChange(time)}
                  />
                </Col>
              ))}
            </Row>

            <InputGroup className="mt-2">
              <Form.Control
                type="text"
                placeholder="Add Custom ShowTime"
                value={customShowTime}
                onChange={(e) => setCustomShowTime(e.target.value)}
              />
              <Button variant="secondary" onClick={handleAddCustomShowTime}>Add</Button>
            </InputGroup>
            {formErrors.customShowTime && <div className="text-danger">{formErrors.customShowTime}</div>}
            {formErrors.showTimes && <div className="text-danger">{formErrors.showTimes}</div>}
          </Form.Group>

          {/* Submit */}
          <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
            {submitting ? (<><Spinner animation="border" size="sm" /> Saving...</>) : 'Save Setup'}
          </Button>
        </Form>
      )}

      {/* Alerts */}
      <AlertModal show={alertShow} onClose={() => setAlertShow(false)} title={alertTitle} message={alertMessage} variant={alertVariant} />
      <AlertModal show={showSkippedModal} onClose={() => setShowSkippedModal(false)} title="Skipped Showtimes"
        message={`These showtimes already exist: ${skippedShowtimes.join(', ')}`} variant="warning" />
    </Container>
    </>
  );
};

export default MovieSetupWithMovies;
