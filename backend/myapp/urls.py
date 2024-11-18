from django.urls import path
from .views import search_food, create_meal, get_meals  # Add the new views

urlpatterns = [
    path('search/', search_food, name='search_food'),  # Your existing search endpoint
    path('meals/', get_meals, name='get_meals'),       # New endpoint to get meals
    path('meals/create/', create_meal, name='create_meal'),  # New endpoint to create meals
]