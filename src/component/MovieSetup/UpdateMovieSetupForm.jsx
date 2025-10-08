import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner, Container, Alert, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Api from '../../API/Api';
import { ArrowLeft } from 'react-bootstrap-icons';

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

const UpdateMovieSetupForm = () => {
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [showDate, setShowDate] = useState('');
  const [showTime, setShowTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('primary');

  const userId = localStorage.getItem('userId');
  const { movieSetupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [screenRes, movieRes, setupRes] = await Promise.all([
          Api.get('/fetchallscreen'),
          Api.get('/fetchAllMovies'),
          Api.get(`/fetchOne/${movieSetupId}`)
        ]);

        setScreens(screenRes.data);
        setMovies(movieRes.data);

        const setup = setupRes.data;
        setSelectedMovie(setup.movie.movieId);
        setSelectedScreen(setup.screen.screenId);
        setShowDate(setup.showDate);
        setShowTime(setup.showtime);

      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieSetupId]);

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
    if (!showTime) newErrors.showTime = 'Show time is required.';
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const payload = {
      movieId: selectedMovie,
      screenId: selectedScreen,
      showDate,
      showtime: showTime,
      userId,
    };

    try {
      await Api.put(`/update/${movieSetupId}`, payload);
      showAlert('Success', 'Movie setup updated successfully!', 'success');
      setTimeout(() => navigate('/movieSetups'), 2000);
    } catch (error) {
      console.error('Update failed:', error);
      showAlert('Error', 'Failed to update movie setup.', 'danger');
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
      ) : (
        <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', width: '100%' }} className="shadow p-4 rounded bg-white">
          <h2 className="mb-3 text-center">Update Movie Setup</h2>

          <Form.Group className="mb-3">
            <Form.Label>Select Movie:</Form.Label>
            <Form.Select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
              <option value="">-- Choose a Movie --</option>
              {movies.map((movie) => (
                <option key={movie.movieId} value={movie.movieId}>
                  {movie.movieTitle}
                </option>
              ))}
            </Form.Select>
            {formErrors.selectedMovie && <div className="text-danger">{formErrors.selectedMovie}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Screen:</Form.Label>
            <Form.Select value={selectedScreen} onChange={(e) => setSelectedScreen(e.target.value)}>
              <option value="">-- Choose a Screen --</option>
              {screens.map((screen) => (
                <option key={screen.screenId} value={screen.screenId}>
                  {screen.screenName}
                </option>
              ))}
            </Form.Select>
            {formErrors.selectedScreen && <div className="text-danger">{formErrors.selectedScreen}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Show Date:</Form.Label>
            <Form.Control type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} />
            {formErrors.showDate && <div className="text-danger">{formErrors.showDate}</div>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Show Time:</Form.Label>
            <Form.Control type="text" value={showTime} onChange={(e) => setShowTime(e.target.value)} placeholder="e.g. 10:00 AM" />
            {formErrors.showTime && <div className="text-danger">{formErrors.showTime}</div>}
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100" disabled={submitting}>
            {submitting ? (<><Spinner animation="border" size="sm" /> Updating...</>) : 'Update Setup'}
          </Button>
        </Form>
      )}

      <AlertModal show={alertShow} onClose={() => setAlertShow(false)} title={alertTitle} message={alertMessage} variant={alertVariant} />
    </Container>
    </>
  );
};

export default UpdateMovieSetupForm;
