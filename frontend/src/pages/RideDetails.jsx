import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRideDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/rides/${id}`);
      setRide(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ride details from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="dmrc-panel" style={{ textAlign: "center", padding: "50px" }}>
        <h4>Connecting with Transit Database...</h4>
      </div>
    );
  }

  if (error || !ride) {
    return (
      <div className="dmrc-panel">
        <div className="alert alert-danger">{error || "Ride details not found."}</div>
        <Link to="/findride" className="btn btn-primary">
          Back to Find Ride
        </Link>
      </div>
    );
  }

  const isDriver = ride.driver?._id === user?._id;
  const isPassenger = ride.passengers?.some((p) => p._id === user?._id);

  const handleJoin = async () => {
    setError("");
    setActionLoading(true);
    try {
      await api.post(`/rides/${id}/join`);
      await fetchRideDetails(); // Reload data
    } catch (err) {
      setError(err.response?.data?.message || "Could not join ride.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    setError("");
    setActionLoading(true);
    try {
      await api.post(`/rides/${id}/leave`);
      await fetchRideDetails(); // Reload data
    } catch (err) {
      setError(err.response?.data?.message || "Could not leave ride.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to cancel this ride schedule? This action cannot be undone.")) {
      return;
    }
    setError("");
    setActionLoading(true);
    try {
      await api.delete(`/rides/${id}`);
      navigate("/findride");
    } catch (err) {
      setError(err.response?.data?.message || "Could not cancel ride.");
      setActionLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Back Link */}
      <div style={{ marginBottom: "15px" }}>
        <Link to="/findride" style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
          ← Back to Ride Schedules
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-2">
        {/* Route Info Panel */}
        <div className="dmrc-panel">
          <div className="dmrc-panel-title">
            <span>Ride Schedule Details</span>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>
              ROUTE
            </span>
            <h3 style={{ color: "var(--primary-color)", fontSize: "20px" }}>
              {ride.source} → {ride.destination}
            </h3>
          </div>

          <table className="dmrc-table" style={{ marginTop: "15px", marginBottom: "20px" }}>
            <tbody>
              <tr>
                <td><strong>Travel Date</strong></td>
                <td>{new Date(ride.date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td><strong>Departure Time</strong></td>
                <td>{ride.departureTime}</td>
              </tr>
              <tr>
                <td><strong>Split Cost (Fare)</strong></td>
                <td style={{ color: "var(--success-color)", fontWeight: "bold" }}>₹{ride.price}</td>
              </tr>
              <tr>
                <td><strong>Vehicle Mode</strong></td>
                <td style={{ textTransform: "uppercase" }}>{ride.vehicleType}</td>
              </tr>
              <tr>
                <td><strong>Available Seats</strong></td>
                <td><strong>{ride.availableSeats}</strong> remaining</td>
              </tr>
              <tr>
                <td><strong>Schedule Status</strong></td>
                <td>
                  {ride.status === "Available" && <span className="badge badge-available">Available</span>}
                  {ride.status === "Full" && <span className="badge badge-full">Full</span>}
                  {ride.status === "Completed" && <span className="badge badge-completed">Completed</span>}
                  {ride.status === "Cancelled" && <span className="badge badge-cancelled">Cancelled</span>}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {isDriver && (
              <button
                onClick={handleDelete}
                className="btn btn-secondary btn-block"
                disabled={actionLoading}
              >
                Cancel Ride Schedule
              </button>
            )}

            {!isDriver && !isPassenger && (
              <button
                onClick={handleJoin}
                className="btn btn-success btn-block"
                disabled={actionLoading || ride.availableSeats <= 0 || ride.status !== "Available"}
              >
                {ride.availableSeats <= 0 ? "Seats Full" : "Book / Join Ride"}
              </button>
            )}

            {isPassenger && (
              <>
                <Link to={`/chat/${ride._id}`} className="btn btn-primary" style={{ flex: 1, textAlign: "center" }}>
                  Open Group Chat
                </Link>
                <button
                  onClick={handleLeave}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={actionLoading}
                >
                  Leave Ride
                </button>
              </>
            )}

            {isDriver && (
              <Link to={`/chat/${ride._id}`} className="btn btn-primary btn-block" style={{ textAlign: "center", marginTop: "10px" }}>
                Open Driver Group Chat
              </Link>
            )}
          </div>
        </div>

        {/* Members & Driver details */}
        <div>
          {/* Driver Panel */}
          <div className="dmrc-panel" style={{ borderTopColor: "var(--accent-color)" }}>
            <div className="dmrc-panel-title">
              <span>Driver / Host Profile</span>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {ride.driver?.fullName?.charAt(0).toUpperCase() || "D"}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "16px" }}>{ride.driver?.fullName}</h4>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                  College: {ride.driver?.college}
                </p>
                {ride.driver?.rating > 0 && (
                  <div className="star-rating" style={{ fontSize: "13px" }}>
                    ★ {ride.driver.rating.toFixed(1)} <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>({ride.driver.totalRatings} ratings)</span>
                  </div>
                )}
              </div>
            </div>

            {ride.driver?.bio && (
              <div style={{ backgroundColor: "#f9f9f9", padding: "10px", borderLeft: "3px solid #ccc", fontSize: "13px" }}>
                <em>"{ride.driver.bio}"</em>
              </div>
            )}
          </div>

          {/* Passenger Panel */}
          <div className="dmrc-panel">
            <div className="dmrc-panel-title">
              <span>Passengers Joined ({ride.passengers?.length || 0})</span>
            </div>

            {ride.passengers?.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No passengers have booked seats yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {ride.passengers.map((passenger) => (
                  <div
                    key={passenger._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px",
                      borderBottom: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#888",
                        color: "white",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {passenger.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "bold" }}>{passenger.fullName}</span>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                        College: {passenger.college}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
