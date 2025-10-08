import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Api from "../API/Api";
import Swal from "sweetalert2";

const ScreensAndSeats = () => {
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all screens
  const fetchAllScreens = async () => {
    setLoading(true);
    try {
      const response = await Api.get("/fetchallscreen");
      setScreens(response.data);
    } catch (err) {
      console.error("Failed to fetch screens", err);
      Swal.fire("Error!", "Failed to fetch screens.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchAllScreens();
  }, []);

  const addScreen = () => navigate("screens/add");

  const updateScreen = (screenId) => {
    navigate(`/update-screen/${screenId}`);
  };

  const deleteScreen = async (screenId) => {
    setLoading(true);
    try {
      await Api.delete(`/deleteScreen/${screenId}`);
      Swal.fire("Deleted!", "Screen deleted successfully.", "success");
      await fetchAllScreens();
    } catch (err) {
      console.error("Delete failed", err);
      Swal.fire("Error!", "Failed to delete screen.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-4">
        {/* <Button as={Link} to="/admindashboard" variant="secondary" className="ms-2">
          ← Back to Admin
        </Button> */}
      </div>

      <div className="container">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <h3>List of Screens</h3>
          <Button className="btn btn-primary" onClick={addScreen}>Add Screen</Button>
        </div>

        {loading ? (
          <div className="text-center my-5" style={{ minHeight: '200px' }}>
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Screen ID</th>
                <th>Screen Name</th>
                <th>Seating Capacity</th>
                <th>User ID</th>
                <th>User Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {screens.length > 0 ? (
                screens.map(screen => (
                  <tr key={screen.screenId}>
                    <td>{screen.screenId}</td>
                    <td>{screen.screenName}</td>
                    <td>{screen.seatingCapacity}</td>
                    <td>{screen.user?.userId}</td>
                    <td>{screen.user?.userName}</td>
                    <td>
                      <button
                        className="btn btn-info me-2"
                        onClick={() => updateScreen(screen.screenId)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteScreen(screen.screenId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No Screens Found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ScreensAndSeats;
