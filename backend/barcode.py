from flask import Flask, request, jsonify
from flask_cors import CORS
import zxing
import tempfile
import os
import database as database
from database import process_product_data
from db_ops import get_prev_searches
from db_ops import get_prev_product
from db_ops import get_barcode


app = Flask(__name__)
CORS(app)

def decode_barcode(image_path):
    reader = zxing.BarCodeReader()
    barcode = reader.decode(image_path)
    if barcode and barcode.raw:
        return barcode.raw
    else:
        return None


@app.route('/process-barcode', methods=['POST'])
def process_barcode():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']

        # Save the image to a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        temp_file.write(file.read())
        temp_file.close()

        # Decode the barcode using the temporary file
        barcode_content = decode_barcode(temp_file.name)
        
        # Clean up the temporary file
        os.unlink(temp_file.name)

        if barcode_content:
            # print(barcode_content)
            return jsonify({'barcode': barcode_content})
        else:
            return jsonify({'error': 'No barcode found'}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500
    

@app.route('/analysis-name', methods=['POST'])
def get_analysis_name():
    try:
        if request.content_type != 'application/json':
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        # Get barcode from the JSON body
        product_name = request.json.get('product_name')
        user = request.json.get('user')

        print(user,product_name)

        barcode = get_barcode(product_name)
        print(barcode)

        if barcode:
            if user:
                result = process_product_data(barcode=barcode,user=user)
                return jsonify(result)
            else:
                return jsonify({'barcode': barcode, 'error': 'No data found for the barcode'}), 404
        else:
            return jsonify({'error': 'Barcode parameter missing in the request'}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500



@app.route('/analysis', methods=['POST'])
def get_analysis():
    try:

        # print(request)
        if request.content_type != 'application/json':
            return jsonify({'error': 'Content-Type must be application/json'}), 400

        # Get barcode from the JSON body
        barcode = request.json.get('barcode')
        user = request.json.get('user')

        print(barcode,user)

        if barcode:
            if user:
                result = process_product_data(barcode=barcode,user=user)
                return jsonify(result)
            else:
                return jsonify({'barcode': barcode, 'error': 'No data found for the barcode'}), 404
        else:
            return jsonify({'error': 'Barcode parameter missing in the request'}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500
    


@app.route('/get-product', methods=['GET'])
def get_product():
    # Get the product name from the query parameters
    email = request.args.get('email')
    barcode = int(request.args.get('barcode'))

    # Check if the product name is provided
    if not barcode:
        return jsonify({'error': 'Barcode parameter missing in the request'}), 400
    
    if not email:
        return jsonify({'Error':"Email missing in parameter"}) , 400
    

    product_details = get_prev_product(barcode,email)
    return jsonify(product_details)




@app.route('/api/previous-searches', methods=['POST'])
def fetch_previous_searches():
    try:
        data = request.json
        email = data.get('email')

        product_info = get_prev_searches(email)

        return jsonify(product_info)

    except Exception as e:
        return jsonify({'error': 'Internal server error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(host='localhost', port=5000)
