import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, ListGroup, Spinner } from "react-bootstrap";
import Api from "../../API/Api";

const TicketBooking = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movieTitle, setMovieTitle] = useState('');
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [screensAndShowtimes, setScreensAndShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch movie title
  useEffect(() => {
    if (!movieId) return;
    const fetchMovieTitle = async () => {
      try {
        const res = await Api.get(`/fetchMovie/${movieId}`);
        setMovieTitle(res.data.movieTitle);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovieTitle('Movie');
      }
    };
    fetchMovieTitle();
  }, [movieId]);

  // Generate next 7 dates
  useEffect(() => {
    const today = new Date();
    const next7Dates = [];
    for (let i = 1; i < 8; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next7Dates.push(date.toISOString().slice(0, 10));
    }
    setDates(next7Dates);
    setSelectedDate(next7Dates[0]);
  }, []);

  // Fetch screens and showtimes
  useEffect(() => {
    if (!selectedDate || !movieId) return;

    const fetchScreensAndShowtimes = async () => {
      setLoading(true);
      try {
        const response = await Api.get(`/${movieId}/screens-showtimes`, {
          params: { date: selectedDate }
        });
        setScreensAndShowtimes(response.data);
      } catch (error) {
        console.error("Error fetching screens and showtimes:", error);
        setScreensAndShowtimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScreensAndShowtimes();
  }, [selectedDate, movieId]);

  // Navigate to seat selection page
  const handleBooking = async (screenId, showtime) => {
    try {
      const res = await Api.get(`/fetchMovieSetup`, {
        params: {
          movieId,
          screenId,
          showDate: selectedDate,
          showtime
        }
      });

      const screen = screensAndShowtimes.find(s => s.screenId === screenId);
      const screenName = screen ? screen.screenName : "Screen";

      const movieSetupId = res.data.movieSetupId;

      localStorage.setItem("selectedDate", selectedDate);
      localStorage.setItem("selectedShowtime", showtime);
      localStorage.setItem("selectedScreenId", screenId);
      localStorage.setItem("movieSetupId", movieSetupId);
      localStorage.setItem("movieName", movieTitle);
      localStorage.setItem("screenName", screenName);

      console.log("Selected Date:", selectedDate);
      console.log("Selected Showtime:", showtime);
      console.log("Selected Screen ID:", screenId);
      console.log("Fetched MovieSetupId:", movieSetupId);

      navigate(`/book-seats/${movieId}/${screenId}/${selectedDate}/${showtime}`);
    } catch (error) {
      console.error("Error fetching MovieSetupId:", error);
    }
  };

  return (
    <div className="">
      <button
        type="button"
        className="btn position-absolute m-0"
        style={{ top: '10px', left: '10px' }}
        onClick={() => navigate(-1)}
      >
        ⬅
      </button>

      <Container className="my-5">
        <h3 className="mb-4 text-center">{movieTitle || "Loading..."}</h3>

        {/* Date Buttons */}
        <div className="d-flex gap-3 flex-wrap mb-5 justify-content-center">
          {dates.map(date => {
            const dateObj = new Date(date);
            const day = dateObj.getDate();
            const dayWithZero = day < 10 ? `0${day}` : day;
            const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
            const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();

            return (
              <Button
                key={date}
                onClick={() => setSelectedDate(date)}
                style={{
                  width: 65,
                  height: 80,
                  padding: 0,
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: date === selectedDate ? "white" : "black",
                  backgroundColor: date === selectedDate ? "#d32f2f" : "#f1f1f1",
                  borderRadius: 10,
                  fontWeight: "bold",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ fontSize: 12 }}>{weekday}</div>
                <div style={{ fontSize: 22 }}>{dayWithZero}</div>
                <div style={{ fontSize: 12 }}>{month}</div>
              </Button>
            );
          })}
        </div>

        {/* Showtimes */}
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : screensAndShowtimes.length ? (
          <ListGroup className="mb-4">
            {screensAndShowtimes.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                style={{ border: "none", paddingLeft: 0, paddingRight: 0, background: "transparent" }}
                className="mb-3"
              >
                <div className="d-flex flex-wrap align-items-center gap-3">
                  <span className="fw-bold text-secondary" style={{ minWidth: 140 }}>
                    {item.screenName}
                  </span>

                  {[...item.showtimes]
                    .sort((a, b) => {
                      const isAM = (time) => time.toLowerCase().includes("am");
                      const aIsAM = isAM(a);
                      const bIsAM = isAM(b);

                      if (aIsAM && !bIsAM) return -1;
                      if (!aIsAM && bIsAM) return 1;
                      return 0;
                    })
                    .map((time, i) => (
                      <Button
                        key={i}
                        variant="outline-danger"
                        size="sm"
                        style={{
                          border: "1px solid #d32f2f",
                          color: "#d32f2f",
                          backgroundColor: "transparent",
                          fontWeight: "bold",
                          borderRadius: 10,
                          minWidth: 60,
                        }}
                        onClick={() => handleBooking(item.screenId, time)}
                      >
                        {time}
                      </Button>
                    ))}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted text-center">No screens or showtimes available for this date.</p>
        )}
      </Container>
    </div>
  );
};

export default TicketBooking;
