from flask import Flask, request, jsonify, redirect, url_for, render_template
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from urllib.parse import quote_plus
from datetime import datetime
import bcrypt
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Secure random key
CORS(app)

# JWT setup
app.config['JWT_SECRET_KEY'] = os.urandom(24)
jwt_manager = JWTManager(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# URL encode the password
username = "Karan"
password = quote_plus("Karan@2007")

# MongoDB Atlas connection string with the encoded password
client = MongoClient(f"mongodb+srv://{username}:{password}@shiftsync.ph7qk.mongodb.net/?retryWrites=true&w=majority&appName=ShiftSync")

# Select the database and collection
db = client['geoapp']
users_collection = db['users']
logs_collection = db['user_logs']

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if username already exists
    if users_collection.find_one({'username': username}):
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Store the username and hashed password
    users_collection.insert_one({'username': username, 'password': hashed_password})

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'username': username})
    if user:
        stored_password = user['password']

        if bcrypt.checkpw(password.encode('utf-8'), stored_password):
            user_id = str(user['_id'])
            token = create_access_token(identity=user_id)

            login_user(User(user_id))
            return jsonify({'message': 'Logged in successfully', 'token': token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'error': 'User not found'}), 404

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/checkin', methods=['POST'])
@jwt_required()
def checkin():
    try:
        data = request.json
        action = data.get('action')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        timestamp = datetime.now()  # Automatically capture the current timestamp
        user_id = get_jwt_identity()

        log_entry = {
            'user_id': user_id,
            'action': action,
            'timestamp': timestamp,
            'latitude': latitude,
            'longitude': longitude
        }

        logs_collection.insert_one(log_entry)
        return jsonify({'message': 'Check-in/out recorded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/checkLocation', methods=['POST'])
@jwt_required()
def check_location():
    data = request.json
    lat = data.get('latitude')
    lon = data.get('longitude')

    # Define the center point and radius in meters
    center_lat, center_lon = 37.7749, -122.4194  # Example coordinates (San Francisco)
    radius = 200  # Radius in meters

    def haversine(lat1, lon1, lat2, lon2):
        import math
        R = 6371000  # Radius of Earth in meters
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lat2 - lon1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    distance = haversine(center_lat, center_lon, lat, lon)

    if distance <= radius:
        return jsonify({'withinRange': True}), 200
    return jsonify({'withinRange': False}), 200

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
