import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";

const Reports = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch food item data on component load
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/meals"); // Use /api/meals to fetch FoodItem data
        setFoodItems(response.data.food_items); // Update the state with fetched data
      } catch (err) {
        setError("Failed to fetch food items. Please try again later.");
        console.error(err);
      }
    };

    fetchFoodItems();
  }, []);

  // Render the food items list
  const renderFoodItems = () => {
    if (!foodItems || foodItems.length === 0) {
      return <p>No food items found.</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Calories</th>
            <th>Protein (g)</th>
            <th>Carbs (g)</th>
            <th>Fat (g)</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.brand_name || "N/A"}</td>
              <td>{item.calories}</td>
              <td>{item.protein}</td>
              <td>{item.carbs}</td>
              <td>{item.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="get-reports">
      <h1>Food Items List</h1>
      {error ? <p className="error">{error}</p> : renderFoodItems()}
    </div>
  );
};

export default Reports;
