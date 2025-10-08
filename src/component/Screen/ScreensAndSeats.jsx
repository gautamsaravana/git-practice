import React, { useEffect, useState } from "react";
import { Button, Spinner, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Api from "../../API/Api";

const ScreensAndSeats = () => {
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreens = async () => {
      setLoading(true);
      try {
        const screensResponse = await Api.get("/fetchallscreen");
        setScreens(screensResponse.data);
      } catch (err) {
        console.error("Fetch failed", err);
        Swal.fire("Error!", "Failed to fetch screens.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  const addScreen = () => navigate("/admin/screens/add");

  const viewScreenNav = (screenId) => {
    navigate(`/admin/screens/viewscreen/${screenId}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #ece9e6, #ffffff)",
        padding: "50px 0",
      }}
    >
      <Container>
        <div
          style={{
            background: "#ffffff",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            className="text-center mb-4"
            style={{ fontWeight: "700", color: "#0A142F" }}
          >
            🎥 Screens Management
          </h2>

          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={addScreen}>
              ➕ Add Screen
            </Button>
          </div>

          {loading ? (
            <div className="text-center my-5" style={{ minHeight: "200px" }}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <table
              className="table table-striped table-bordered"
              style={{ borderRadius: "10px", overflow: "hidden" }}
            >
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Screen Name</th>
                  <th>Seating Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {screens.length > 0 ? (
                  screens
                    .slice()
                    .reverse()
                    .map((screen, idx) => (
                      <tr key={screen.screenId}>
                        <td>{idx + 1}</td>
                        <td>{screen.screenName}</td>
                        <td>{screen.seatingCapacity}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            className="me-2"
                            onClick={() =>
                              navigate(`/admin/screens/update/${screen.screenId}`)
                            }
                          >
                            Update
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => viewScreenNav(screen.screenId)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No Screens Found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ScreensAndSeats;
