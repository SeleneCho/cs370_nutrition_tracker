import React from 'react';
import './App.css';
import InputMeal from './components/InputMeal';
import SearchFood from './components/SearchFood';
import DailyGoals from './components/DailyGoals';
import WeeklyReports from './components/WeeklyReports';
import Suggestions from './components/Suggestions';

function App() {
  return (
    <div className="dashboard">
      <div className="top-section">
        <InputMeal />
        <SearchFood />
      </div>
      <div className="bottom-section">
        <DailyGoals />
        <WeeklyReports />
        <Suggestions />
      </div>
    </div>
  );
}

export default App;