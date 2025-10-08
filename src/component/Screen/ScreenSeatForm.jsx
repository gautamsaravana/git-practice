import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Api from '../../API/Api';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

const Screenform = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [screenData, setScreenData] = useState({
    screen: {
      screenName: '',
      seatingCapacity: '',
      user: { userId: userId },
    },
    seatClasses: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleScreenChange = (e) => {
    const { name, value } = e.target;
    setScreenData({
      ...screenData,
      screen: {
        ...screenData.screen,
        [name]: value,
      },
    });
  };

  const addSeatClass = () => {
    setScreenData({
      ...screenData,
      seatClasses: [
        ...screenData.seatClasses,
        {
          seat_class: '',
          total_seat_count: '',
          price_per_seat: '',
          seatsetups: [],
        },
      ],
    });
  };

  const removeSeatClass = (index) => {
    const updated = [...screenData.seatClasses];
    updated.splice(index, 1);
    setScreenData({ ...screenData, seatClasses: updated });
  };

  const handleSeatClassChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...screenData.seatClasses];
    updated[index][name] = value;
    setScreenData({ ...screenData, seatClasses: updated }, validateForm);
  };

  const addSeatSetup = (classIndex) => {
    const updated = [...screenData.seatClasses];
    updated[classIndex].seatsetups.push({ rowLabel: '', seat_PerRow: '' });
    setScreenData({ ...screenData, seatClasses: updated });
  };

  const removeSeatSetup = (classIndex, setupIndex) => {
    const updated = [...screenData.seatClasses];
    updated[classIndex].seatsetups.splice(setupIndex, 1);
    setScreenData({ ...screenData, seatClasses: updated });
  };

  const handleSeatSetupChange = (classIndex, setupIndex, e) => {
    const { name, value } = e.target;
    const updated = [...screenData.seatClasses];
    updated[classIndex].seatsetups[setupIndex][name] = value;
    setScreenData({ ...screenData, seatClasses: updated }, validateForm);
  };

  const generateSeatNumbers = () => {
    const updatedSeatClasses = screenData.seatClasses.map((seatClass) => {
      const seatsetups = seatClass.seatsetups.map((setup) => {
        const seatnumberallocation = [];
        for (let i = 1; i <= parseInt(setup.seat_PerRow || 0); i++) {
          seatnumberallocation.push({
            seatNumber: `${setup.rowLabel}${i}`,
            seatStatus: 'available',
          });
        }
        return { ...setup, seatnumberallocation };
      });
      return { ...seatClass, seatsetups };
    });
    return { ...screenData, seatClasses: updatedSeatClasses };
  };

  const validateForm = () => {
    let formErrors = {};
    const capacity = parseInt(screenData.screen.seatingCapacity || 0);
    const totalSeats = screenData.seatClasses.reduce(
      (sum, sc) => sum + parseInt(sc.total_seat_count || 0),
      0
    );

    if (totalSeats > capacity) {
      formErrors.capacity = `Total seat count (${totalSeats}) exceeds screen capacity (${capacity})`;
    }

    screenData.seatClasses.forEach((seatClass, i) => {
      const rowSeats = seatClass.seatsetups.reduce(
        (sum, s) => sum + parseInt(s.seat_PerRow || 0),
        0
      );
      if (rowSeats !== parseInt(seatClass.total_seat_count || 0)) {
        formErrors[`class${i}`] = `Seat class "${seatClass.seat_class || 'Class ' + (i + 1)}" total seats (${seatClass.total_seat_count}) does not match sum of row seats (${rowSeats})`;
      }
    });

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const finalPayload = generateSeatNumbers();
    try {
      const res = await Api.post('/saveAll', finalPayload);
      alert('Screen saved successfully');
      console.log(res.data);
      navigate("/admin/screens");
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save screen.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="position-relative">

      {/* Back Button */}
           <Button
        variant="light"
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "-5px",
          left: "-5px",
          borderRadius: "15px",
          width: "65px",
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
          <h2 className="text-center mb-4 text-dark">🎬 Screen Management</h2>

          <div className="mb-3">
            <label className="form-label fw-bold">Screen Name</label>
            <input
              type="text"
              name="screenName"
              className="form-control w-50"
              value={screenData.screen.screenName}
              onChange={handleScreenChange}
              placeholder="Enter screen name"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Seating Capacity</label>
            <input
              type="number"
              name="seatingCapacity"
              className="form-control w-50"
              value={screenData.screen.seatingCapacity}
              onChange={handleScreenChange}
              placeholder="Total number of seats"
            />
          </div>

          {errors.capacity && (
            <div className="alert alert-danger">{errors.capacity}</div>
          )}

          <h4 className="text-primary fw-bold mb-3">Seat Classes</h4>

          {screenData.seatClasses.map((seatClass, i) => (
            <div key={i} className="p-3 mb-4 border rounded bg-light">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="text-secondary">🎟 Seat Class #{i + 1}</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeSeatClass(i)}
                >
                  Remove Class
                </button>
              </div>

              <div className="mb-2">
                <label className="form-label">Class Name</label>
                <input
                  type="text"
                  name="seat_class"
                  className="form-control w-50"
                  value={seatClass.seat_class}
                  onChange={(e) => handleSeatClassChange(i, e)}
                  placeholder="e.g. Gold, Silver"
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Total Seats</label>
                <input
                  type="number"
                  name="total_seat_count"
                  className="form-control w-50"
                  value={seatClass.total_seat_count}
                  onChange={(e) => handleSeatClassChange(i, e)}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Price per Seat</label>
                <input
                  type="number"
                  name="price_per_seat"
                  className="form-control w-50"
                  value={seatClass.price_per_seat}
                  onChange={(e) => handleSeatClassChange(i, e)}
                />
              </div>

              <h6 className="text-muted mt-3">Row Setups</h6>
              {seatClass.seatsetups.map((setup, j) => (
                <div key={j} className="row mb-2 align-items-end">
                  <div className="col-md-5">
                    <input
                      type="text"
                      name="rowLabel"
                      className="form-control"
                      placeholder="Row Label (e.g. A)"
                      value={setup.rowLabel}
                      onChange={(e) => handleSeatSetupChange(i, j, e)}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="number"
                      name="seat_PerRow"
                      className="form-control"
                      placeholder="Seats Per Row"
                      value={setup.seat_PerRow}
                      onChange={(e) => handleSeatSetupChange(i, j, e)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeSeatSetup(i, j)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-2"
                onClick={() => addSeatSetup(i)}
              >
                + Add Row Setup
              </button>

              {errors[`class${i}`] && (
                <div className="alert alert-warning mt-2">{errors[`class${i}`]}</div>
              )}
            </div>
          ))}

          <div className="mb-3">
            <button
              type="button"
              onClick={addSeatClass}
              className="btn btn-outline-primary w-50"
            >
              + Add Seat Class
            </button>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success w-50" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                '✅ Save Screen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Screenform;
