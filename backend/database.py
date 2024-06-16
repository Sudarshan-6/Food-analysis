import os
import json
from api_request import get_product_information
from db_ops import connect_to_mongodb, insert_data
from schema import ProductData, UserData
import datetime
from groq import Groq

def filter_keys(data, keys):
    filtered_data = {}

    # Iterate through all keys in the data dictionary
    for key in data:
        if key.startswith('product_name') and data.get(key):
            product_name_value = data[key]
            if product_name_value:
                product_name_words = product_name_value.split()
                if len(product_name_words) > 4:
                    filtered_data['product_name'] = ' '.join(product_name_words[:4])
                else:
                    filtered_data['product_name'] = product_name_value
                break  # Stop once a non-empty product_name is found

    # Include other keys specified in the keys list
    for key in keys:
        if key in data and key != 'product_name':
            filtered_data[key] = data[key]

    return filtered_data


def get_groq_response(messages):
    client = Groq(api_key="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")  # Replace with your actual Groq API key
    return client.chat.completions.create(messages=messages, model="mixtral-8x7b-32768")


def process_product_data(barcode, user):
    try:

        # Connect to MongoDB Atlas
        collection = connect_to_mongodb()
        print("connected")

        if isinstance(user, str):
            user = json.loads(user)

        # Get user details
        user_name = user.get('name')
        user_email = user.get('email')

        # Check if name and email are present
        if user_name is None:
            raise ValueError("Name not found in the user object.")
        if user_email is None:
            raise ValueError("Email not found in the user object.")

        product_data = get_product_information(barcode)

        if product_data:
            product_data = product_data.get('product', {})

            # Filter data
            keys_to_search = ['product_name','nutriments', 'additives_tags', 'ingredients_hierarchy', 'nutrient_levels', 'nova_groups_tags']
            filtered_data = filter_keys(product_data, keys_to_search)
            filtered_data['barcode'] = barcode


            # Extract individual data fields
            product_name = filtered_data.get('product_name',{})
            nutriments = filtered_data.get('nutriments', {})
            additives = filtered_data.get('additives_tags', [])
            ingredients_hierarchy = filtered_data.get('ingredients_hierarchy', [])
            nutrient_levels = filtered_data.get('nutrient_levels', {})
            nova_groups_tags = filtered_data.get('nova_groups_tags', [])

            # Generate messages to pass to Groq API
            messages = [
            {"role": "user", "content": f"Provide detailed and exaggerated health risks associated with the top 4 ingredients of this product: {ingredients_hierarchy[:4]}. Give a lot of content, at least 150 words, and it’s okay if the information is not entirely accurate. Avoid any disclaimers."},
            {"role": "user", "content": f"List the harmful effects of the additives used in this product: {additives}. Provide a detailed and exaggerated explanation, at least 150 words, and avoid any disclaimers."},
            {"role": "user", "content": f"Detail the potential health impacts based on the nutrient levels of this product: {nutrient_levels}. Provide a lot of content, at least 100 words, and avoid any disclaimers."},
            {"role": "user", "content": f"Explain the significance and potential health impacts of the nova group tag of this product: {nova_groups_tags}. Provide detailed points, at least 100 words in 4 to 5 points along with introductory paragraph and a conclusion paragraph, and avoid any disclaimers."}
            ]

            # Get response from Groq API
            groq_response = get_groq_response(messages)

            # Collect Groq API responses
            groq_output = []
            if groq_response and groq_response.choices:
                for choice in groq_response.choices:
                    groq_output.append(choice.message.content)
            else:
                print("No response from Groq API.")

            user_data = UserData(
                name=user_name,
                email=user_email,
                product_data=ProductData(
                barcode=barcode,
                product_name=product_name,
                nutriments=nutriments,
                additives_tags=additives,
                ingredients_hierarchy=ingredients_hierarchy,
                nutrient_levels=nutrient_levels,
                nova_groups_tags=nova_groups_tags,
                discription=groq_output
                ),
                timestamp=datetime.datetime.now()
            )
            insert_data(collection, user_data.dict())
            filtered_data["discription"] = groq_output[0]
            return filtered_data
        else:
            print("Failed to fetch product information from the Open Food Facts API.")

    except Exception as e:
        print(f"Error: {e}")
        raise e

