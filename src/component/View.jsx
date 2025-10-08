import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Api from "../API/Api";
import Swal from "sweetalert2";

const ScreensAndSeats = () => {
  const navigate = useNavigate();
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data but only use screens for display
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const screensResponse = await Api.get("/fetchallscreen");
        setScreens(screensResponse.data);

        // These are fetched but not displayed now
        await Api.get("/fetchallScreenSeatClass");
        await Api.get("/getallseatsetup");
        await Api.get("/getallseatnumberallocation");

      } catch (err) {
        console.error("Fetch failed", err);
        Swal.fire("Error!", "Failed to fetch screens data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addScreen = () => navigate("/addnewscreenandseat");

  const updateScreen = (screenId) => {
    navigate(`/addnewscreenandseat/${screenId}`);
  };

  const deleteScreen = async (screenId) => {
    setLoading(true);
    try {
      await Api.delete(`/deleteScreen/${screenId}`);
      Swal.fire("Deleted!", "Screen deleted successfully.", "success");

      const updatedScreens = await Api.get("/fetchallscreen");
      setScreens(updatedScreens.data);
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
        <Button as={Link} to="/admindashboard" variant="secondary" className="ms-2">
          ← Back to Admin
        </Button>
      </div>

      <div className="container">
        <h3 className="mb-4">Screens Management</h3>

        <div className="d-flex align-items-center mb-4">
          <Button className="btn btn-primary" onClick={addScreen}>
            Add Screen
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5" style={{ minHeight: "200px" }}>
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <table className="table table-bordered table-striped w-40%">
            <thead>
              <tr>
                <th>Screen ID</th>
                <th>Screen Name</th>
                <th>Seating Capacity</th>
                {/* <th>User ID</th> */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {screens.length > 0 ? (
                screens.map((screen) => (
                  <tr key={screen.screenId}>
                    <td>{screen.screenId}</td>
                    <td>{screen.screenName}</td>
                    <td>{screen.seatingCapacity}</td>
                    {/* <td>{screen.userId}</td> */}
                    <td>
                      <button
                        className="btn btn-info me-2"
                        onClick={() => updateScreen(screen.screenId)}
                      >
                        Update
                      </button>
                      {/* <button
                        className="btn btn-danger"
                        onClick={() => deleteScreen(screen.screenId)}
                      >
                        Delete
                      </button> */}
                     
                      <button
                        className="btn btn-secondary"
                       
                      >
                        ViewScreen
                      </button>








                      
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Screens Found
                  </td>
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
