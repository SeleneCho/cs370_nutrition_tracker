import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";

const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <div className="navigation-bar">
      <button className="nav-button" onClick={() => navigate("/")}>
        Home
      </button>
      <button className="nav-button" onClick={() => navigate("/auth")}>
        login
      </button>
      <button className="nav-button" onClick={() => navigate("/reports")}>
        Reports
      </button>
    </div>
  );
};

export default NavigationBar;
