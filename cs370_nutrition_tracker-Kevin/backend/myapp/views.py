import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import FoodItem, Meal, MealItem
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
#@permission_classes([IsAuthenticated])
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
            user_id=1, #request.user,
            meal_type=meal_type,
            date=datetime.strptime(date_str, '%Y-%m-%d').date()
        )

        # Add food items
        for item in food_items:
            food_item = FoodItem.objects.create(
                name=item['food_name'],
                brand_name=item.get('brand_name', ''),  # Add this line
                calories=item.get('calories', 0),
                protein=float(item.get('protein', 0)),
                carbs=float(item.get('carbs', 0)),
                fat=float(item.get('fat', 0)),
                fdc_id=item.get('fdc_id', 'manual-entry')
            )
            MealItem.objects.create(
                meal=meal,
                food_item=food_item,
                quantity=item.get('quantity', 1.0)
            )

        return JsonResponse({'message': 'Meal created successfully', 'meal_id': meal.id})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
#@permission_classes([IsAuthenticated])
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
                    'brand_name': item.food_item.brand_name,
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
    
class SelectedFoodView(APIView):
    # Remove permission_classes if you don't need authentication for now
    def post(self, request):
        try:
            # First create food item without user
            food_item = FoodItem.objects.create(
                name=request.data.get('food_name', request.data.get('description', '')),  # Handle both field names
                calories=0,
                protein=float(next((n['value'] for n in request.data.get('nutrients', []) 
                                  if 'Protein' in n['nutrientName']), 0)),
                carbs=float(next((n['value'] for n in request.data.get('nutrients', []) 
                                if 'Carbohydrate' in n['nutrientName']), 0)),
                fat=float(next((n['value'] for n in request.data.get('nutrients', []) 
                              if 'Fat' in n['nutrientName']), 0)),
                fdc_id=request.data.get('fdc_id', 'manual-entry')
            )

            # Create meal without user
            meal = Meal.objects.create(
                user_id=1,  # Set a default user ID for testing
                date=datetime.strptime(request.data.get('date_added', datetime.now().strftime('%Y-%m-%d')), '%Y-%m-%d').date(),
                meal_type=request.data.get('meal', 'breakfast')
            )

            # Create meal item
            meal_item = MealItem.objects.create(
                meal=meal,
                food_item=food_item,
                quantity=1.0
            )

            return Response({
                'message': 'Food saved successfully',
                'meal_id': meal.id,
                'food_item_id': food_item.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        
#below is the final version we are going to use with user authentication
#delete the entire SelectedFoodView Class
    
'''
class SelectedFoodView(APIView):
    def post(self, request):
        try:
            # First create food item
            nutrients = request.data.get('nutrients', [])
            protein = next((n['value'] for n in nutrients if 'Protein' in n['nutrientName']), 0)
            carbs = next((n['value'] for n in nutrients if 'Carbohydrate' in n['nutrientName']), 0)
            fat = next((n['value'] for n in nutrients if 'Fat' in n['nutrientName']), 0)
            
            food_item = FoodItem.objects.create(
                name=request.data['food_name'],
                calories=0,  # You might want to calculate this
                protein=protein,
                carbs=carbs,
                fat=fat,
                fdc_id=request.data.get('fdc_id', 'manual-entry')
            )

            # Create meal
            meal = Meal.objects.create(
                user=request.user,
                date=datetime.strptime(request.data['date_added'], '%Y-%m-%d').date(),
                meal_type=request.data['meal']
            )

            # Create meal item
            meal_item = MealItem.objects.create(
                meal=meal,
                food_item=food_item,
                quantity=1.0  # Default quantity
            )

            return Response({
                'message': 'Food saved successfully',
                'meal_id': meal.id,
                'food_item_id': food_item.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            # Get recent meals
            meals = Meal.objects.filter(user=request.user).order_by('-date')[:10]
            meals_data = []
            
            for meal in meals:
                meal_items = []
                for item in meal.mealitem_set.all():
                    meal_items.append({
                        'food_name': item.food_item.name,
                        'quantity': item.quantity,
                        'protein': item.food_item.protein,
                        'carbs': item.food_item.carbs,
                        'fat': item.food_item.fat
                    })
                
                meals_data.append({
                    'date': meal.date,
                    'meal_type': meal.meal_type,
                    'items': meal_items
                })
            
            return Response(meals_data)
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
'''