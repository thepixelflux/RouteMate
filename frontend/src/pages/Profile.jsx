import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    college: "",
    bio: "",
  });

  const [hostedRides, setHostedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync profile details on mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        college: user.college || "",
        bio: user.bio || "",
      });
      fetchUserRides();
    }
  }, [user]);

  const fetchUserRides = async () => {
    setRidesLoading(true);
    try {
      const res = await api.get("/rides");
      const allRides = res.data;
      
      // Filter hosted rides (where current user is driver)
      const hosted = allRides.filter((ride) => ride.driver?._id === user?._id);
      
      // Filter joined rides (where current user is passenger)
      const joined = allRides.filter((ride) => 
        ride.passengers?.some((p) => p._id === user?._id)
      );

      setHostedRides(hosted);
      setJoinedRides(joined);
    } catch (err) {
      console.error("Could not fetch profile schedules:", err);
    } finally {
      setRidesLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const res = await updateProfile(formData);

    if (res.success) {
      setSuccess("Profile details updated successfully!");
      setEditMode(false);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return <span className="badge badge-available">Available</span>;
      case "Full":
        return <span className="badge badge-full">Full</span>;
      case "Completed":
        return <span className="badge badge-completed">Completed</span>;
      case "Cancelled":
        return <span className="badge badge-cancelled">Cancelled</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div>
      <div className="grid-2">
        {/* Profile Card & Form */}
        <div className="dmrc-panel">
          <div className="dmrc-panel-title">
            <span>Commuter Profile Card</span>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="btn btn-primary btn-small">
                Edit Details
              </button>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {!editMode ? (
            <div style={{ lineHeight: "2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "var(--primary-color)",
                    color: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                >
                  {user?.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "var(--primary-color)" }}>{user?.fullName}</h3>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{user?.email}</span>
                </div>
              </div>

              <table className="dmrc-table" style={{ border: "none" }}>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: "none", width: "120px" }}><strong>College Circle:</strong></td>
                    <td style={{ borderBottom: "none" }}>{user?.college}</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: "none" }}><strong>Phone:</strong></td>
                    <td style={{ borderBottom: "none" }}>{user?.phone || "No phone added"}</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: "none" }}><strong>Personal Bio:</strong></td>
                    <td style={{ borderBottom: "none" }}>{user?.bio || "No bio added"}</td>
                  </tr>
                  <tr>
                    <td style={{ borderBottom: "none" }}><strong>Driver Rating:</strong></td>
                    <td style={{ borderBottom: "none" }}>
                      {user?.rating > 0 ? (
                        <span className="star-rating">
                          ★ {user.rating.toFixed(1)}{" "}
                          <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                            ({user.totalRatings} ratings)
                          </span>
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)" }}>No ratings yet</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="college">CollegeCircle / Hub</label>
                <input
                  type="text"
                  id="college"
                  name="college"
                  className="form-control"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Commuter Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  className="form-control"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <button type="submit" className="btn btn-secondary" disabled={loading}>
                  {loading ? "Updating..." : "Save Details"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setError("");
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* User Rides Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Hosted Rides */}
          <div className="dmrc-panel">
            <div className="dmrc-panel-title">
              <span>My Hosted Rides (Driving)</span>
            </div>

            {ridesLoading ? (
              <p style={{ textAlign: "center" }}>Fetching Hosted Schedules...</p>
            ) : hostedRides.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>You are not hosting any rides currently.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="dmrc-table">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Date</th>
                      <th>Seats</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostedRides.map((ride) => (
                      <tr key={ride._id}>
                        <td>
                          <strong>{ride.source} → {ride.destination}</strong>
                        </td>
                        <td>
                          {new Date(ride.date).toLocaleDateString()} at {ride.departureTime}
                        </td>
                        <td style={{ textAlign: "center" }}>{ride.availableSeats}</td>
                        <td>{getStatusBadge(ride.status)}</td>
                        <td>
                          <Link to={`/ride/${ride._id}`} className="btn btn-secondary btn-small">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Joined Rides */}
          <div className="dmrc-panel">
            <div className="dmrc-panel-title">
              <span>My Booked Rides (Passenger)</span>
            </div>

            {ridesLoading ? (
              <p style={{ textAlign: "center" }}>Fetching Booked Schedules...</p>
            ) : joinedRides.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>You have not joined any rides as passenger.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="dmrc-table">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Driver</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {joinedRides.map((ride) => (
                      <tr key={ride._id}>
                        <td>
                          <strong>{ride.source} → {ride.destination}</strong>
                        </td>
                        <td>{ride.driver?.fullName || "Commuter"}</td>
                        <td>
                          {new Date(ride.date).toLocaleDateString()} at {ride.departureTime}
                        </td>
                        <td>{getStatusBadge(ride.status)}</td>
                        <td>
                          <Link to={`/ride/${ride._id}`} className="btn btn-primary btn-small">
                            Open Chat
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
