import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Spinner, Card, Row, Col, Button } from "react-bootstrap";
import Api from "../API/Api.js";

const MovieCrewCast = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [crewAndCast, setCrewAndCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrewAndCast = async () => {
      try {
        const response = await Api.get(`/movies/${movieId}/crewAndCast`);
        setCrewAndCast(response.data);
      } catch (error) {
        console.error("Failed to fetch crew and cast", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewAndCast();
  }, [movieId]);

  const handleEdit = (memberId) => {
    // Navigate to edit page for crew/cast member
    navigate(`/admin/crew-cast/edit/${memberId}`);

  };

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this crew/cast member?")) {
      try {
        await Api.delete(`/crewCast/delete/${memberId}`);
        setCrewAndCast(crewAndCast.filter((member) => member.member_id !== memberId));
      } catch (error) {
        console.error("Failed to delete crew/cast member", error);
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button as={Link} to="/admin/movies" variant="secondary" className="mb-3">
        ← Back to Movies List
      </Button>

      <h2>Crew & Cast for Movie ID: {movieId}</h2>

      {crewAndCast.length === 0 ? (
        <p>No crew or cast information available.</p>
      ) : (
        <Row>
          {crewAndCast.map((member) => (
            <Col md={4} sm={6} xs={12} key={member.member_id} className="mb-3">
              <Card>
                <img
                  src={member.photo_url || "/assets/default-profile.png"}
                  alt={member.name}
                  onError={(e) => (e.target.src = "/assets/default-profile.png")}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{member.name}</Card.Title>
                  <Card.Text>
                    <strong>Role:</strong> {member.role || "N/A"} <br />
                    <strong>Type:</strong> {member.member_type || "N/A"} <br />
                    <strong>Department:</strong> {member.department || "N/A"}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <Button variant="warning" size="sm" onClick={() => handleEdit(member.member_id)}>
                      Edit
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(member.member_id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MovieCrewCast;
