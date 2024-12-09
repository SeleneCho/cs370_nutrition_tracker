from django.db import models

# Create your models here.


class FoodItem(models.Model):
    name = models.CharField(max_length=200)
    brand_name = models.CharField(max_length=100, blank=True, null=True)
    calories = models.IntegerField()
    protein = models.FloatField()
    carbs = models.FloatField()
    fat = models.FloatField()
    fdc_id = models.CharField(max_length=50, unique=False)

    def __str__(self):
        return self.name

class Meal(models.Model):
    # Store Firebase UID directly 
    firebase_uid = models.CharField(max_length=128, null=True, blank=True)
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=[
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack')
    ])

    def __str__(self):
        return f"Meal {self.meal_type} on {self.date} by user {self.firebase_uid}"

class MealItem(models.Model):
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.FloatField()

    def __str__(self):
        return f"{self.quantity} of {self.food_item.name} in {self.meal}"
