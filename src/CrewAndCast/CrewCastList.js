import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Table, Container, Button, Spinner, ButtonGroup } from "react-bootstrap";
import Api from "../API/Api";

const CrewCastList = () => {
  const { movieId } = useParams();
  const [crewCast, setCrewCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCrewCast = async () => {
    try {
      const response = await Api.get(`/movies/${movieId}/crew-cast`);
      setCrewCast(response.data);
    } catch (error) {
      console.error("Error fetching crew & cast:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrewCast();
  }, [movieId]);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Crew & Cast List</h2>
        <Button as={Link} to="/admindashboard" variant="secondary">
          ← Back to Admin
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th>Member Type</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {crewCast.length > 0 ? (
              crewCast.map((member, index) => (
                <tr key={member.id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      style={{ width: "60px", height: "80px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{member.name}</td>
                  <td>{member.role}</td>
                  <td>{member.memberType}</td>
                  <td>{member.department}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No crew or cast found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default CrewCastList;
