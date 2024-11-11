import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import "./App.css";
import InputMeal from "./components/InputMeal";
import SearchFood from "./components/SearchFood";
import DailyGoals from "./components/DailyGoals";
import WeeklyReports from "./components/WeeklyReports";
import Suggestions from "./components/Suggestions";
import NavigationBar from "./components/NavigationBar";
import AuthPage from "./components/AuthPage";
import Reports from "./components/Reports";

function App() {
  const location = useLocation(); // Get the current location

  return (
    <div className={location.pathname === "/auth" ? "" : "dashboard"}>
      {/* Only apply 'dashboard' class on default path '/' */}
      <NavigationBar />

      <Routes>
        {/* Home or Dashboard route */}
        <Route
          path="/"
          element={
            <div className="top-section">
              <InputMeal />
              <SearchFood />
            </div>
            // This will show only on the '/' route
          }
        />

        {/* Auth page route */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>

      {/* Bottom section, only show on home route */}
      {location.pathname === "/" && (
        <div className="bottom-section">
          <DailyGoals />
          <WeeklyReports />
          <Suggestions />
        </div>
      )}
    </div>
  );
}

export default App;
