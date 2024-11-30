// import React from 'react';
// import './InputMeal.css';

// function InputMeal() {
//   return (
//     <div className="input-meal">
//       <h2>Input Meal</h2>
//       <p>Quickly log your meals to keep track of calories and nutrients throughout the day</p>
//       <select>
//         <option value="breakfast">Breakfast</option>
//         <option value="lunch">Lunch</option>
//         <option value="dinner">Dinner</option>
//       </select>
//       <input type="text" placeholder="Enter Meal" />
//       <div className="links">
//         <a href="/">Add more info</a>
//         <a href="/">Quick input</a>
//       </div>
//     </div>
//   );
// }

// export default InputMeal;

import React, { useState } from 'react';
import './InputMeal.css';

function InputMeal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Breakfast');
  const [mealName, setMealName] = useState('');

  const handleSelectClick = () => setIsOpen(!isOpen);
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  const handleInputChange = (event) => setMealName(event.target.value);

  return (
    <div className="input-meal">
      <div className="intro">
        <h1>Log Meal</h1>
        <p>Can't find the dish? Add it yourself!</p>
      </div>
      <div className="input-container">
        <div className="dropdown">
          <div
            className={`select ${isOpen ? 'select-clicked' : ''}`}
            onClick={handleSelectClick}
          >
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
        <button>Add</button>
      </div>
    </div>
  );
}

export default InputMeal;
