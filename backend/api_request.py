# api_requests.py
import requests

def get_api_response(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print("Error:", response.status_code)
            return None
    except Exception as e:
        print("Error:", e)
        return None

def get_product_information(barcode):
    api_url = f"https://world.openfoodfacts.org/api/v2/product/{barcode}.json"
    return get_api_response(api_url)
