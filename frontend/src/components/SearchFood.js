import React from 'react';
import './SearchFood.css';

function SearchFood() {
  return (
    <div className="search-food">
      <h2>Search Food</h2>
      <p>Search nutritional information for specific foods and products</p>
      <input type="text" placeholder="Search" />
    </div>
  );
}

export default SearchFood;