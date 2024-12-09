import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { getAuth } from "firebase/auth";

const Reports = () => {
  const [meals, setMeals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  const fetchMeals = async (start, end) => {
    try {
      setLoading(true);
      const currentUser = getAuth().currentUser;

      if (!currentUser) {
        setError("No user logged in");
        setLoading(false);
        return;
      }

      const startDate = format(start, "yyyy-MM-dd");
      const endDate = format(end, "yyyy-MM-dd");

      const response = await axios.get(`http://localhost:8000/api/meals/`, {
        params: {
          start_date: startDate,
          end_date: endDate,
          firebase_uid: currentUser.uid,
        },
      });

      const groupedMeals = response.data.meals.reduce((acc, meal) => {
        const date = meal.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(meal);
        return acc;
      }, {});

      setMeals(groupedMeals);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch meal data");
      setLoading(false);
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    fetchMeals(start, end);
  }, []);

  const handleDatesSet = (dateInfo) => {
    const currentDate = format(dateInfo.start, "yyyy-MM-dd");
    setSelectedDate(currentDate);
  };

  const renderDailyMeals = () => {
    const dayMeals = meals[selectedDate] || [];

    if (dayMeals.length === 0) {
      return (
        <div className="meal-details-card">
          <h2 className="meal-detail-title">No meals recorded for this date</h2>
        </div>
      );
    }

    const displayDate = new Date(`${selectedDate}T00:00:00`);

    const groupedMeals = dayMeals.reduce((acc, meal) => {
      if (!acc[meal.meal_type]) {
        acc[meal.meal_type] = [];
      }
      acc[meal.meal_type].push(meal);
      return acc;
    }, {});

    const mealOrder = ["breakfast", "lunch", "dinner"];

    const sortedMealGroups = Object.entries(groupedMeals).sort(
      ([a], [b]) => mealOrder.indexOf(a) - mealOrder.indexOf(b)
    );

    const dailyTotals = dayMeals.reduce(
      (totals, meal) => {
        meal.items.forEach((item) => {
          totals.calories += item.calories || 0;
          totals.protein += item.protein || 0;
          totals.carbs += item.carbs || 0;
          totals.fat += item.fat || 0;
        });
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return (
      <div className="meal-details-card">
        <h2 className="meal-detail-title">{format(displayDate, "EEEE, MMMM d, yyyy")}</h2>
        {sortedMealGroups.map(([mealType, meals]) => {
          const categoryTotals = meals.reduce(
            (totals, meal) => {
              meal.items.forEach((item) => {
                totals.calories += item.calories || 0;
                totals.protein += item.protein || 0;
                totals.carbs += item.carbs || 0;
                totals.fat += item.fat || 0;
              });
              return totals;
            },
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );

          return (
            <div key={mealType} className="meal-section mb-4">
              <h3 className="meal-type">{capitalize(mealType)}</h3>
              <div className="meal-items">
                {meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="meal-item mb-2">
                    {meal.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="meal-detail">
                        <span className="font-medium">{item.food_name + ": "}</span>
                        <span className="text-gray-600 ml-4">
                          {item.calories?.toFixed(0) || 0} cal,{" "}
                          {item.protein?.toFixed(1) || 0}g protein,{" "}
                          {item.carbs?.toFixed(1) || 0}g carbs,{" "}
                          {item.fat?.toFixed(1) || 0}g fat
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
                <div className="meal-total mt-2 pt-2 border-t">
                  <span className="font-medium">Total for {capitalize(mealType)}: </span>
                  <span className="text-gray-600">
                    {categoryTotals.calories.toFixed(0)} calories,{" "}
                    {categoryTotals.protein.toFixed(1)}g protein,{" "}
                    {categoryTotals.carbs.toFixed(1)}g carbs,{" "}
                    {categoryTotals.fat.toFixed(1)}g fat
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="daily-total">
          <h2 className="daily-total-title">Daily Totals</h2>
          <div className="text-gray-600">
            {dailyTotals.calories.toFixed(0)} calories,{" "}
            {dailyTotals.protein.toFixed(1)}g protein,{" "}
            {dailyTotals.carbs.toFixed(1)}g carbs,{" "}
            {dailyTotals.fat.toFixed(1)}g fat
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="reports-container">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridWeek"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridWeek,dayGridDay",
          }}
          eventBackgroundColor="#2a3663"
          events={Object.entries(meals).map(([date, dayMeals]) => {
            const totals = dayMeals.reduce(
              (acc, meal) => {
                meal.items.forEach((item) => {
                  acc.calories += item.calories || 0;
                  acc.protein += item.protein || 0;
                  acc.carbs += item.carbs || 0;
                  acc.fat += item.fat || 0;
                });
                return acc;
              },
              { calories: 0, protein: 0, carbs: 0, fat: 0 }
            );

            return {
              title: `Calories: ${totals.calories.toFixed(0)} cal\nProtein: ${totals.protein.toFixed(1)}g\nCarbs: ${totals.carbs.toFixed(1)}g\nFat: ${totals.fat.toFixed(1)}g`,
              date,
              allDay: true,
            };
          })}
          eventContent={(eventInfo) => (
            <div className="custom-event">
              {eventInfo.event.title.split("\n").map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
          datesSet={handleDatesSet}
          dateClick={(info) => setSelectedDate(info.dateStr)}
          eventClick={(info) => setSelectedDate(info.event.startStr)}
          height="auto"
        />
      </div>
      <div className="meal-details">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          renderDailyMeals()
        )}
      </div>
    </div>
  );
};

export default Reports;