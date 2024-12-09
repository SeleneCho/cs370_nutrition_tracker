import React, { useState } from "react";
import "./InputMeal.css";
import axios from 'axios';
import { getAuth } from "firebase/auth";

function InputMeal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Breakfast");
  const [mealName, setMealName] = useState(""); // State for user input
  const [totalcals, setTotalCals] = useState('');
  const [totalprotein, setTotalProtein] = useState('');
  const [totalcarbs, setTotalCarbs] = useState('');
  const [totalfat, setTotalFat] = useState('');

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value); // Update the specific state with the input's value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mealName.trim()) {
      alert("Please enter a meal name");
      return;
    }

    const currentUser = getAuth().currentUser;
  
    const foodData = {
      firebase_uid: currentUser.uid,
      meal_type: selectedOption.toLowerCase(),
      date: new Date().toISOString().split("T")[0],
      food_items: [{
        food_name: mealName,
        quantity: 1,
        calories: totalcals,
        protein: totalprotein,
        carbs: totalcarbs,
        fat: totalfat
      }]
    };
  
    try {
      await axios.post("http://localhost:8000/api/meals/create/", foodData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      alert("Meal saved successfully!");
      setMealName(""); // Clear the input
      setTotalCals('');
      setTotalProtein('');
      setTotalCarbs('');
      setTotalFat('');
      window.location.reload();
    } catch (error) {
      console.error("Error saving meal:", error);
      console.log("Error response:", error.response?.data);
      alert(error.response?.data?.message || "Failed to save meal.");
    }
  };

  return (
    <div className="input-meal">
      <div className="intro">
        <h1>Log Meal</h1>
        <p>Can't find the dish? Add it yourself!</p>
      </div>
      <div className="input-container">
        <div className="dropdown">
          <div className={`select ${isOpen ? 'select-clicked' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <span className="selected">{selectedOption}</span>
            <div className={`caret ${isOpen ? 'caret-rotate' : ''}`}></div>
          </div>
          <ul className={`menu ${isOpen ? 'menu-open' : ''}`}>
            {['Breakfast', 'Lunch', 'Dinner'].map((option) => (
              <li
                key={option}
                className={selectedOption === option ? 'active' : ''}
                onClick={() => {
                  setSelectedOption(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
        <div className="entermeal">
          <input
            type="text"
            placeholder="Enter Meal Name"
            value={mealName}
            onChange={handleInputChange(setMealName)}
          />
        </div>
      </div>
      <div className="nutrition">
        <div className="cal">
          <input
            type="number"
            placeholder="Enter amount"
            value={totalcals}
            onChange={handleInputChange(setTotalCals)}
          />
          <p>total Calories</p>
        </div>
        <div className="pro">
          <input
            type="number"
            placeholder="Enter amount"
            value={totalprotein}
            onChange={handleInputChange(setTotalProtein)}
          />
          <p>g, protein</p>
        </div>
        <div className="carb">
          <input
            type="number"
            placeholder="Enter amount"
            value={totalcarbs}
            onChange={handleInputChange(setTotalCarbs)}
          />
          <p>total g, carbs</p>
        </div>
        <div className="fat">
          <input
            type="number"
            placeholder="Enter amount"
            value={totalfat}
            onChange={handleInputChange(setTotalFat)}
          />
          <p>total g, fat</p>
        </div>
      </div>
      <div className="addmeals">
        <button onClick={handleSubmit}>Add</button>
      </div>
    </div>
  );
}

export default InputMeal;