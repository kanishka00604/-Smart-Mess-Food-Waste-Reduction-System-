# ai-service/app.py
# Placeholder Flask AI service — full AI prediction code in Module 3

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': 'AI Service is running'})

# Full prediction endpoint will be added in Module 3
# POST /predict — predicts next-day food demand
# POST /sentiment — analyzes feedback sentiment

if __name__ == '__main__':
    app.run(debug=True, port=8000)
