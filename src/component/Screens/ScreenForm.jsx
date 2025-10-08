import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Api from "../../API/Api";
import { useNavigate, useParams } from "react-router-dom";

export const ScreenForm = () => {
  const navigate = useNavigate();
  const { screenId } = useParams();

  const [screenData, setScreenData] = useState({
    screenName: "",
    seatingCapacity: "",
    user: {
      userId: 1,
    },
  });

  const screenNameOptions = [
    "Screen 1",
    "Screen 2",
    "Screen 3",
    "IMAX",
    "Premium Lounge",
  ];

  const [errMsgs, setErrMsgs] = useState({
    screenName: "",
    seatingCapacity: "",
  });

  useEffect(() => {
    if (screenId) {
      fetchScreenById(screenId);
    }
  }, [screenId]);

  const fetchScreenById = async (id) => {
    try {
      const res = await Api.get(`/fetchonescreen/${id}`);
      console.log(res.data);
      setScreenData({
        screenName: res.data.screenName,
        seatingCapacity: res.data.seatingCapacity,
        user: {
          userId: res.data.user?.userId || 1,
        },
      });
    } catch (err) {
      console.error("Error fetching screen by id:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "userId") {
      setScreenData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          userId: value,
        },
      }));
      return;
    }

    const updatedScreenData = { ...screenData, [name]: value };
    const updatedErrors = { ...errMsgs };

    if (name === "screenName") {
      updatedErrors.screenName = value === "" ? "Please select a screen name" : "";
    } else if (name === "seatingCapacity") {
      updatedErrors.seatingCapacity = !/^[0-9]+$/.test(value)
        ? "Enter only numbers"
        : "";
    }

    setScreenData(updatedScreenData);
    setErrMsgs(updatedErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const screen = { ...screenData };

    if (!screen.screenName || !screen.seatingCapacity) {
      alert("Please fill all required fields correctly.");
      return;
    }

    try {
      if (screenId) {
        const result = await Api.put(`/updateScreen/${screenId}`, screen);
        console.log(result);
        alert("Screen updated successfully!");
      } else {
        const response = await Api.post("/SaveScreen", screen);
        console.log(response);
        if (response.status === 201) {
          alert("Screen added successfully!");
        } else {
          alert("Failed to add screen.");
          return;
        }
      }
      navigate("/admin/screens");
    } catch (err) {
      console.error("Error saving screen:", err);
      alert("Failed to save screen.");
    }
  };

  return (
    <div className="bg-container">
      <div className="container pb-5 pt-5 h-50 w-50">
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label className="text-success fs-5 fw-bold mt-4">Screen Name</Form.Label>
            <Form.Select
              name="screenName"
              value={screenData.screenName}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Screen --</option>
              {screenNameOptions.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </Form.Select>
            {errMsgs.screenName && <div className="text-danger">{errMsgs.screenName}</div>}
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-success fs-5 fw-bold mt-1">Seating Capacity</Form.Label>
            <Form.Control
              type="number"
              name="seatingCapacity"
              placeholder="Enter seat capacity"
              value={screenData.seatingCapacity}
              onChange={handleChange}
              required
            />
            {errMsgs.seatingCapacity && (
              <div className="text-danger">{errMsgs.seatingCapacity}</div>
            )}
          </Form.Group>

          <center>
            <Button type="submit" className="btn btn-primary mt-4">
              {screenId ? "Update" : "Add"} Screen
            </Button>
          </center>
        </Form>
      </div>
    </div>
  );
};
