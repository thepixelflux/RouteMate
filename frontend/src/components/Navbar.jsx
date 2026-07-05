import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="dmrc-header-wrapper">
      {/* Top Branding Bar */}
      <div className="dmrc-top-header">
        <div className="dmrc-header-content">
          <Link to="/" className="dmrc-logo-section">
            <div className="dmrc-logo-icon">RM</div>
            <div className="dmrc-logo-text">
              <h1>RouteMate</h1>
              <span>Your Metro Commute Companion</span>
            </div>
          </Link>
          <div className="dmrc-top-right">
            {user ? (
              <>
                <div className="user-badge">
                  PASSENGER: {user.fullName.toUpperCase()} ({user.college})
                </div>
                {user.rating > 0 && (
                  <span className="star-rating">
                    ★ {user.rating.toFixed(1)}
                  </span>
                )}
              </>
            ) : (
              <span>Welcome to RouteMate </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Strip */}
      <nav className="dmrc-nav-bar">
        <div className="dmrc-nav-content">
          <ul className="dmrc-nav-links">
            <li>
              <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/findride" className={({ isActive }) => isActive ? "active" : ""}>
                Find a Ride
              </NavLink>
            </li>
            {user && (
              <>
                <li>
                  <NavLink to="/createride" className={({ isActive }) => isActive ? "active" : ""}>
                    Offer a Ride
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/community" className={({ isActive }) => isActive ? "active" : ""}>
                    Communities
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                    My Profile
                  </NavLink>
                </li>
              </>
            )}
            {!user && (
              <>
                <li>
                  <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          {user && (
            <button onClick={handleLogout} className="dmrc-logout-btn">
              LOGOUT
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
