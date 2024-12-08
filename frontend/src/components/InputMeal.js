import React, { useState } from 'react';
import './InputMeal.css';

function InputMeal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Breakfast');
  const [mealName, setMealName] = useState('');
  const [totalcals, setTotalCals] = useState('');
  const [totalprotein, setTotalProtein] = useState('');
  const [totalcarbs, setTotalCarbs] = useState('');
  const [totalsugar, setTotalSugar] = useState('');
  const [totalfat, setTotalFat] = useState('');

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value); // Updates the state with user input
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
            onChange={(e) => setMealName(e.target.value)}
          />
        </div>
      </div>
      <div className="nutrition">
        <div className="cal">
          <input
            type="num"
            placeholder="Enter amount"
            value={totalcals}
            onChange={handleInputChange(setTotalCals)}
          />
          <p>total Calories</p>
        </div>
        <div className="pro">
          <input
            type="num"
            placeholder="Enter amount"
            value={totalprotein}
            onChange={handleInputChange(setTotalProtein)}
          />
          <p>g, protein</p>
        </div>
        <div className="carb">
          <input
            type="num"
            placeholder="Enter amount"
            value={totalcarbs}
            onChange={handleInputChange(setTotalCarbs)}
          />
          <p>total g, carbs</p>
        </div>
        <div className="sugar">
          <input
            type="num"
            placeholder="Enter amount"
            value={totalsugar}
            onChange={handleInputChange(setTotalSugar)}
          />
          <p>total g, sugars</p>
        </div>
        <div className="fat">
          <input
            type="num"
            placeholder="Enter amount"
            value={totalfat}
            onChange={handleInputChange(setTotalFat)}
          />
          <p>total g, fat</p>
        </div>
      </div>
      <div className="addmeals">
        <a href="/">Add</a>
      </div>
    </div>
  );
}

export default InputMeal;