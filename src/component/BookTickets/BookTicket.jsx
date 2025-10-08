import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import Api from "../../API/Api";
// import Api from "../API/Api.js";

const BookTickets = () => {
  const { movieId } = useParams();
  const [showSetups, setShowSetups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShowSetups = async () => {
    try {
      const response = await Api.get(`/fetchShowSetupByMovie/${movieId}`);
      setShowSetups(response.data);
    } catch (error) {
      console.error("Error fetching show setups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowSetups();
  }, [movieId]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary" />
      </Container>
    );
  }

  if (!showSetups.length) {
    return (
      <Container className="text-center my-5">
        <h4>No show setups available for this movie.</h4>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <h2 className="mb-4">Available Shows</h2>

      {showSetups.map((setup, index) => (
        <Card key={index} className="mb-4 p-3 shadow-sm">
          <h5>
            Date: {setup.showDate} | Screen: {setup.screenName}
          </h5>

          <div className="mt-3 d-flex flex-wrap">
            {setup.showTimes.map((time, idx) => (
              <Button
                key={idx}
                variant="outline-primary"
                className="me-2 mb-2"
                onClick={() => alert(`Proceed to book for ${time}`)}
              >
                {time}
              </Button>
            ))}
          </div>
        </Card>
      ))}
    </Container>
  );
};

export default BookTickets;
