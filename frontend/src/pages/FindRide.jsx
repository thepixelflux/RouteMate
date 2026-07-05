import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

const FindRide = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchInputs, setSearchInputs] = useState({
    source: searchParams.get("source") || "",
    destination: searchParams.get("destination") || "",
    date: searchParams.get("date") || "",
  });

  const fetchRides = async (queryObject) => {
    setLoading(true);
    setError("");
    try {
      const activeQueries = {};
      if (queryObject.source) activeQueries.source = queryObject.source;
      if (queryObject.destination) activeQueries.destination = queryObject.destination;
      if (queryObject.date) activeQueries.date = queryObject.date;

      const hasQueries = Object.keys(activeQueries).length > 0;
      
      const endpoint = hasQueries ? "/rides/search" : "/rides";
      const res = await api.get(endpoint, { params: activeQueries });
      
      setRides(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch rides from network.");
    } finally {
      setLoading(false);
    }
  };

  // Run search when URL params change
  useEffect(() => {
    const queryObject = {
      source: searchParams.get("source") || "",
      destination: searchParams.get("destination") || "",
      date: searchParams.get("date") || "",
    };
    fetchRides(queryObject);
  }, [searchParams]);

  const handleInputChange = (e) => {
    setSearchInputs({ ...searchInputs, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchInputs.source) params.source = searchInputs.source;
    if (searchInputs.destination) params.destination = searchInputs.destination;
    if (searchInputs.date) params.date = searchInputs.date;
    setSearchParams(params);
  };

  const handleClear = () => {
    setSearchInputs({ source: "", destination: "", date: "" });
    setSearchParams({});
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
      {/* Header Panel */}
      <div className="dmrc-panel" style={{ borderTopColor: "var(--secondary-color)" }}>
        <div className="dmrc-panel-title">
          <span>Search Available Rides</span>
        </div>
        
        <form onSubmit={handleSearchSubmit}>
          <div className="grid-3" style={{ gap: "15px" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="source">Source Metro Station</label>
              <input
                type="text"
                id="source"
                name="source"
                className="form-control"
                placeholder="e.g. Noida Electronic City"
                value={searchInputs.source}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="destination">Destination Metro Station</label>
              <input
                type="text"
                id="destination"
                name="destination"
                className="form-control"
                placeholder="e.g. Dwarka Sector 21"
                value={searchInputs.destination}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="date">Travel Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={searchInputs.date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px", justifyContent: "flex-end" }}>
            <button type="button" onClick={handleClear} className="btn btn-outline">
              Clear Filters
            </button>
            <button type="submit" className="btn btn-primary">
              Filter Rides
            </button>
          </div>
        </form>
      </div>

      {/* Results Table Panel */}
      <div className="dmrc-panel">
        <div className="dmrc-panel-title">
          <span>Co-riding Schedule List</span>
          {rides.length > 0 && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{rides.length} matching rides found</span>}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <h4>Connecting with Metro Co-riding Database...</h4>
          </div>
        ) : rides.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <h3>No co-rides scheduled for this route.</h3>
            <p>Try searching other stations or offer a ride yourself!</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="dmrc-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Route</th>
                  <th>Date & Time</th>
                  <th>Vehicle</th>
                  <th>Price</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rides.map((ride) => (
                  <tr key={ride._id}>
                    <td>
                      <div>
                        <strong>{ride.driver?.fullName || "Commuter"}</strong>
                        {ride.driver?.rating > 0 && (
                          <div style={{ fontSize: "11px", color: "#ffb400" }}>
                            ★ {ride.driver.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: "bold", color: "var(--primary-color)" }}>
                        {ride.source} → {ride.destination}
                      </div>
                    </td>
                    <td>
                      <div>{new Date(ride.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        Departs: {ride.departureTime}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: "12px", textTransform: "uppercase" }}>
                        {ride.vehicleType}
                      </span>
                    </td>
                    <td>
                      <strong style={{ color: "var(--success-color)" }}>
                        ₹{ride.price}
                      </strong>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <strong>{ride.availableSeats}</strong>
                    </td>
                    <td>{getStatusBadge(ride.status)}</td>
                    <td>
                      <Link to={`/ride/${ride._id}`} className="btn btn-secondary btn-small">
                        View Info
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
  );
};

export default FindRide;
