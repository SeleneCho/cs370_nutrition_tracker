import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationBar.css";

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
          className={`menu-item ${activeItem === "/home" ? "is-active" : ""}`}
          onClick={() => {
            navigate("/home");
            setActiveItem("/home");
          }}
        >
          <i className="fas fa-home"></i> Home {/* Icon for Home */}
        </div>
        <div
          className={`menu-item ${activeItem === "/reports" ? "is-active" : ""}`}
          onClick={() => {
            navigate("/reports");
            setActiveItem("/reports");
          }}
        >
          <i className="fas fa-chart-line"></i> Weekly Reports {/* Icon for Reports */}
        </div>
      </nav>
    </aside>
  );
}

export default NavigationBar;
