import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import InputMeal from "./components/InputMeal";
import SearchFood from "./components/SearchFood";
import NavigationBar from "./components/NavigationBar";
import AuthPage from "./components/AuthPage";
import Reports from "./components/Reports";

function App() {
  const location = useLocation(); // Get the current location

  useEffect(() => {
    // Run the animation only if we're on the home page
    if (location.pathname === "/") {
      const valueDisplays = document.querySelectorAll(".num");
      const interval = 2000;

      valueDisplays.forEach((valueDisplay) => {
        let startValue = 0;
        const endValue = parseInt(valueDisplay.getAttribute("data-val"));
        const duration = Math.floor(interval / endValue);

        const counter = setInterval(() => {
          startValue += 5;
          valueDisplay.textContent = startValue;
          if (startValue === endValue) {
            clearInterval(counter);
          }
        }, duration);
      });
    }
  }, [location.pathname]); // Re-run animation when the path changes

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
                      <span class="num" data-val="700">000</span>
                      <p>Cal</p>
                    </div>
                    <div className="protein">
                      <span class="num" data-val="40">000</span>
                      <p>g, protein</p>
                    </div>
                    <div className="carbs">
                      <span class="num" data-val="230">000</span>
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