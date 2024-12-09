import React, { useEffect } from "react";
import { Routes, Route, useLocation, useRoutes } from "react-router-dom";
import DailyGoals from "./components/DailyGoals";
import InputMeal from "./components/InputMeal";
import SearchFood from "./components/SearchFood";
import Reports from "./components/Reports";
import Suggestions from "./components/Suggestions";
import NavigationBar from "./components/NavigationBar";
import Header from "./components/header";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { AuthProvider } from "./contexts/authContext";
import "./App.css";

function App() {
  const location = useLocation();

  // Run the animation for the numbers on the /home page
  useEffect(() => {
    if (location.pathname === "/home") {
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
  }, [location.pathname]);

  const routesArray = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
      path: "/home",
      element: (
        <div className="dashboard">
          <NavigationBar />
          <div className="main-content">
            <Header />
            <div className="top-section">
              <div className="welcome">
                <h1>Welcome to Your Nutrition Tracker.</h1>
                <h1>Here are today's reports</h1>
              </div>
              <div className="daily">
                <div className="calories">
                  <span className="num" data-val="700">
                    000
                  </span>
                  <p>Cal</p>
                </div>
                <div className="protein">
                  <span className="num" data-val="40">
                    000
                  </span>
                  <p>g, protein</p>
                </div>
                <div className="carbs">
                  <span className="num" data-val="230">
                    000
                  </span>
                  <p>g, carbs</p>
                </div>
              </div>
            </div>
            <div className="grid-container">
              <DailyGoals />
              <Suggestions />
            </div>
            <div className="flex-container">
              <InputMeal />
              <SearchFood />
            </div>
          </div>
        </div>
      ),
    },
    {
      path: "/reports",
      element: (
        <div className="dashboard">
          <NavigationBar />
          <div className="main-content">
            <Header />
            <Reports />
          </div>
        </div>
      ),
    },
    { path: "*", element: <Login /> },
  ];

  let routesElement = useRoutes(routesArray);

  return <AuthProvider>{routesElement}</AuthProvider>;
}

export default App;
