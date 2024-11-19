from django.urls import path
from .views import search_food
from .views import search_food, SelectedFoodView


urlpatterns = [
    path('search/', search_food, name='search_food'),  # This defines the endpoint for the search view
    path('selected-food/', SelectedFoodView.as_view(), name='selected_food'),
]
