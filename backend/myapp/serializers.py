from rest_framework import serializers
from .models import SelectedFood

class SelectedFoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedFood
        fields = ['date_added', 'meal', 'food_name', 'brand_name', 'protein', 'carbohydrate', 'fat']
