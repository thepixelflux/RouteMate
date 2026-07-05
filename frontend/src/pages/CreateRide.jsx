import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CreateRide = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    date: "",
    departureTime: "",
    availableSeats: 1,
    price: 0,
    vehicleType: "Car",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "availableSeats" || name === "price" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/rides", formData);
      setSuccess("Co-ride offered and scheduled successfully!");
      setTimeout(() => {
        navigate(`/ride/${res.data._id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create/offer ride.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "30px auto" }}>
      <div className="dmrc-panel">
        <div className="dmrc-panel-title">
          <span>Offer a Co-ride / Host Schedule</span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="source">Source Metro Station</label>
            <input
              type="text"
              id="source"
              name="source"
              className="form-control"
              placeholder="e.g. Dilshad Garden"
              value={formData.source}
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
              placeholder="e.g. Noida Sector 15"
              value={formData.destination}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Travel Date</label>
              <input
                type="date"
                id="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="departureTime">Departure Time</label>
              <input
                type="text"
                id="departureTime"
                name="departureTime"
                className="form-control"
                placeholder="e.g. 08:30 AM"
                value={formData.departureTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="availableSeats">Available Seats</label>
              <input
                type="number"
                id="availableSeats"
                name="availableSeats"
                className="form-control"
                min="1"
                value={formData.availableSeats}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Fare Split Cost (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                min="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="vehicleType">Vehicle Type</label>
              <select
                id="vehicleType"
                name="vehicleType"
                className="form-control"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Auto">Auto</option>
                <option value="Cab">Cab</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary btn-block"
            style={{ marginTop: "15px" }}
            disabled={loading}
          >
            {loading ? "Registering Schedule..." : "Offer Co-Ride"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRide;
