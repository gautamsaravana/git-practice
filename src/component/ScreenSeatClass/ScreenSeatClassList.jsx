import { useEffect, useState } from "react";
import { Table, Container, Button, Row, Col, ButtonGroup } from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Api from "../../API/Api";
import { useNavigate } from "react-router-dom";

export const ScreenSeatClassList = () => {
  const [seatClasses, setSeatClasses] = useState([]);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeatClasses();
  }, []);

  const fetchSeatClasses = async () => {
    try {
      const res = await Api.get("/fetchallScreenSeatClass");
      setSeatClasses(res.data);
    } catch (err) {
      console.error("Error fetching seat classes:", err);
      MySwal.fire({
        title: "Error",
        text: "Failed to fetch seat classes",
        icon: "error",
      });
    }
  };

  const handleAddScreenSeatClass = () => {
    navigate("/admin/add-screen-seat-class");
  };

  const handleEdit = (screen_seat_type_id) => {
    navigate(`/updateScreenSeatClass/${screen_seat_type_id}`);
  };

  const handleDelete = async (screen_seat_type_id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await Api.delete(`/deleteScreenSeatClass/${screen_seat_type_id}`);
        MySwal.fire("Deleted!", "Screen Seat Class has been deleted.", "success");
        fetchSeatClasses();
      } catch (err) {
        console.error("Error deleting seat class:", err);
        MySwal.fire("Error", "Failed to delete seat class", "error");
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <h2 className="text-success">Screen Seat Classes</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleAddScreenSeatClass}>
            Add Screen Seat Class
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Seat Class</th>
            <th>Price Per Seat</th>
            <th>Total Seat Count</th>
            <th>Screen Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {seatClasses.map((seatClass) => (
            <tr key={seatClass.screen_seat_type_id}>
              <td>{seatClass.screen_seat_type_id}</td>
              <td>{seatClass.seat_class}</td>
              <td>{seatClass.price_per_seat}</td>
              <td>{seatClass.total_seat_count}</td>
              <td>{seatClass.screens?.screenName}</td>
              <td>
                <ButtonGroup>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(seatClass.screen_seat_type_id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(seatClass.screen_seat_type_id)}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
