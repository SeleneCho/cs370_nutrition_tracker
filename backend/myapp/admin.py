

# Register your models here.
from django.contrib import admin
from .models import FoodItem, Meal, MealItem

admin.site.register(FoodItem)
admin.site.register(Meal)
admin.site.register(MealItem)