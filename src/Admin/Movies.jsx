import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Spinner,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Api from "../API/Api.js";

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
};

const formatDayMonth = (dateStr) => {
  const dateObj = new Date(dateStr);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = dateObj.toLocaleDateString("en-US", {
    month: "short",
  }).toUpperCase();
  return { day, month };
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverData, setHoverData] = useState({});

  const next7Days = getNext7Days();

  const fetchMovies = async () => {
    try {
      const response = await Api.get("/fetchAllMovies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchHoverShowtimes = async (movieId, date) => {
    const key = `${movieId}_${date}`;
    if (hoverData[key]) return;

    try {
      const res = await Api.get(`/${movieId}/screens-showtimes`, {
        params: { date },
      });
      setHoverData((prev) => ({ ...prev, [key]: res.data }));
    } catch (error) {
      console.error(`Error fetching showtimes for ${key}:`, error);
      setHoverData((prev) => ({ ...prev, [key]: [] }));
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(175, 239, 243, 0.6), rgba(241, 177, 228, 0.6)), url('https://images.unsplash.com/photo-1588776814546-dc018f95f6d2?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <Container>
        <div className="d-flex justify-content-end mt-3 mb-3">
          <Button as={Link} to="/admin/movies/add" variant="success">
            Add Movie
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status" variant="primary" />
          </div>
        ) : movies.length > 0 ? (
          <div className="row">
            {movies
              .slice()
              .reverse()
              .map((movie, index) => (
                <div key={movie.movieId} className="col-12 col-lg-6 mb-4">
  <Card className="shadow-sm p-3 h-100">
    {/* 7 Days Dates Above */}
    <div className="mb-3 d-flex flex-wrap gap-2 justify-content-center">
      {next7Days.map((date, idx) => {
        const { day, month } = formatDayMonth(date);
        const key = `${movie.movieId}_${date}`;
        const showInfo = hoverData[key];

        return (
          <OverlayTrigger
            key={idx}
            placement="top"
            overlay={
              <Tooltip>
                {showInfo ? (
                  showInfo.length ? (
                    showInfo.map((screen, i) => (
                      <div key={i}>
                        <strong>{screen.screenName}</strong>
                        <div style={{ fontSize: "0.85rem" }}>
                          {screen.showtimes.join(", ")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No showtimes</div>
                  )
                ) : (
                  <div>Loading...</div>
                )}
              </Tooltip>
            }
            onEnter={() =>
              fetchHoverShowtimes(movie.movieId, date)
            }
          >
            <div
              style={{
                width: 50,
                height: 65,
                borderRadius: 8,
                backgroundColor: "#f0f0f0",
                color: "#222",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontSize: 18 }}>{day}</div>
              <div style={{ fontSize: 11 }}>{month}</div>
            </div>
          </OverlayTrigger>
        );
      })}
    </div>

    {/* Poster and Details Below */}
    <div className="d-flex align-items-center">
      <img
        src={movie.posterUrl}
        alt={movie.movieTitle}
        style={{
          width: "180px", // increased width
          height: "270px", // increased height
          objectFit: "cover",
          marginRight: "20px",
          borderRadius: "8px",
        }}
      />
      <div className="flex-grow-1">
        <p className="mb-1">
          <strong>Release Date:</strong>{" "}
          {new Date(movie.releaseDate).toISOString().slice(0, 10)}
        </p>
        <p className="mb-1">
          <strong>Name:</strong> {movie.movieTitle}{" "}
          <strong>Language:</strong> {movie.language}{" "}
          <strong>Duration:</strong> {movie.duration} min
        </p>
        <p className="mb-1">
          <strong>Genre:</strong> {movie.genre}
        </p>
        <p style={{ fontSize: "0.95rem" }}>{movie.description}</p>
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-3 d-flex flex-wrap gap-2">
      <Button
        as={Link}
        to={`/admin/movies/edit/${movie.movieId}`}
        variant="primary"
        size="sm"
      >
        Update
      </Button>
      <Button
        as={Link}
        to={`/admin/movies/${movie.movieId}/crew-cast`}
        variant="success"
        size="sm"
      >
        Show Crew And Cast
      </Button>
    </div>
  </Card>
</div>

              ))}
          </div>
        ) : (
          <p className="text-center">No movies found.</p>
        )}
      </Container>
    </div>
  );
};

export default Movies;
