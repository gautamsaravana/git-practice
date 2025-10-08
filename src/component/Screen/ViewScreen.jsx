import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ViewScreen.css";
import { Card } from "react-bootstrap";
import Api from "../../API/Api";

export const ViewScreen = () => {
  const { id: screenId } = useParams();
  const [screenDetails, setScreenDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const getScreenDetails = async () => {
    try {
      const response = await Api.get(`getScreenManagement/${screenId}`);
      setScreenDetails(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.log("Failed to fetch screen details", error);
    }
  };

  useEffect(() => {
    getScreenDetails();
  }, []);

  const handleSeatClick = (row, seatNumber) => {
    const seatId = `${row}${seatNumber}`;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeatsByClass = () => {
    if (!screenDetails?.seatClasses?.length) {
      return <div style={{ color: "red" }}>Loading..</div>;
    }

    return screenDetails.seatClasses.map((classItem, index) => (
      <div key={index} className="container seat-class-block">
        <h4 className="seat-class-title">{classItem.seat_class}</h4>

        {Array.isArray(classItem.seatsetups) && classItem.seatsetups.length > 0 ? (
          classItem.seatsetups.map((setup) => {
            const { rowLabel, seat_PerRow, seatnumberallocation } = setup;

            const statusMap = {};
            if (Array.isArray(seatnumberallocation)) {
              seatnumberallocation.forEach((seat) => {
                statusMap[seat.seatNumber] = seat.seatStatus;
              });
            }

            return (
              <div className="seat-row" key={rowLabel}>
                <div className="row-label">{rowLabel}</div>
                <div className="seat-group">
                  {Array.from({ length: seat_PerRow }, (_, i) => {
                    const seatNumber = i + 1;
                    const seatId = `${rowLabel}${seatNumber}`;
                    const seatStatus = statusMap[seatId] || "available";

                    let className = "seat";
                    if (seatStatus === "sold") className += " sold";
                    else if (selectedSeats.includes(seatId)) className += " selected";
                    else className += " available";

                    return (
                      <div
                        key={seatId}
                        className={className}
                        onClick={() =>
                          seatStatus !== "sold" && handleSeatClick(rowLabel, seatNumber)
                        }
                      >
                        {seatNumber}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ color: "gray", fontStyle: "italic" }}>
            Seat setup not found.
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{minHeight: "100vh", marginTop: "60px"}}>
      <Card className="w-75 p-4 shadow">
        <div className="view-screen-container">
          <h2 className="screen-title">{screenDetails?.screendto?.screenName || "Screen"}</h2>

          <div className="seat-layout-container">{renderSeatsByClass()}</div>

          <div className="screen-bar"></div>
          <div style={{ fontSize: "18px", marginTop: "5px", color: "#333" }}>
            All eyes are this way please!
          </div>

          {/* Legend
          <div className="legend mt-4">
            <div><span className="seat available"></span> Available</div>
            <div><span className="seat selected"></span> Selected</div>
            <div><span className="seat sold"></span> Sold</div>
          </div> */}
        </div>
      </Card>
    </div>
  );
};

export default ViewScreen;
