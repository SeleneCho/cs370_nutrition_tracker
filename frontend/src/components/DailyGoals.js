import React from 'react';
import './DailyGoals.css';

function DailyGoals() {
  return (
    <div className="daily-goals">
      <h2>Daily Goals</h2>
      <div className="goal">
        <p>Calories</p>
        <div className="progress-bar"><div style={{width: '60%'}} className="progress"></div></div>
      </div>
      <div className="goal">
        <p>Protein</p>
        <div className="progress-bar"><div style={{width: '80%'}} className="progress"></div></div>
      </div>
      <div className="goal">
        <p>Sugar</p>
        <div className="progress-bar"><div style={{width: '40%'}} className="progress"></div></div>
      </div>
      <div className="goal">
        <p>Carbs</p>
        <div className="progress-bar"><div style={{width: '70%'}} className="progress"></div></div>
      </div>
    </div>
  );
}

export default DailyGoals;