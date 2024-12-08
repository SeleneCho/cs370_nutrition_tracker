import React, { useState } from "react";
import "./InputMeal.css";
import axios from 'axios';

function InputMeal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Breakfast");
  const [mealName, setMealName] = useState(""); // State for user input
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealName.trim()) {
      alert("Please enter a meal name");
      return;
    }
  
    const foodData = {
      meal_type: selectedOption.toLowerCase(),
      date: new Date().toISOString().split("T")[0],
      food_items: [{  // Wrap in food_items array
        food_name: mealName,
        quantity: 1,
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }]
    };
  
    try {
      await axios.post("http://localhost:8000/api/meals/create/", foodData,{
          headers: {
            'Content-Type': 'application/json',
          }
      });
      alert("Meal saved successfully!");
      setMealName(""); // Clear the input
    } catch (error) {
      console.error("Error saving meal:", error);
      console.log("Error response:", error.response?.data);
      alert(error.response?.data?.message || "Failed to save meal.");
    }
  };

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    setMealName(event.target.value); // Updates the state with user input
  };

  return (
    <div className="input-meal">
      <div className="intro">
        <h1>Log Meal</h1>
        <p>Can't find the dish? Add it yourself!</p>
      </div>
      <div className="input-container">
        <div className="dropdown">
          <div
            className={`select ${isOpen ? "select-clicked" : ""}`}
            onClick={handleSelectClick}
          >
            <span className="selected">{selectedOption}</span>
            <div className={`caret ${isOpen ? "caret-rotate" : ""}`}></div>
          </div>
          <ul className={`menu ${isOpen ? "menu-open" : ""}`}>
            {["Breakfast", "Lunch", "Dinner"].map((option) => (
              <li
                key={option}
                className={selectedOption === option ? "active" : ""}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
        <div className="entermeal">
          <input
            type="text"
            placeholder="Enter Meal"
            value={mealName}
            onChange={handleInputChange}
          />
        </div>
      </div>
      <div className="addmeals">
        <button onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
}

export default InputMeal;