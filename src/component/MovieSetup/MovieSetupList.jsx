import React, { useEffect, useState } from "react";
import { Table, Container, Button, Card, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Api from "../../API/Api";

const MovieSetupList = () => {
  const [movieSetups, setMovieSetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieSetups();
  }, []);

  const fetchMovieSetups = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/fetchAll");
      setMovieSetups(res.data);
    } catch (error) {
      console.error("Error fetching movie setups:", error);
      Swal.fire("Error", "Failed to load movie setups", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (setupId) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this movie setup?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Api.delete(`/delete/${setupId}`);
          Swal.fire("Deleted!", "Movie setup deleted.", "success");
          fetchMovieSetups();
        } catch (err) {
          Swal.fire("Error", "Failed to delete movie setup", "error");
        }
      }
    });
  };

  const handleUpdate = (movieSetupId) => {
    navigate(`edit/${movieSetupId}`);

  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
        paddingTop: "3rem",
        paddingBottom: "3rem",
      }}
    >
      <Container>
        <Card className="shadow p-4">
          <h3 className="mb-4 text-center text-primary">Available Movie Setups</h3>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <Table striped bordered hover responsive className="text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Show Date</th>
                    <th>Show Time</th>
                    <th>Movie Name</th>
                    <th>Screen Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movieSetups.length ? (
                    movieSetups.slice().reverse().map((setup, idx) => (
                      <tr key={setup.movieSetupId}>
                        <td>{idx + 1}</td>
                        <td>{setup.showDate}</td>
                        <td>{setup.showtime}</td>
                        <td>{setup.movie.movieTitle}</td>
                        <td>{setup.screen.screenName}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleUpdate(setup.movieSetupId)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(setup.movieSetupId)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-muted">
                        No movie setups found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              <div className="text-end mt-3">
                <Button variant="primary" size="lg" onClick={() => navigate("add")}>
                  + Add New Movie Setup
                </Button>
              </div>
            </>
          )}
        </Card>
      </Container>
    </div>
  );
};

export default MovieSetupList;
