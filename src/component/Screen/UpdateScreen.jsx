import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import Api from "../../API/Api";
import { ArrowLeft } from "react-bootstrap-icons";

const UpdateScreen = () => {
  const userId = localStorage.getItem("userId");
  const { id: screenId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [screenData, setScreenData] = useState({
    screenId: "",
    screenName: "",
    seatingCapacity: "",
  });

  const [seatClasses, setSeatClasses] = useState([]);

  useEffect(() => {
    fetchScreenDetails();
  }, []);

  const fetchScreenDetails = async () => {
    try {
      const response = await Api.get(`/fetchScreenDetails/${screenId}`);
      const data = response.data;

      setScreenData({
        screenId: data.screenId,
        screenName: data.screenName,
        seatingCapacity: data.seatingCapacity,
      });

      const seatClassList = data.screenseatclass ?? [];
      setSeatClasses(seatClassList);
    } catch (err) {
      console.error("Error fetching screen details", err);
      Swal.fire("Error", "Failed to fetch screen details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (index, value) => {
    const updated = [...seatClasses];
    updated[index].price_per_seat = value;
    setSeatClasses(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = seatClasses.map((seatClass) => ({
      screen_seat_type_id: seatClass.screen_seat_type_id,
      price_per_seat: parseFloat(seatClass.price_per_seat),
    }));

    console.log(payload);

    try {
      const updateRequests = seatClasses.map(() =>
        Api.put(`/update-prices/${screenId}`, payload)
      );

      await Promise.all(updateRequests);

      Swal.fire("Success", "All seat class prices updated!", "success").then(
        () => {
          navigate("/admin/screens");
        }
      );
    } catch (err) {
      console.error("Error updating seat details", err);
      Swal.fire("Error", "Failed to update seat details.", "error");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="position-relative mt-5">
      {/* Floating Back Button */}
      <Button
        variant="light"
        onClick={handleBack}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          zIndex: 1000,
        }}
      >
        <ArrowLeft size={20} />
      </Button>

      <Container className="mt-4">
        <h3>Update Screen Details</h3>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Label>Screen Name</Form.Label>
              <Form.Control type="text" value={screenData.screenName} readOnly />
            </Col>
            <Col>
              <Form.Label>Seating Capacity</Form.Label>
              <Form.Control
                type="number"
                value={screenData.seatingCapacity}
                readOnly
              />
            </Col>
          </Row>

          <h5 className="mt-4">Seat Class Details</h5>
          {seatClasses.map((seat, index) => (
            <Row className="mb-3" key={seat.screen_seat_type_id}>
              <Col>
                <Form.Label>Seat Class</Form.Label>
                <Form.Control type="text" value={seat.seat_class} readOnly />
              </Col>
              <Col>
                <Form.Label>Price Per Seat</Form.Label>
                <Form.Control
                  type="number"
                  value={seat.price_per_seat}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  required
                />
              </Col>
            </Row>
          ))}

          <Button type="submit" variant="primary">
            Update
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => navigate("/listofScreens")}
          >
            Cancel
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default UpdateScreen;
