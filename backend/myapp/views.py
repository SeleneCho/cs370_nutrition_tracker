import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import FoodItem, Meal, MealItem
from datetime import datetime

API_KEY = 'xmvenD9mvPwPfjBKSXyKkkxwbiig90mIrbaI4TgJ'  # Replace with your actual API key

@api_view(['GET'])
def search_food(request):
    query = request.GET.get('query', '')
    if query:
        url = f'https://api.nal.usda.gov/fdc/v1/foods/search?api_key={API_KEY}&query={query}'
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            results = []
            for food in data.get('foods', [])[:10]:
                food_info = {
                    'description': food['description'],
                    'brandName': food.get('brandName', 'N/A'),
                    'ingredients': food.get('ingredients', '')[:10],  # Get the ingredients string
                    'dataType': food.get('dataType', ''),
                    'foodCategory': food.get('foodCategory', ''),
                    'packageWeight': food.get('packageWeight', ''),
                    'servingSize': food.get('servingSize', ''),
                    'servingSizeUnit': food.get('servingSizeUnit', ''),
                }
                # Extracting first 10 ingredients
                ingredients_list = food_info['ingredients'].split(', ')[:10]  # Split by ', ' and get first 10
                food_info['ingredients'] = ingredients_list
                
                # Filter nutrients
                food_info['nutrients'] = [
                    {
                        'nutrientName': nutrient['nutrientName'],
                        'unitName': nutrient['unitName'],
                        'value': nutrient['value']
                    }
                    for nutrient in food.get('foodNutrients', [])
                    if 'Carbohydrate' in nutrient['nutrientName'] or 
                       'Protein' in nutrient['nutrientName'] or 
                       'Fat' in nutrient['nutrientName']
                ]
                
                results.append(food_info)

            return JsonResponse({'foods': results})
        else:
            return JsonResponse({'error': 'Failed to fetch data from API'}, status=response.status_code)

    return JsonResponse({'error': 'Query parameter is required'}, status=400)

# existing search_food view from source code

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_meal(request):
    try:
        data = request.data
        meal_type = data.get('meal_type')
        date_str = data.get('date')
        food_items = data.get('food_items', [])  # List of {food_item_id, quantity}

        if not meal_type or not date_str or not food_items:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        # Create meal
        meal = Meal.objects.create(
            user=request.user,
            meal_type=meal_type,
            date=datetime.strptime(date_str, '%Y-%m-%d').date()
        )

        # Add food items
        for item in food_items:
            food_item = FoodItem.objects.get(id=item['food_item_id'])
            MealItem.objects.create(
                meal=meal,
                food_item=food_item,
                quantity=item['quantity']
            )

        return JsonResponse({'message': 'Meal created successfully', 'meal_id': meal.id})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meals(request):
    date_str = request.GET.get('date')
    
    try:
        if date_str:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            meals = Meal.objects.filter(user=request.user, date=date)
        else:
            meals = Meal.objects.filter(user=request.user).order_by('-date')[:10]

        meals_data = []
        for meal in meals:
            meal_items = []
            for item in meal.mealitem_set.all():
                meal_items.append({
                    'food_name': item.food_item.name,
                    'quantity': item.quantity,
                    'calories': item.food_item.calories * item.quantity,
                    'protein': item.food_item.protein * item.quantity,
                    'carbs': item.food_item.carbs * item.quantity,
                    'fat': item.food_item.fat * item.quantity
                })

            meals_data.append({
                'id': meal.id,
                'meal_type': meal.meal_type,
                'date': meal.date,
                'items': meal_items
            })

        return JsonResponse({'meals': meals_data})

    except ValueError:
        return JsonResponse({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)