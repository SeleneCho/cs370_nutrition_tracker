import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import InputMeal from "./components/InputMeal";
import SearchFood from "./components/SearchFood";
import NavigationBar from "./components/NavigationBar";
import AuthPage from "./components/AuthPage";
import Reports from "./components/Reports";

function App() {
  const location = useLocation(); // Get the current location

  return (
    <div className="app-container">
      <NavigationBar /> {/* NavigationBar will stay on the left */}

      <div className={location.pathname === "/auth" ? "main-content" : "dashboard main-content"}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="top-section">
                  <div className="welcome">
                    <h1>Welcome to Your Nutrition Tracker.</h1>
                    <h1>Here are today's reports</h1>
                  </div>
                  <div className="daily">
                    <div className="calories">
                      <h1>1000</h1>
                      <p>Cal</p>
                    </div>
                    <div className="protein">
                      <h1>40</h1>
                      <p>g, protein</p>
                    </div>
                    <div className="carbs">
                      <h1>100</h1>
                      <p>g, carbs</p>
                    </div>
                  </div>
                </div>
                <div className="bottom-section">
                  <InputMeal />
                  <SearchFood />
                </div>
              </>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;