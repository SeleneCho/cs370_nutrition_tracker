import React, { useState } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp, FaTimes } from "react-icons/fa";
import "./SearchFood.css";
import { getAuth } from "firebase/auth";

const SearchFood = () => {
  const [query, setQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = getAuth().currentUser;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/search/?query=${query}`
        );
        setFoodItems(response.data.foods);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
  };

  const handleSaveFood = async (item) => {
    // Ensure the meal is selected before saving
    if (!selectedMeal) {
      alert("Please select a meal time before saving.");
      return;
    }
  
    // Extract nutrient values for fat, carbs, and protein
    const fat = item.nutrients.find((n) => n.nutrientName.includes("Fat"))?.value || 0;
    const carbs = item.nutrients.find((n) => n.nutrientName.includes("Carbohydrate"))?.value || 0;
    const protein = item.nutrients.find((n) => n.nutrientName.includes("Protein"))?.value || 0;
    const calories = item.nutrients.find((n) => n.unitName.includes("KCAL"))?.value || 0;
  
    const foodData = {
      firebase_uid: currentUser.uid,
      meal_type: selectedMeal,
      date: new Date().toISOString().split("T")[0], // format date as yyyy-mm-dd
      food_items: [
        {
          food_name: item.description,
          quantity: 1,
          calories: +calories.toFixed(0), // Send as a number
          protein: +protein.toFixed(2), // Convert to number
          carbs: +carbs.toFixed(2), // Convert to number
          fat: +fat.toFixed(2), // Convert to number
        },
      ],
    };
  
    try {
      await axios.post("http://localhost:8000/api/meals/create/", foodData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("Food saved successfully!");
      setIsModalOpen(false); // Close modal after successful save
      window.location.reload();
    } catch (error) {
      console.error("Error saving food:", error);
      console.log("Error response:", error.response?.data);
      alert(error.response?.data?.error || "Failed to save food. Please try again.");
    }
  };

  return (
    <div className="search-food">
      <div className="intro">
        <h2>Search Food</h2>
        <p>Search nutritional information for specific foods and products</p>
      </div>
      <div className="searchinput">
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
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>
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
                    {expandedIndex === index ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </div>
                  {expandedIndex === index && (
                    <div className="expanded-details">
                      <p>
                        <strong>Ingredients:</strong>{" "}
                        {item.ingredients.join(", ")}
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
                        onChange={(e) => handleMealSelect(e.target.value)}
                      >
                        <option value="">Select Meal Time</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                      </select>
                      {/* Save Button */}
                      <button
                        className="save-btn"
                        onClick={() => handleSaveFood(item)}
                      >
                        Save Food
                      </button>
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