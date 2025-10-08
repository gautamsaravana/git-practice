import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Card, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import Api from "../../API/Api";

const AddMovieBite = () => {
  const navigate = useNavigate();
  const { biteId } = useParams();
  const userId = localStorage.getItem("userId");

  const [biteDetails, setBiteDetails] = useState({
    biteName: "",
    bitePrice: "",
    moviebiteUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (biteId) {
      fetchBiteDetails(biteId);
    } else {
      setBiteDetails({
        biteName: "",
        bitePrice: "",
        moviebiteUrl: "",
      });
    }
  }, [biteId]);

  const fetchBiteDetails = async (id) => {
    try {
      setLoading(true);
      const res = await Api.get(`/fetchonebite/${id}`);
      setBiteDetails({
        biteName: res.data.biteName,
        bitePrice: res.data.bitePrice,
        moviebiteUrl: res.data.moviebiteUrl,
      });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch bite details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z ]*$/.test(value)) {
      setBiteDetails({ ...biteDetails, biteName: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBiteDetails({ ...biteDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !biteDetails.biteName.trim() ||
      !biteDetails.bitePrice ||
      !biteDetails.moviebiteUrl.trim()
    ) {
      Swal.fire("Validation Error", "Please fill all fields", "warning");
      return;
    }

    const payload = {
      biteName: biteDetails.biteName.trim(),
      bitePrice: biteDetails.bitePrice,
      moviebiteUrl: biteDetails.moviebiteUrl.trim(),
      user: { userId: userId },
    };

    try {
      setSubmitting(true);

      if (biteId) {
        await Api.put(`/updateMovieBiteDetails/${biteId}`, payload);
        Swal.fire("Success", "Movie bite updated", "success");
      } else {
        const response = await Api.post(`/savemoviebite`, payload);
        if (response.status === 201 || response.status === 200) {
          Swal.fire("Success", "Movie bite saved", "success");
        } else {
          throw new Error("Failed to save movie bite");
        }
      }
      navigate("/admin/moviebite");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to save/update movie bite", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Back button fixed at top-left */}
      <Button
        variant="light"
        onClick={() => navigate("/admin/moviebite")}
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

      <Container className="d-flex justify-content-center align-items-center mt-5">
        <Card className="p-4 shadow-lg rounded w-50 bg-white">
          <h3 className="text-center mb-4 text-primary fw-bold">
            {biteId ? "Edit Movie Bite" : "Add Movie Bite"}
          </h3>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Loading bite details...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="biteName">
                <Form.Label>Bite Name</Form.Label>
                <Form.Control
                  type="text"
                  name="biteName"
                  value={biteDetails.biteName}
                  onChange={handleNameChange}
                  placeholder="E.g. Popcorn"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bitePrice">
                <Form.Label>Bite Price</Form.Label>
                <Form.Control
                  type="number"
                  name="bitePrice"
                  value={biteDetails.bitePrice}
                  onChange={handleChange}
                  placeholder="E.g. 150"
                  min="1"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="moviebiteUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  name="moviebiteUrl"
                  value={biteDetails.moviebiteUrl}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  required
                />
              </Form.Group>

              {biteDetails.moviebiteUrl && (
                <div className="mb-3 text-center">
                  <img
                    src={biteDetails.moviebiteUrl}
                    alt="Preview"
                    style={{
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "10px",
                    }}
                  />
                </div>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={submitting}
                className="w-100"
              >
                {submitting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      style={{ width: "1rem", height: "1rem" }}
                    />
                    {biteId ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>{biteId ? "Update" : "Save"} Movie Bite</>
                )}
              </Button>
            </Form>
          )}
        </Card>
      </Container>
    </>
  );
};

export default AddMovieBite;
