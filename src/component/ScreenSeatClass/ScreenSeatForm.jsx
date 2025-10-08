import { useEffect, useState } from "react";
import { Button, Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Api from "../../API/Api";

const SEAT_STATUSES = ["Available", "Booked", "Blocked"];

export const ScreenSeatForm = () => {
  const navigate = useNavigate();
  // const { screenId } = useParams();
  const MySwal = withReactContent(Swal);
  
  const [screenData, setScreenData] = useState({
    // screenId: "",
    screenName: "",
    seatingCapacity: "",
    user: { userId: 1 },
  });

  const [seatData, setSeatData] = useState([
    {
      SeatClass: "",
      TotalSeatCount: "",
      PricePerSeat: "",
      seatRows: [
        {
          rowLabel: "",
          seatCount: "",
          seatNumbers: [], // seat_number_allocation array with { seatNumber, seatStatus }
        },
      ],
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [capacityError, setCapacityError] = useState("");
  const [isDark, setIsDark] = useState(false); // dark mode toggle (optional)

  // Fetch screen and seat data if editing
  useEffect(() => {
    if (screenId) {
      fetchScreenById(screenId);
      fetchSeatData(screenId);
    }
  }, [screenId]);

  const fetchScreenById = async (id) => {
    try {
      const res = await Api.get(`/fetchonescreen/${id}`);
      setScreenData({
        screenId: res.data.screenId,
        screenName: res.data.screenName,
        seatingCapacity: res.data.seatingCapacity,
        user: { userId: res.data.user?.userId || 1 },
      });
    } catch (err) {
      console.error("Error fetching screen by ID:", err);
    }
  };

  const fetchSeatData = async () => {
    try {
      const res = await Api.get(`/fetchallScreenSeatClass`);
      const seatRowRes = await Api.get(`/getallseatsetup`);

      // Map fetched data to our state shape
      const fetchedSeats = res.data.map((seat) => ({
        SeatClass: seat.seat_class,
        TotalSeatCount: seat.total_seat_count,
        PricePerSeat: seat.price_per_seat,
        screen_seat_type_id: seat.screen_seat_type_id,
        seatRows: seatRowRes.data
          .filter((row) => row.screenseatclass.screen_seat_type_id === seat.screen_seat_type_id)
          .map((row) => ({
            rowLabel: row.rowLabel,
            seatCount: row.seat_PerRow,
            seatNumbers: row.seatNumberAllocations?.map((alloc) => ({
              seatNumber: alloc.seat_number,
              seatStatus: alloc.seat_status,
            })) || [],
          })),
      }));

      setSeatData(fetchedSeats.length ? fetchedSeats : seatData);
    } catch (err) {
      console.error("Error fetching seat and seat setup data:", err);
    }
  };

  // Handle screen input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setScreenData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle seat class fields change
  const handleSeatChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...seatData];
    updated[index][name] = value;
    setSeatData(updated);
  };

  // Generate seat numbers automatically based on rowLabel and seatCount
  const generateSeatNumbers = (rowLabel, seatCount) => {
    const count = parseInt(seatCount) || 0;
    const seatNumbers = [];
    for (let i = 1; i <= count; i++) {
      seatNumbers.push({ seatNumber: `${rowLabel}${i}`, seatStatus: "Available" });
    }
    return seatNumbers;
  };

  // Handle seat row changes and regenerate seatNumbers automatically
  const handleSeatSetupChange = (seatIndex, rowIndex, field, value) => {
    const updated = [...seatData];
    updated[seatIndex].seatRows[rowIndex][field] = value;

    if (field === "rowLabel" || field === "seatCount") {
      const row = updated[seatIndex].seatRows[rowIndex];
      // Regenerate seatNumbers when rowLabel or seatCount changes
      updated[seatIndex].seatRows[rowIndex].seatNumbers = generateSeatNumbers(
        row.rowLabel,
        row.seatCount
      );
    }

    setSeatData(updated);
  };

  // Handle seat status change only (seatNumber is auto-generated and not editable)
  const handleSeatStatusChange = (seatIndex, rowIndex, seatNumIndex, value) => {
    const updated = [...seatData];
    updated[seatIndex].seatRows[rowIndex].seatNumbers[seatNumIndex].seatStatus = value;
    setSeatData(updated);
  };

  // Add and delete seat rows
  const addSeatRow = (seatIndex) => {
    const updated = [...seatData];
    updated[seatIndex].seatRows.push({
      rowLabel: "",
      seatCount: "",
      seatNumbers: [],
    });
    setSeatData(updated);
  };

  const deleteSeatRow = (seatIndex, rowIndex) => {
    const updated = [...seatData];
    updated[seatIndex].seatRows.splice(rowIndex, 1);
    setSeatData(updated);
  };

  // Add and delete seat classes
  const addSeat = () => {
    setSeatData((prev) => [
      ...prev,
      {
        SeatClass: "",
        TotalSeatCount: "",
        PricePerSeat: "",
        seatRows: [{ rowLabel: "", seatCount: "", seatNumbers: [] }],
      },
    ]);
  };

  const deleteSeat = (index) => {
    const updated = [...seatData];
    updated.splice(index, 1);
    setSeatData(updated);
  };

  // Validate total seats vs seating capacity
  const validateCapacity = () => {
    let totalSeats = 0;
    seatData.forEach((seat) => {
      const totalSeatNum = seat.seatRows.reduce(
        (sum, row) => sum + (parseInt(row.seatCount) || 0),
        0
      );
      totalSeats += totalSeatNum;
    });

    if (totalSeats > (parseInt(screenData.seatingCapacity) || 0)) {
      setCapacityError(
        `Total seats across all classes (${totalSeats}) exceed seating capacity (${screenData.seatingCapacity}).`
      );
      return false;
    } else {
      setCapacityError("");
      return true;
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCapacity()) {
      return;
    }

    setLoading(true);
    try {
      let savedScreenId = screenData.screenId;

      if (screenId) {
        await Api.put(`/updateScreen/${screenId}`, screenData);
      } else {
        const res = await Api.post("/saveScreen", screenData);
        savedScreenId = res.data.screenId;
      }

      // Optionally delete existing seat classes/setup for the screen if updating
      // await Api.delete(`/deleteSeatsForScreen/${savedScreenId}`); // if you have such endpoint

      for (const seat of seatData) {
        const seatToSave = {
          seat_class: seat.SeatClass,
          total_seat_count: seat.TotalSeatCount,
          price_per_seat: seat.PricePerSeat,
          screens: { screenId: savedScreenId },
        };

        // Save seat class and get ID
        const seatRes = await Api.post("/savescreenseat", seatToSave);
        const seatTypeId = seatRes.data.screen_seat_type_id;

        for (const row of seat.seatRows) {
          const seatSetupPayload = {
            rowLabel: row.rowLabel,
            seat_PerRow: row.seatCount,
            screenseatclass: { screen_seat_type_id: seatTypeId },
          };

          // Save seat setup and get setup ID
          const seatSetupRes = await Api.post("/saveseatsetup", seatSetupPayload);
          const seatSetupId = seatSetupRes.data.seat_setup_id;

          // Save seat number allocations with status for this row
          for (const seatNumObj of row.seatNumbers) {
            const seatAllocationPayload = {
              seat_number: seatNumObj.seatNumber,
              seat_status: seatNumObj.seatStatus,
              seatSetup: { seat_setup_id: seatSetupId },
            };
            await Api.post("/saveseatnumber", seatAllocationPayload);
          }
        }
      }

      await MySwal.fire("Success!", "Screen and seat data saved successfully.", "success");
      navigate("/admin/screens");
    } catch (err) {
      console.error("Error saving screen/seat data:", err);
      await MySwal.fire("Error", "Failed to save screen or seat data.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`d-flex justify-content-center align-items-center min-vh-100`}
      style={{
        background: isDark
          ? "linear-gradient(to right, #141e30, #243b55)"
          : "linear-gradient(to right, #fdfbfb, #ebedee)",
      }}
    >
      <Card
        className="shadow rounded-4 p-4"
        style={{ width: "100%", maxWidth: "900px" }}
      >
        <Card.Title className="mb-4 text-center">
          {screenId ? "Update Screen and Seats" : "Add New Screen and Seats"}
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="screenName">
                <Form.Label>Screen Name</Form.Label>
                <Form.Control
                  type="text"
                  name="screenName"
                  value={screenData.screenName}
                  onChange={handleChange}
                  placeholder="Enter Screen Name"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="seatingCapacity">
                <Form.Label>Seating Capacity</Form.Label>
                <Form.Control
                  type="number"
                  name="seatingCapacity"
                  value={screenData.seatingCapacity}
                  onChange={handleChange}
                  placeholder="Enter Seating Capacity"
                  required
                  min={1}
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          {seatData.map((seat, seatIndex) => (
            <Card
              className="mb-4 p-3"
              key={seatIndex}
              border="primary"
              bg={isDark ? "dark" : "light"}
            >
              <Row className="align-items-center mb-3">
                <Col md={3}>
                  <Form.Group controlId={`seatClass-${seatIndex}`}>
                    <Form.Label>Seat Class</Form.Label>
                    <Form.Control
                      type="text"
                      name="SeatClass"
                      value={seat.SeatClass}
                      onChange={(e) => handleSeatChange(seatIndex, e)}
                      placeholder="e.g. Platinum, Gold"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId={`totalSeats-${seatIndex}`}>
                    <Form.Label>Total Seats</Form.Label>
                    <Form.Control
                      type="number"
                      name="TotalSeatCount"
                      value={seat.TotalSeatCount}
                      onChange={(e) => handleSeatChange(seatIndex, e)}
                      placeholder="Total Seats in Class"
                      required
                      min={1}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId={`pricePerSeat-${seatIndex}`}>
                    <Form.Label>Price Per Seat</Form.Label>
                    <Form.Control
                      type="number"
                      name="PricePerSeat"
                      value={seat.PricePerSeat}
                      onChange={(e) => handleSeatChange(seatIndex, e)}
                      placeholder="Seat Price"
                      required
                      min={0}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex justify-content-end">
                  <Button
                    variant="danger"
                    onClick={() => deleteSeat(seatIndex)}
                    disabled={seatData.length === 1}
                    style={{ height: "38px" }}
                  >
                    Delete Seat Class
                  </Button>
                </Col>
              </Row>

              {/* Seat Rows */}
              {seat.seatRows.map((row, rowIndex) => (
                <Card
                  key={rowIndex}
                  bg={isDark ? "secondary" : "light"}
                  className="mb-3 p-3"
                >
                  <Row className="align-items-center mb-2">
                    <Col md={3}>
                      <Form.Group controlId={`rowLabel-${seatIndex}-${rowIndex}`}>
                        <Form.Label>Row Label</Form.Label>
                        <Form.Control
                          type="text"
                          value={row.rowLabel}
                          onChange={(e) =>
                            handleSeatSetupChange(
                              seatIndex,
                              rowIndex,
                              "rowLabel",
                              e.target.value.toUpperCase()
                            )
                          }
                          placeholder="e.g. A, B, C"
                          maxLength={1}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId={`seatCount-${seatIndex}-${rowIndex}`}>
                        <Form.Label>Seat Count</Form.Label>
                        <Form.Control
                          type="number"
                          value={row.seatCount}
                          onChange={(e) =>
                            handleSeatSetupChange(
                              seatIndex,
                              rowIndex,
                              "seatCount",
                              e.target.value
                            )
                          }
                          placeholder="Number of seats in this row"
                          min={1}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex justify-content-end">
                      <Button
                        variant="danger"
                        onClick={() => deleteSeatRow(seatIndex, rowIndex)}
                        disabled={seat.seatRows.length === 1}
                        style={{ height: "38px" }}
                      >
                        Delete Row
                      </Button>
                    </Col>
                  </Row>

                  {/* Auto-generated seat numbers and status */}
                  <div>
                    <strong>Seat Numbers (auto-generated):</strong>
                    {row.seatNumbers.length === 0 && <p>No seats defined yet.</p>}
                    {row.seatNumbers.map((seatNumObj, seatNumIndex) => (
                      <Row
                        key={seatNumIndex}
                        className="align-items-center mt-2"
                        style={{ gap: "0.5rem" }}
                      >
                        <Col md={3}>
                          <Form.Control
                            type="text"
                            value={seatNumObj.seatNumber}
                            readOnly
                            plaintext
                          />
                        </Col>
                        <Col md={3}>
                          <Form.Select
                            value={seatNumObj.seatStatus}
                            onChange={(e) =>
                              handleSeatStatusChange(
                                seatIndex,
                                rowIndex,
                                seatNumIndex,
                                e.target.value
                              )
                            }
                            required
                          >
                            {SEAT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Card>
              ))}

              <Button variant="secondary" onClick={() => addSeatRow(seatIndex)}>
                + Add Seat Row
              </Button>
            </Card>
          ))}

          <Button variant="primary" className="mb-3" onClick={addSeat}>
            + Add Seat Class
          </Button>

          {capacityError && (
            <div className="mb-3 text-danger fw-bold">{capacityError}</div>
          )}

          <div className="d-grid gap-2">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : screenId ? (
                "Update Screen & Seats"
              ) : (
                "Save Screen & Seats"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
