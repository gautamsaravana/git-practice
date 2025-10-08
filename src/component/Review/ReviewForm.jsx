import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import Api from "../../API/Api";

const ReviewForm = ({ movieId, userId, onSuccess }) => {
  const [rating, setRating] = useState("");
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      await Api.post("/API/MovieReview", {
         movie:{movieId},
         user: {userId},
        rating: parseFloat(rating),
        review: review.trim(),
      });
      setRating("");
      setReview("");
      setSuccessMsg("Review submitted successfully!");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4 p-3 rounded shadow-sm bg-light">
      <h5 className="mb-3">Leave a Review</h5>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Rating (1 to 5)</Form.Label>
        <Form.Control
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Review Comment</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
};

export default ReviewForm;
