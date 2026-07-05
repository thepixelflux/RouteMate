import React from "react";

const Footer = () => {
  return (
    <footer className="dmrc-footer">
      <div className="dmrc-footer-content">
        <div className="dmrc-footer-section">
          <h4>About RouteMate</h4>
          <p>
            RouteMate is a ride-sharing network designed to help college students and daily commuters easily co-ride, reduce expenses and meet peers.
          </p>
        </div>

        <div className="dmrc-footer-section">
          <h4>Support & Help</h4>
          <ul>
            <li>Women Helpline: 1091</li>
          </ul>
        </div>
      </div>
      <div className="dmrc-footer-bottom">
        <p>&copy; {new Date().getFullYear()} RouteMate. All rights reserved.</p>
        <p style={{ fontSize: "15px", marginTop: "5px" }}>made by Prisha Maurya</p>
      </div>
    </footer>
  );
};

export default Footer;
