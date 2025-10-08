import React, { useEffect, useState } from "react";
import { Table, Container, Image, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Api from "../../API/Api";

const MovieBiteList = () => {
  const [movieBites, setMovieBites] = useState([]);
  const [loading, setLoading] = useState(true);  // loader state
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieBites();
  }, []);

  const fetchMovieBites = async () => {
    try {
      setLoading(true);  // start loader
      const res = await Api.get("/allmoviebites");
      setMovieBites(res.data);
    } catch (error) {
      console.error("Error fetching bites:", error);
      Swal.fire("Error", "Failed to load movie bites", "error");
    } finally {
      setLoading(false);  // stop loader
    }
  };

  const handleDelete = async (biteId) => {
    Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this bite?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Api.delete(`/deleteBite/${biteId}`);
          Swal.fire("Deleted!", "Movie bite deleted.", "success");
          fetchMovieBites();
        } catch (err) {
          Swal.fire("Error", "Failed to delete bite", "error");
        }
      }
    });
  };

  return (
    <Container className="mt-5">
      <center>
        <h3 className="mb-4">Available Movie Bites</h3>
      </center>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading movie bites...</p>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive className="text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Bite Name</th>
                <th>Price (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {movieBites.length ? (
                movieBites.map((bite, idx) => (
                  <tr key={bite.biteId}>
                    <td>{idx + 1}</td>
                    <td>
                      <Image
                        src={bite.moviebiteUrl}
                        alt={bite.biteName}
                        rounded
                        width={80}
                        height={80}
                        style={{ objectFit: "cover" }}
                      />
                    </td>
                    <td>{bite.biteName}</td>
                    <td>{bite.bitePrice}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => navigate(`edit/${bite.biteId}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(bite.biteId)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No movie bites found.</td>
                </tr>
              )}
            </tbody>
          </Table>

          <div className="text-end">
            <Button variant="primary" onClick={() => navigate("add")}>
              + Add New Movie Bite
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default MovieBiteList;
