import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const Community = () => {
  const { user } = useContext(AuthContext);

  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Community Creation Form
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState("");

  const fetchCommunities = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/communities");
      setCommunities(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch communities from network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormSuccess("");
    setFormLoading(true);

    try {
      await api.post("/communities", formData);
      setFormSuccess("Community circle created successfully!");
      setFormData({ name: "", description: "" });
      await fetchCommunities(); // Refresh list
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create community.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleJoin = async (id) => {
    setError("");
    try {
      await api.post(`/communities/${id}/join`);
      await fetchCommunities(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join community.");
    }
  };

  const handleLeave = async (id) => {
    setError("");
    try {
      await api.post(`/communities/${id}/leave`);
      await fetchCommunities(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to leave community.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this community? This will permanently close the network circle.")) {
      return;
    }
    setError("");
    try {
      await api.delete(`/communities/${id}`);
      await fetchCommunities(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete community.");
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="hero-banner" style={{ padding: "30px 20px" }}>
        <h2>Commuter Communities & Circles</h2>
        <p>
          Connect with commuters from your college, university, or corporate hub. Join circles to easily coordinate rides with people from your target locations.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="grid-2">
        {/* Create Community Form */}
        <div className="dmrc-panel">
          <div className="dmrc-panel-title">
            <span>Establish a Commuter Circle</span>
          </div>

          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

          <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
              <label htmlFor="name">Circle Name (e.g. University Name or Corporate Hub)</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                placeholder="e.g. IIT Delhi Commuters"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Circle Description / Guidelines</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                className="form-control"
                placeholder="Describe who this circle is for and general co-riding guidelines."
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-secondary btn-block" disabled={formLoading}>
              {formLoading ? "Registering Circle..." : "Create Circle"}
            </button>
          </form>
        </div>

        {/* Community List Panel */}
        <div className="dmrc-panel">
          <div className="dmrc-panel-title">
            <span>Active Commuter Circles</span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <h4>Loading Circle Registry...</h4>
            </div>
          ) : communities.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
              <h3>No commuter circles registered yet.</h3>
              <p>Be the first to start a circle for your college or office!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {communities.map((comm) => {
                const isMember = comm.members?.some((m) => m._id === user?._id);
                const isCreator = comm.createdBy?._id === user?._id;

                return (
                  <div
                    key={comm._id}
                    style={{
                      border: "1px solid var(--border-color)",
                      padding: "15px",
                      borderRadius: "2px",
                      backgroundColor: "#fff",
                      borderLeft: isMember ? "4px solid var(--success-color)" : "1px solid var(--border-color)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, color: "var(--primary-color)", fontSize: "16px" }}>{comm.name}</h4>
                      <span className="badge badge-available" style={{ padding: "2px 6px" }}>
                        {comm.members?.length || 0} Members
                      </span>
                    </div>

                    <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", whiteSpace: "pre-wrap" }}>
                      {comm.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)" }}>
                      <span>Host: {comm.createdBy?.fullName || "Commuter"}</span>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        {isCreator && (
                          <button
                            onClick={() => handleDelete(comm._id)}
                            className="btn btn-secondary btn-small"
                            style={{ padding: "2px 6px" }}
                          >
                            Delete
                          </button>
                        )}

                        {isMember ? (
                          <button
                            onClick={() => handleLeave(comm._id)}
                            className="btn btn-outline btn-small"
                            style={{ padding: "2px 6px" }}
                          >
                            Leave Circle
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoin(comm._id)}
                            className="btn btn-success btn-small"
                            style={{ padding: "2px 6px" }}
                          >
                            Join Circle
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
