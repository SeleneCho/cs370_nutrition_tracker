import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import "./SearchFood.css"; // Ensure the CSS is imported

const SearchFood = () => {
  const [query, setQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search/?query=${query}`
        );
        setFoodItems(response.data.foods);
        setIsModalOpen(true); // Open modal when results are found
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleMealSelect = (meal, item) => {
    setSelectedMeal({ meal, item });
  };

  return (
    <div className="search-food">
      <h2>Search Food</h2>
      <p>Search nutritional information for specific foods and products</p>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for food..."
          required
        />
        <button type="submit">Search</button>
      </form>

      {/* Modal to display food items */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Close Button */}
            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h3>Food Results</h3>
            <ul>
              {foodItems.map((item, index) => (
                <li key={index}>
                  <div
                    onClick={() => toggleExpand(index)}
                    style={{ cursor: "pointer" }}
                  >
                    <span>
                      {item.description} - {item.brandName}
                    </span>
                    {expandedIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {expandedIndex === index && (
                    <div>
                      <p>
                        <strong>Ingredients:</strong> {item.ingredients.join(", ")}
                      </p>
                      <p>
                        <strong>Data Type:</strong> {item.dataType}
                      </p>
                      <p>
                        <strong>Food Category:</strong> {item.foodCategory}
                      </p>
                      <p>
                        <strong>Package Weight:</strong> {item.packageWeight}
                      </p>
                      <p>
                        <strong>Serving Size:</strong> {item.servingSize}{" "}
                        {item.servingSizeUnit}
                      </p>
                      <p>
                        <strong>Nutrients:</strong>
                      </p>
                      <ul>
                        {item.nutrients.map((nutrient, idx) => (
                          <li key={idx}>
                            {nutrient.nutrientName}: {nutrient.value}{" "}
                            {nutrient.unitName}
                          </li>
                        ))}
                      </ul>
                      {/* Meal Selection Dropdown */}
                      <select
                        onChange={(e) => handleMealSelect(e.target.value, item)}
                      >
                        <option value="">Select Meal Time</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                      </select>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFood;
