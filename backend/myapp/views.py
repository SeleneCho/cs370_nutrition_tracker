import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view

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
