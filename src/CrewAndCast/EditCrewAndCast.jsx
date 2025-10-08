import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Button, Container, Spinner } from "react-bootstrap";
import Api from "../API/Api";

const EditCrewCast = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await Api.get(`/fetchByCrewAndCast/${memberId}`);
        console.log(response.data);
        setMember(response.data);
      } catch (error) {
        console.error("Failed to fetch member details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.put(`/updatefetchCrewAndCast/${memberId}`, member);
      alert("Member updated successfully!");
      navigate(-1); // go back
    } catch (error) {
      console.error("Failed to update member", error);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!member) {
    return <Container className="mt-4">Member not found.</Container>;
  }

  return (
    <Container className="mt-4">
      <h2>Edit Crew/Cast Member</h2>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={member.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            name="role"
            value={member.role}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Member Type</Form.Label>
          <Form.Control
            name="member_type"
            value={member.member_type || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Department</Form.Label>
          <Form.Control
            name="department"
            value={member.department || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Current Photo</Form.Label>
          <div className="mb-2">
            <img
              src={member.photo_url || "/assets/default-profile.png"}
              alt="Current"
              style={{
                width: "160px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            //   onError={(e) => (e.target.src = "/assets/default-profile.png")}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Photo URL</Form.Label>
          <Form.Control
            name="photo_url"
            value={member.photo_url}
            onChange={handleChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-between">
          <Button variant="secondary" as={Link} to={-1}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditCrewCast;
