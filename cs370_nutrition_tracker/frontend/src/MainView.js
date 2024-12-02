import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const MainView = () => {
  const [query, setQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search/?query=${query}`
        );
        setFoodItems(response.data.foods);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
      <h1>Nutrition Tracker</h1>
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
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainView;
