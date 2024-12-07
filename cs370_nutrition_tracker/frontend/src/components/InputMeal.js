import React, { useState } from 'react';
import './InputMeal.css';

function InputMeal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Breakfast');
  const [mealName, setMealName] = useState(''); // State for user input

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
          <div className={`select ${isOpen ? 'select-clicked' : ''}`} onClick={handleSelectClick}>
            <span className="selected">{selectedOption}</span>
            <div className={`caret ${isOpen ? 'caret-rotate' : ''}`}></div>
          </div>
          <ul className={`menu ${isOpen ? 'menu-open' : ''}`}>
            {['Breakfast', 'Lunch', 'Dinner'].map((option) => (
              <li
                key={option}
                className={selectedOption === option ? 'active' : ''}
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
        <a href="/">Add</a>
      </div>
    </div>
  );
}

export default InputMeal;