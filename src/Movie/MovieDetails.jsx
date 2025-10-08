import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button, Spinner, Card } from "react-bootstrap";
import Api from "../API/Api";
import ReviewForm from "../component/Review/ReviewForm";



const MovieDetails = () => {
  const { movieId } = useParams();
  const userId = 2; 
  const [movie, setMovie] = useState(null);
  const [crewAndCast, setCrewAndCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); 

  const fetchMovieDetails = async () => {
    try {
      const response = await Api.get(`/fetchMovie/${movieId}`);
      setMovie(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrewAndCastDetails = async () => {
    try {
      const response = await Api.get(`/movies/${movieId}/crewAndCast`);
      setCrewAndCast(response.data);
    } catch (error) {
      console.error("Error fetching crew and cast details:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await Api.get(`moviereview/${movieId}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    fetchCrewAndCastDetails();
    fetchReviews();
  }, [movieId]);

  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container className="text-center my-5 py-5">
        <h4>Movie not found.</h4>
      </Container>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "60px" }}>
      <div
        style={{
          backgroundImage: `linear-gradient(rgba(141, 138, 138, 0.7), rgba(37, 32, 32, 0.7)), url(${movie.posterUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "50px 20px",
          color: "#fff",
        }}
      >
        <Container>
          <div className="d-flex flex-column flex-md-row align-items-start">
            <img
              src={movie.posterUrl}
              alt={movie.movieTitle}
              style={{
                width: "220px",
                height: "340px",
                objectFit: "cover",
                borderRadius: "8px",
                marginRight: "30px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
              }}
            />
            <div className="flex-grow-1 mt-4 mt-md-0">
              <h2 className="mb-3">{movie.movieTitle}</h2>
              <p>
                <strong>Release Date:</strong>{" "}
                {new Date(movie.releaseDate).toISOString().slice(0, 10)} <br />
                <strong>End Date:</strong>{" "}
                {movie.endDate
                  ? new Date(movie.endDate).toISOString().slice(0, 10)
                  : "Running"}
              </p>
              <p>
                <strong>Language:</strong> {movie.language} <br />
                <strong>Duration:</strong> {movie.duration} min <br />
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p style={{ fontSize: "1rem" }}>{movie.description}</p>
              <div className="mt-3">
                <Button
                  as={Link}
                  to={`/movie/${movie.movieId}/book`}
                  variant="danger"
                  size="sm"
                  className="me-2"
                >
                  Book Tickets
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>

     
      <Container className="mt-4 mb-5">
        <h4 className="text-black mb-3">Crew & Cast</h4>
        {crewAndCast.length ? (
          <div className="d-flex flex-wrap">
            {crewAndCast.map((person, index) => (
              <div
                key={index}
                className="text-center p-2"
                style={{ width: "160px", margin: "10px" }}
              >
                <img
                  src={person.photo_url}
                  alt={person.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginBottom: "8px",
                    border: "2px solid #fff",
                  }}
                />
                <div style={{ color: "black", fontWeight: "600" ,fontSize :"15px"}}>
                  {person.name}
                </div>
                <div style={{ color: "black" }}>{person.role}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-dark">No crew and cast details available.</p>
        )}
      </Container>

 
      <Container className="mb-5">
        <h4 className="text-black mb-3">User Reviews</h4>

    
        {!showForm ? (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            + Add Review
          </Button>
        ) : (
          <>
            <ReviewForm
              movieId={parseInt(movieId)}
              userId={userId}
              onSuccess={() => {
                fetchReviews();      
                setShowForm(false);  
              }}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              className="mt-2"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </>
        )}

        {/* Review List */}
       <div className="mt-4 w-50">
  {reviews.length > 0 ? (
    <Card className="p-3 shadow-sm rounded">
      <Card.Body>
        <Card.Title className="mb-3 text-primary">User Reviews</Card.Title>
        <div className="d-flex flex-column gap-3">
          {reviews.map((rev) => (
            <div
              key={rev.reviewId}
              className="border-bottom pb-2"
              style={{ fontSize: "0.95rem" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong className="text-dark">{rev.user?.userName}</strong>
                <span className="badge bg-warning text-dark">
                  ⭐ {rev.rating}
                </span>
              </div>
              <div className="text-muted mt-1">
                {rev.review || <em>No review comment.</em>}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  ) : (
    <p className="text-muted mt-3">
      No reviews yet. Be the first to add one!
    </p>
  )}
        </div>
      </Container>
    </div>
  );
};

export default MovieDetails;