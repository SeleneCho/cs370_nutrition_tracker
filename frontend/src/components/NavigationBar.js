// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./NavigationBar.css";

// const NavigationBar = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="navigation-bar">
//       <button className="nav-button" onClick={() => navigate("/")}>
//         Home
//       </button>
//       <button className="nav-button" onClick={() => navigate("/auth")}>
//         login
//       </button>
//       <button className="nav-button" onClick={() => navigate("/reports")}>
//         Reports
//       </button>
//     </div>
//   );
// };

// export default NavigationBar;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationBar.css";
// Make sure Font Awesome is included in your project
// <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  return (
    <aside className="navigation-bar">
      <h3>Menu</h3>

      <nav className="sidebar">
        <div
          className={`menu-item ${activeItem === "/" ? "is-active" : ""}`}
          onClick={() => {
            navigate("/");
            setActiveItem("/");
          }}
        >
          <i className="fas fa-home"></i> Home {/* Icon for Home */}
        </div>
        <div
          className={`menu-item ${
            activeItem === "/reports" ? "is-active" : ""
          }`}
          onClick={() => {
            navigate("/reports");
            setActiveItem("/reports");
          }}
        >
          <i className="fas fa-chart-line"></i> Weekly Reports{" "}
          {/* Icon for Reports */}
        </div>
        <div
          className={`menu-item ${activeItem === "/auth" ? "is-active" : ""}`}
          onClick={() => {
            navigate("/auth");
            setActiveItem("/auth");
          }}
        >
          <i className="fas fa-sign-in-alt"></i> Login {/* Icon for Login */}
        </div>
      </nav>
    </aside>
  );
}

export default NavigationBar;
