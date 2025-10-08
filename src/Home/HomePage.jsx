import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../API/Api.js";

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await Api.get("fetchAllMovies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToMovieDetails = (movieId, movieTitle) => {
    localStorage.setItem("selectedMovieId", movieId);
    localStorage.setItem("selectedMovieName", movieTitle);
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="mb-5">
      <div className="text-center mt-3">
        <h4 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          Now Showing
        </h4>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div
          className="d-flex flex-wrap justify-content-center gap-4"
          style={{ maxWidth: "1300px", margin: "0 auto" }}
        >
          {movies.slice().reverse().map((movie) => (
            <div
              key={movie.movieId}
              className="bg-white rounded shadow-sm overflow-hidden"
              style={{
                width: "180px",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              onClick={() => goToMovieDetails(movie.movieId, movie.movieTitle)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={movie.posterUrl}
                alt={movie.movieName}
                style={{
                  width: "100%",
                  height: "270px",
                  objectFit: "cover",
                  borderTopLeftRadius: "0.375rem",
                  borderTopRightRadius: "0.375rem",
                }}
              />
              <div className="text-center p-2">
                <h5 style={{ fontSize: "18px", marginBottom: "5px" }}>
                  {movie.movieTitle}
                </h5>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: 0,
                  }}
                >
                  {movie.genre}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
