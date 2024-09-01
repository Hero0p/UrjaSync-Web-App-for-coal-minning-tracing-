from flask import Flask, render_template, request, redirect, session, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import os
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db' # logindb will be created in same directory
app.config['SECRET_KEY'] = os.urandom(24) # Needed for session management
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save uploaded CSV files
app.config['STATIC_FOLDER'] = 'static'  # Folder to save generated graphs
db = SQLAlchemy(app)

# Ensure the upload and static folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['STATIC_FOLDER'], exist_ok=True)

# TABLE CONTENT
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # Check if passwords match
        if password != confirm_password:
            return render_template('signup.html', error="Passwords do not match")
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return render_template('signup.html', error="Username already exists")
        
        # Create new user
        user = User(name=name, username=username, password=password)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()
        if user:
            session['username'] = username
            session['name'] = user.name  # Store the user's name in the session
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error="Invalid username or password")
    return render_template('login.html')

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return render_template('dashboard.html', name=session['name'])
    else:
        return redirect(url_for('login'))

@app.route('/mine')
def mine():
    # Extract query parameters
    name = request.args.get('name')
    location = request.args.get('location')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    # Pass these parameters to the template
    return render_template('mine.html', name=name, location=location, latitude=latitude, longitude=longitude)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'username' not in session:
        return redirect(url_for('login'))

    mine_name = request.form['mine_name']
    file = request.files['file-upload']
    if file and mine_name:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], f'{mine_name}.csv')
        file.save(filepath)
        # Process the CSV file
        process_csv(filepath, mine_name)
        return redirect(url_for('dashboard'))
    return 'File upload failed', 400

@app.route('/mine/<mine_name>')
def mine_details(mine_name):
    # Check if file exists
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], f'{mine_name}.csv')
    if not os.path.exists(filepath):
        return 'Mine data not found', 404

    # Generate graphs
    predictions = generate_graphs(filepath, mine_name)
    
    # Pass predictions and graph paths to template
    return render_template('mine.html', mine_name=mine_name, predictions=predictions)

@app.route('/static/<path:filename>')
def download_file(filename):
    return send_from_directory(app.config['STATIC_FOLDER'], filename)

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('name', None)
    return redirect(url_for('home'))

def process_csv(filepath, mine_name):
    # Your code to process the CSV file and generate graphs
    df = pd.read_csv(filepath)
    generate_graphs(df, mine_name)

def generate_graphs(df, mine_name):
    # Your existing code to fit model and generate predictions
    future_year = 2025  # Example future year
    predictions = predict_production_and_emissions(df, future_year)

    # Save graphs
    plt.figure(figsize=(12, 8))
    for column in df.columns[1:6]:
        plt.plot(df['Year'], df[column], label=column)
        plt.scatter(future_year, predictions[column], label=f'Predicted {column}', color='red')
    plt.xlabel('Year')
    plt.ylabel('Coal Production (million tonnes)')
    plt.legend()
    plt.savefig(os.path.join(app.config['STATIC_FOLDER'], f'{mine_name}_production.png'))

    plt.figure(figsize=(12, 8))
    for column in df.columns[6:]:
        plt.plot(df['Year'], df[column], label=column)
        plt.scatter(future_year, predictions[column], label=f'Predicted {column}', color='red')
    plt.xlabel('Year')
    plt.ylabel('Carbon Emissions (tones)')
    plt.legend()
    plt.savefig(os.path.join(app.config['STATIC_FOLDER'], f'{mine_name}_emissions.png'))

    return predictions

def predict_production_and_emissions(df, future_year):
    predictions = {}
    for column in df.columns[1:]:
        X = df[['Year']]
        y = df[column]
        model = LinearRegression()
        model.fit(X, y)
        future_value = model.predict(pd.DataFrame({'Year': [future_year]}))
        predictions[column] = future_value[0]
    return predictions

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
