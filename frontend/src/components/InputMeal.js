import React from 'react';
import './InputMeal.css';

function InputMeal() {
  return (
    <div className="input-meal">
      <h2>Input Meal</h2>
      <p>Quickly log your meals to keep track of calories and nutrients throughout the day</p>
      <select>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
      </select>
      <input type="text" placeholder="Enter Meal" />
      <div className="links">
        <a href="/">Add more info</a>
        <a href="/">Quick input</a>
      </div>
    </div>
  );
}

export default InputMeal;