import React, { useEffect, useState } from "react";
import { useLocation, useRoutes, Navigate } from "react-router-dom";
import InputMeal from "./components/InputMeal";
import SearchFood from "./components/SearchFood";
import Reports from "./components/Reports";
import NavigationBar from "./components/NavigationBar";
import Header from "./components/header";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import { AuthProvider } from "./contexts/authContext";
import axios from "axios";
import { getAuth } from "firebase/auth";
import "./App.css";

function App() {
  const location = useLocation();
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
  });

  const fetchTotals = async () => {
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) return;
  
      // Get today's date in 'YYYY-MM-DD' format
      const today = new Date().toISOString().split("T")[0];
  
      // Fetch meals with start_date and end_date
      const response = await axios.get("http://localhost:8000/api/meals/", {
        params: {
          firebase_uid: currentUser.uid,
          start_date: today,
          end_date: today,
        },
      });
  
      const meals = response.data.meals || [];
  
      // Aggregate today's totals
      const aggregatedTotals = meals.reduce(
        (totals, meal) => {
          meal.items.forEach((item) => {
            totals.calories += item.calories || 0;
            totals.protein += item.protein || 0;
            totals.carbs += item.carbs || 0;
          });
          return totals;
        },
        { calories: 0, protein: 0, carbs: 0 }
      );
  
      setTotals(aggregatedTotals);
    } catch (error) {
      console.error("Error fetching totals:", error);
    }
  };
  
  useEffect(() => {
    const applyTotalsAndAnimate = async () => {
      try {
        const user = getAuth().currentUser;
        if (user && location.pathname === "/home") {
          await fetchTotals(); // Ensure totals are fetched first
          applyAnimation(); // Then apply the animation
        }
      } catch (error) {
        console.error("Error applying totals and animation:", error);
      }
    };
  
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user && location.pathname === "/home") {
        applyTotalsAndAnimate();
      }
    });
  
    // Also trigger when navigating to /home
    if (location.pathname === "/home") {
      applyTotalsAndAnimate();
    }
  
    return () => unsubscribe();
  }, [location.pathname]);
  
  // Function to apply the animation
  const applyAnimation = () => {
    const valueDisplays = document.querySelectorAll(".num");
    const interval = 2000;
  
    valueDisplays.forEach((valueDisplay) => {
      let startValue = 0;
      const endValue = parseInt(valueDisplay.textContent) || 0; // Ensure valid number
      if (endValue === 0) return; // Skip if no value to animate
      const duration = Math.floor(interval / endValue);
  
      const counter = setInterval(() => {
        startValue += 5;
        valueDisplay.textContent = startValue;
        if (startValue >= endValue) {
          clearInterval(counter);
          valueDisplay.textContent = endValue; // Stop at endValue
        }
      }, duration);
    });
  };

  const routesArray = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    {
      path: "/home",
      element: (
        <div className="app-container">
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
                  <span className="num">{totals.calories.toFixed(0)}</span>
                  <p>Cal</p>
                </div>
                <div className="protein">
                  <span className="num">{totals.protein.toFixed(0)}</span>
                  <p>g, protein</p>
                </div>
                <div className="carbs">
                  <span className="num">{totals.carbs.toFixed(0)}</span>
                  <p>g, carbs</p>
                </div>
              </div>
            </div>
            <div className="bottom-section">
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
        <div className="app-container">
          <NavigationBar />
          <div className="main-content">
            <Header />
            <Reports />
          </div>
        </div>
      ),
    },
    { path: "/", element: <Navigate replace to="/login" /> }, 
  ];

  let routesElement = useRoutes(routesArray);

  return <AuthProvider>{routesElement}</AuthProvider>;
}

export default App;