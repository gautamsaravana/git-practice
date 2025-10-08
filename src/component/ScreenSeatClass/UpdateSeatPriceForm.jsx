import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate, useParams } from "react-router-dom";
import Api from '../../API/Api';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Button, Spinner } from 'react-bootstrap';

const UpdateAllScreen = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchScreenData = async () => {
      try {
        const response = await Api.get(`/getScreenManagement/${id}`);
        console.log("Fetched data:", response.data);

        const fetchedData = response.data;

        // Normalize seatClasses and seatsetups
        fetchedData.seatClasses = fetchedData.seatClasses.map(seatClass => ({
          ...seatClass,
          price_per_seat: seatClass.price_per_seat || 0,
          seatsetups: seatClass.seatsetups || seatClass.seatsetup || []
        }));

        setFormData(fetchedData);
      } catch (error) {
        console.error('Failed to fetch screen data:', error);
      }
    };

    if (id) fetchScreenData();
  }, [id]);

  const handleScreenChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      screen: {
        ...prevData.screen,
        [name]: value,
      },
    }));
  };

  const handleSeatClassChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.seatClasses];
    updated[index][name] = value;
    setFormData({ ...formData, seatClasses: updated });
  };

  const handleSeatSetupChange = (classIndex, setupIndex, e) => {
    const { name, value } = e.target;
    const updated = [...formData.seatClasses];
    updated[classIndex].seatsetups[setupIndex][name] = value;
    setFormData({ ...formData, seatClasses: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.screen.screenName || !formData.screen.seatingCapacity) {
      MySwal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Screen name and seating capacity are required.",
      });
      return;
    }

    try {
      setLoadingSubmit(true);
      console.log("Submitting formData:", formData);
      const res = await Api.put(`/updateAll/${id}`, formData);
      console.log(res.data);

      await MySwal.fire({
        title: "Updated!",
        text: "Screen and seat information updated.",
        icon: "success",
      });
      navigate("/admin/screens");

    } catch (err) {
      console.error('Update failed', err);
      MySwal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!formData)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
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

      <div className="container mt-5 p-4 rounded" style={{ backgroundColor: '#fce4ec' }}>
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
          <h2 className="text-center mb-4 text-dark">🛠 Update Screen</h2>

          <div className="mb-3">
            <label className="form-label fw-bold">Screen Name</label>
            <input
              type="text"
              name="screenName"
              className="form-control w-50"
              value={formData.screen?.screenName || ''}
              onChange={handleScreenChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Seating Capacity</label>
            <input
              type="number"
              name="seatingCapacity"
              className="form-control w-50"
              value={formData.screen?.seatingCapacity || ''}
              onChange={handleScreenChange}
            />
          </div>

          <h4 className="text-primary fw-bold mb-3">Seat Classes</h4>

          {formData.seatClasses?.map((seatClass, i) => (
            <div key={i} className="p-3 mb-4 border rounded bg-light">
              <h5 className="text-secondary">🎟 Seat Class #{i + 1}</h5>

              <input
                type="text"
                name="seat_class"
                value={seatClass.seat_class}
                className="form-control mb-2 w-50"
                placeholder="Class name"
                onChange={(e) => handleSeatClassChange(i, e)}
              />
              <input
                type="number"
                name="total_seat_count"
                value={seatClass.total_seat_count}
                className="form-control mb-2 w-50"
                placeholder="Total seats"
                onChange={(e) => handleSeatClassChange(i, e)}
              />
              <input
                type="number"
                name="price_per_seat"
                value={seatClass.price_per_seat}
                className="form-control mb-3 w-50"
                placeholder="Price per seat"
                onChange={(e) => handleSeatClassChange(i, e)}
              />

              <h6 className="text-muted">Row Setups</h6>

              {seatClass.seatsetups?.map((setup, j) => (
                <div key={j} className="mb-3 border p-2 rounded">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <input
                        type="text"
                        name="rowLabel"
                        value={setup.rowLabel}
                        className="form-control"
                        placeholder="Row Label"
                        onChange={(e) => handleSeatSetupChange(i, j, e)}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        name="seat_PerRow"
                        value={setup.seat_PerRow}
                        className="form-control"
                        placeholder="Seats Per Row"
                        onChange={(e) => handleSeatSetupChange(i, j, e)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="text-center">
            <Button
              variant="secondary"
              className="me-3"
              onClick={() => navigate("/admin/screens")}
              disabled={loadingSubmit}
            >
              🔙 Back
            </Button>

            <Button type="submit" variant="success" className="w-50" disabled={loadingSubmit}>
              {loadingSubmit ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Updating...
                </>
              ) : (
                "✅ Update Screen"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateAllScreen;
