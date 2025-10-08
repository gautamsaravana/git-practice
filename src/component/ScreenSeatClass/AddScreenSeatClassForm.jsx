import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Api from "../../API/Api";
import { ArrowLeft } from "react-bootstrap-icons";

export const AddScreenSeatClassForm = () => {
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const [seatClassOptions, setSeatClassOptions] = useState([]);
  const [screenOptions, setScreenOptions] = useState([]);
  const [formData, setFormData] = useState({
    seatClass: "",
    totalSeatCount: "",
    pricePerSeat: "",
    screenId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllSeatClasses();
    fetchAllScreens();
  }, []);

  const fetchAllSeatClasses = async () => {
    try {
      const res = await Api.get("/api/screenseatclass/fetchall");
      setSeatClassOptions(res.data);
    } catch (err) {
      console.error("Error fetching seat classes:", err);
    }
  };

  const fetchAllScreens = async () => {
    try {
      const res = await Api.get("/fetchallscreen");
      setScreenOptions(res.data);
    } catch (err) {
      console.error("Error fetching screens:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validation runs on submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.seatClass) newErrors.seatClass = "Seat Class is required";

    if (
      formData.totalSeatCount === "" ||
      isNaN(formData.totalSeatCount) ||
      +formData.totalSeatCount <= 0
    )
      newErrors.totalSeatCount = "Valid total seat count is required";

    if (
      formData.pricePerSeat === "" ||
      isNaN(formData.pricePerSeat) ||
      +formData.pricePerSeat < 0
    )
      newErrors.pricePerSeat = "Valid price per seat is required";

    if (!formData.screenId) newErrors.screenId = "Screen selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      seatClass: formData.seatClass,
      totalSeatCount: parseInt(formData.totalSeatCount, 10),
      pricePerSeat: parseFloat(formData.pricePerSeat),
      screenId: formData.screenId,
    };

    try {
      await Api.post("/savescreenseat", payload);
      await MySwal.fire("Added!", "Seat class added successfully", "success");
      navigate("/admin/screens");
    } catch (err) {
      console.error("Error saving:", err);
      await MySwal.fire("Error", "Failed to save seat class", "error");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Back Button */}
      <Button
        variant="light"
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "-5px",
          left: "-5px",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <ArrowLeft size={20} />
      </Button>
      <div className="container pt-4">
        <h3>Add Screen Seat Class</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="seatClass">
            <Form.Label>Seat Class</Form.Label>
            <Form.Select
              name="seatClass"
              value={formData.seatClass}
              onChange={handleChange}
            >
              <option value="">-- Select Seat Class --</option>
              {seatClassOptions.map((option) => (
                <option key={option.id} value={option.seat_class}>
                  {option.seat_class}
                </option>
              ))}
            </Form.Select>
            {errors.seatClass && (
              <div className="text-danger">{errors.seatClass}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="totalSeatCount">
            <Form.Label>Total Seat Count</Form.Label>
            <Form.Control
              type="number"
              name="totalSeatCount"
              value={formData.totalSeatCount}
              onChange={handleChange}
              min={1}
              onBlur={() => {
                if (formData.totalSeatCount === "") {
                  setFormData((prev) => ({ ...prev, totalSeatCount: "" }));
                } else {
                  const val = parseInt(formData.totalSeatCount, 10);
                  if (isNaN(val) || val < 1) {
                    setFormData((prev) => ({ ...prev, totalSeatCount: "1" }));
                  }
                }
              }}
            />
            {errors.totalSeatCount && (
              <div className="text-danger">{errors.totalSeatCount}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="pricePerSeat">
            <Form.Label>Price Per Seat</Form.Label>
            <Form.Control
              type="number"
              name="pricePerSeat"
              value={formData.pricePerSeat}
              onChange={handleChange}
              min={0}
              step="0.01"
              onBlur={() => {
                if (formData.pricePerSeat === "") {
                  setFormData((prev) => ({ ...prev, pricePerSeat: "" }));
                } else {
                  const val = parseFloat(formData.pricePerSeat);
                  if (isNaN(val) || val < 0) {
                    setFormData((prev) => ({ ...prev, pricePerSeat: "0" }));
                  }
                }
              }}
            />
            {errors.pricePerSeat && (
              <div className="text-danger">{errors.pricePerSeat}</div>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="screenId">
            <Form.Label>Screen</Form.Label>
            <Form.Select
              name="screenId"
              value={formData.screenId}
              onChange={handleChange}
            >
              <option value="">-- Select Screen --</option>
              {screenOptions.map((screen) => (
                <option key={screen.screenId} value={screen.screenId}>
                  {screen.screenName}
                </option>
              ))}
            </Form.Select>
            {errors.screenId && (
              <div className="text-danger">{errors.screenId}</div>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Add Seat Class
          </Button>
        </Form>
      </div>
    </>
  );
};
