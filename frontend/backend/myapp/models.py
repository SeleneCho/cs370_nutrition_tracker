from django.db import models
from django.contrib.auth.models import User

class FoodItem(models.Model):
    name = models.CharField(max_length=200)
    calories = models.IntegerField()
    protein = models.FloatField()
    carbs = models.FloatField()
    fat = models.FloatField()
    fdc_id = models.CharField(max_length=50, unique=True)  # USDA FoodData Central ID

    def __str__(self):
        return self.name

class Meal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=[
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack')
    ])

    def __str__(self):
        return f"{self.user.username}'s {self.meal_type} on {self.date}"

class MealItem(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.quantity} of {self.food_item.name} in {self.meal}"

# In tracker/admin.py
from django.contrib import admin
from .models import FoodItem, Meal, MealItem

admin.site.register(FoodItem)
admin.site.register(Meal)
admin.site.register(MealItem)