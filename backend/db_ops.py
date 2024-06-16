# mongodb_client.py
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

# Access environment variables
cluster_name = os.getenv('REACT_APP_CLUSTER_NAME')
database_name = os.getenv('REACT_APP_DB_NAME')
product_name_db = os.getenv('REACT_APP_NAME_COLLECTION')
collection_name =os.getenv('REACT_APP_COLLECTION_NAME')
connection_string = os.getenv('REACT_APP_MONGO_URI')


def connect_to_mongodb():
    print(connection_string)
    client = MongoClient(connection_string)
    db = client[database_name]
    collection = db[collection_name]
    return collection

def insert_data(collection, data):
    print(connection_string)
    try:
        collection.insert_one(data)
        print("Data inserted into MongoDB successfully.")
    except Exception as e:
        print("Error inserting data into MongoDB:", e)

def get_prev_searches(email):
    try:
        collection = connect_to_mongodb()
        previous_searches = collection.find({"email": email}, {'_id': 0, 'product_data.product_name': 1, 'product_data.barcode': 1})

        seen = set()
        unique_product_info = []

        for search in previous_searches:
            if 'product_data' in search and 'product_name' in search['product_data'] and 'barcode' in search['product_data']:
                product_name = search['product_data']['product_name']
                barcode = search['product_data']['barcode']
                identifier = (product_name, barcode)

                if identifier not in seen:
                    seen.add(identifier)
                    unique_product_info.append({
                        'product_name': product_name,
                        'barcode': barcode
                    })

        return unique_product_info

    except Exception as e:
        print("Error in fetching previous searches:", e)


def get_prev_product(barcode, email):
    try:
        collection = connect_to_mongodb()
        product_details = collection.find_one({ "product_data.barcode": barcode, "email": email }, { '_id': 0, 'product_data': 1 })
        
        if product_details and 'product_data' in product_details:
            return product_details['product_data']
        else:
            return None

    except Exception as e:
        print("Product details not found", e)
        return None


def get_barcode(product_name):
    try:
        client = MongoClient(connection_string)
        db = client[database_name]
        collection = db[product_name_db]

        barcode_number = collection.find({'name': product_name.lower()},{'_id':0,'barcode_number':1})
        if barcode_number:
            return barcode_number[0]['barcode_number']
        else:
            return None
    except Exception as e :
        print("Product not found",e)
        return None 



