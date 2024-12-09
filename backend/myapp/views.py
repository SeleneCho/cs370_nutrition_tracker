import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view
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
                    if
                        'Carbohydrate' in nutrient['nutrientName'] or
                         'Protein' in nutrient['nutrientName'] or
                         'Fat' in nutrient['nutrientName'] or
                         'KCAL' in nutrient['unitName']
                ]
                
                results.append(food_info)

            return JsonResponse({'foods': results})
        else:
            return JsonResponse({'error': 'Failed to fetch data from API'}, status=response.status_code)

    return JsonResponse({'error': 'Query parameter is required'}, status=400)

# existing search_food view from source code

@api_view(['POST'])
def create_meal(request):
    """
    Create new meals with associated food items.
    Now requires Firebase UID.
    """
    try:
        data = request.data
        firebase_uid = data.get('firebase_uid')

        #check for Firebase UID in request body
        if not firebase_uid:
            return Response({'error': 'Firebase UID is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        
        meal_type = data.get('meal_type')
        date_str = data.get('date')
        food_items = data.get('food_items', [])

        if not all([meal_type, date_str, food_items]):
            return Response({'error': 'Missing required fields'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        # Create meal with Firebase UID
        meal = Meal.objects.create(
            firebase_uid=firebase_uid,
            meal_type=meal_type,
            date=datetime.strptime(date_str, '%Y-%m-%d').date()
        )

        # Add food items
        for item in food_items:
            food_item = FoodItem.objects.create(
                name=item['food_name'],
                brand_name=item.get('brand_name', ''),
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

        return Response({
            'message': 'Meal created successfully',
            'meal_id': meal.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])

def get_meals(request):
    """
    Retrieve meals for a specific user.
    Fetch meals within a date range for a specific user.
    Query parameters:
    - start_date: Start of date range (YYYY-MM-DD)
    - end_date: End of date range (YYYY-MM-DD)
    - firebase_uid: User's Firebase UID.
    """
    try:
        # Get date range from query parameters
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        firebase_uid = request.GET.get('firebase_uid')

        if not all([start_date, end_date, firebase_uid]):
            return Response(
                {'error': 'start_date, end_date, and firebase_uid are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Convert string dates to datetime objects
        start = datetime.strptime(start_date, '%Y-%m-%d').date()
        end = datetime.strptime(end_date, '%Y-%m-%d').date()

        # Query meals within the date range for the specific user
        meals = Meal.objects.filter(
            firebase_uid=firebase_uid,
            date__range=[start, end]
        ).order_by('date')

        # Format the response data
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
                'date': meal.date,
                'meal_type': meal.meal_type,
                'items': meal_items
            })

        return Response({'meals': meals_data})

    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class SelectedFoodView(APIView):
    """
    Handle selected food items from the search results.
    This class breaks down the food data and creates the necessary database entries.
    IMPORTANT-don't remove
    """
    def post(self, request):
        try:
            # Get Firebase UID from headers
            firebase_uid = request.headers.get('Firebase-UID')
            if not firebase_uid:
                return Response({'error': 'Firebase-UID header is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)

            # Extract nutrients from the food data
            nutrients = request.data.get('nutrients', [])
            # Find energy/calories (usually labeled as 'Energy')
            calories = next((n['value'] for n in nutrients 
                           if 'Energy' in n['nutrientName']), 0)
            # Find protein content
            protein = next((n['value'] for n in nutrients 
                          if 'Protein' in n['nutrientName']), 0)
            # Find carbohydrate content
            carbs = next((n['value'] for n in nutrients 
                        if 'Carbohydrate' in n['nutrientName']), 0)
            # Find fat content
            fat = next((n['value'] for n in nutrients 
                       if 'Fat' in n['nutrientName']), 0)
            
            # Create the food item
            food_item = FoodItem.objects.create(
                name=request.data.get('description', ''),
                brand_name=request.data.get('brandName', ''),
                calories=calories,
                protein=float(protein),
                carbs=float(carbs),
                fat=float(fat),
                fdc_id=request.data.get('fdc_id', 'manual-entry')
            )

            # Create the meal
            meal = Meal.objects.create(
                firebase_uid=firebase_uid,
                date=datetime.strptime(
                    request.data.get('date', datetime.now().strftime('%Y-%m-%d')),
                    '%Y-%m-%d'
                ).date(),
                meal_type=request.data.get('meal_type', 'breakfast')
            )

            # Create the meal item (linking food item to meal)
            meal_item = MealItem.objects.create(
                meal=meal,
                food_item=food_item,
                quantity=request.data.get('quantity', 1.0)
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