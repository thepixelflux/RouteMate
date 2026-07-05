import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    college: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await register(
      formData.fullName,
      formData.email,
      formData.password,
      formData.phone,
      formData.college
    );

    if (res.success) {
      navigate("/");
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto" }}>
      <div className="dmrc-panel">
        <div className="dmrc-panel-title">
          <span>Transit Registration Portal</span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-control"
              placeholder="e.g. Prisha"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="e.g. prisha@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={formData.password}
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
              placeholder="e.g. +91 xxxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="college">College / Institution</label>
            <input
              type="text"
              id="college"
              name="college"
              className="form-control"
              placeholder="e.g. IIT Delhi"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-secondary btn-block"
            style={{ marginTop: "15px" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register Commuter"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "13px" }}>
          <span>Already registered? </span>
          <Link to="/login" style={{ color: "var(--primary-color)", fontWeight: "bold" }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
