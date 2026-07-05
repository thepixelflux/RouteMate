import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    ridesCount: 0,
    communitiesCount: 0,
    usersCount: 0,
  });

  // Fetch stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ridesRes, commsRes, usersRes] = await Promise.all([
          api.get("/rides"),
          api.get("/communities"),
          api.get("/users"),
        ]);
        setStats({
          ridesCount: ridesRes.data.length,
          communitiesCount: commsRes.data.length,
          usersCount: usersRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (search.source) queryParams.append("source", search.source);
    if (search.destination) queryParams.append("destination", search.destination);
    if (search.date) queryParams.append("date", search.date);
    
    navigate(`/findride?${queryParams.toString()}`);
  };

  return (
    <div>
      {loading && (
        <div className="alert alert-info" style={{ textAlign: "center", marginBottom: "15px" }}>
          Connecting with Transit Database... If this is the first visit, it may take 30-50 seconds to boot up on free cloud hosting. Thank you for your patience!
        </div>
      )}
      {/* Banner */}
      <div className="hero-banner">
        <h2>why RouteMate</h2>
        <p>
          Save travel expenses, build connections, and make your daily commute safer and more efficient. Connect with fellow students and workers sharing the same transit routes.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <h3>{stats.ridesCount}</h3>
          <p>Active Rides Offered</p>
        </div>
        <div className="stat-item">
          <h3>{stats.communitiesCount}</h3>
          <p>Commuter Networks</p>
        </div>
        <div className="stat-item">
          <h3>{stats.usersCount}</h3>
          <p>Registered Commuters</p>
        </div>
      </div>

      {/* Main Search Panel & Quick Guide */}
      <div className="grid-2">
        {/* Journey Planner Widget */}
        <div className="dmrc-panel">
          <div className="dmrc-panel-title">
            <span>Plan Your Journey / Search Ride</span>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="source">Source Metro Station</label>
              <input
                type="text"
                id="source"
                name="source"
                className="form-control"
                placeholder="e.g. Noida Sector 62"
                value={search.source}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="destination">Destination Metro Station</label>
              <input
                type="text"
                id="destination"
                name="destination"
                className="form-control"
                placeholder="e.g. Rajiv Chowk"
                value={search.destination}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Travel Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={search.date}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-block" style={{ marginTop: "10px" }}>
              Search Available Rides
            </button>
          </form>
        </div>

        {/* Info panel */}
        <div className="dmrc-panel">
          <div className="dmrc-panel-title">
            <span>How RouteMate Works</span>
          </div>
          <div style={{ lineHeight: "1.8" }}>
            <p style={{ marginBottom: "10px" }}>
              <strong>1. Find or Host a Ride:</strong> Enter your source and destination metro stations to find others taking the same path, or offer your own ride (cab pooling, auto sharing, or two-wheeler co-riding).
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>2. Join Commuter Communities:</strong> Join college or workplace-specific circles to pool with verified individuals.
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>3. Real-time Message Coordination:</strong> Coordinate details securely with integrated group chat features once you join a ride.
            </p>
            {!user ? (
              <div style={{ marginTop: "20px" }}>
                <Link to="/register" className="btn btn-primary" style={{ marginRight: "10px" }}>
                  Join Network
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Login Account
                </Link>
              </div>
            ) : (
              <div style={{ marginTop: "20px" }}>
                <Link to="/createride" className="btn btn-primary" style={{ marginRight: "10px" }}>
                  Offer a Ride
                </Link>
                <Link to="/community" className="btn btn-outline">
                  View Communities
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
