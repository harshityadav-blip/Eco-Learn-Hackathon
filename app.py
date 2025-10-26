from flask import Flask, request, jsonify, render_template # Import render_template
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database Setup
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # Create the 'users' table (if it doesn't exist)
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT,
            score INTEGER DEFAULT 0,
            avatar_style TEXT DEFAULT 'initials'
        )
    ''')
    
    # Create the 'questions' table (if it doesn't exist)
    c.execute('''
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_text TEXT NOT NULL,
            option_a TEXT NOT NULL,
            option_b TEXT NOT NULL,
            option_c TEXT NOT NULL,
            option_d TEXT NOT NULL,
            correct_answer TEXT NOT NULL, -- Store 'a', 'b', 'c', or 'd'
            difficulty TEXT NOT NULL, -- Store 'easy', 'medium', or 'hard'
            points INTEGER NOT NULL, -- e.g., 5, 10, 20
            explanation TEXT -- ### ADD THIS LINE ###
        )
    ''')
    
    conn.commit()
    conn.close()

# Main Page Route
@app.route('/')
def home():
    """This route now serves your main index.html file."""
    # Flask will automatically look inside the 'templates' folder for this file.
    return render_template('index.html') 

# --- Signup Route ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username'] # Make sure frontend sends 'username'
    password = data['password']

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    try:
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        # Send a JSON response that script.js can understand
        return jsonify({"success": True, "message": "Signup successful! Please login."}), 200
    
    except sqlite3.IntegrityError:
        return jsonify({"success": False, "message": "Username already exists"}), 400
    
    finally:
        conn.close()

# --- Login Route ---
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    c.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = c.fetchone()
    
    conn.close()

    if user:
        # Send a success response
        return jsonify({"success": True, "message": "Login successful!"}), 200
    else:
        # Send an error response
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

@app.route('/leaderboard')
def leaderboard():
    """This route fetches top users and serves the leaderboard.html page."""
    
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # This SQL query selects the username and score to display
    c.execute("SELECT username, score FROM users ORDER BY score DESC LIMIT 10")
    
    # fetchall() gets all the rows from the query as a list
    # e.g., [('user1', 50), ('user2', 30)]
    top_users = c.fetchall()
    
    conn.close()
    
    # Send the list of users to the HTML file to be displayed
    return render_template('leaderboard.html', users=top_users)

# --- Dashboard Route ---
@app.route('/dashboard')
def dashboard():
    """This route just serves the 'dashboard.html' page."""
    # Flask will look in the 'templates' folder for this
    return render_template('dashboard.html')

# --- Get User Data Route ---
@app.route('/get-user-data', methods=['POST'])
def get_user_data():
    """
    This route will be called by the dashboard to get the user's score.
    """
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username not provided"}), 400

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # Find that user in the database
    c.execute("SELECT username, score, avatar_style FROM users WHERE username = ?", (username,))
    user = c.fetchone() # user will be like ('testuser', 0, 'initials')
    
    conn.close()
    
    if user:
        # Send the username, score, and avatar_style back to the frontend
        return jsonify({"success": True, "username": user[0], "score": user[1], "avatar_style": user[2]})
    else:
        return jsonify({"success": False, "message": "User not found"}), 404

# --- Complete Challenge Route ---
@app.route('/complete-challenge', methods=['POST'])
def complete_challenge():
    """
    This route is called when the user clicks the 'complete challenge' button.
    It adds 10 points to their score.
    """
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username not provided"}), 400

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # Update the user's score, adding 10 points
    c.execute("UPDATE users SET score = score + 10 WHERE username = ?", (username,))
    conn.commit()
    
    # After updating, get the user's NEW score to send back
    c.execute("SELECT score FROM users WHERE username = ?", (username,))
    new_score = c.fetchone() # This will be a tuple, e.g., (10,)
    
    conn.close()
    
    if new_score:
        return jsonify({"success": True, "new_score": new_score[0]}) # new_score[0] gets the value 10
    else:
        return jsonify({"success": False, "message": "Could not update score"}), 404

# --- Update Avatar Route ---
@app.route('/update-avatar', methods=['POST'])
def update_avatar():
    """Updates the user's chosen avatar style in the database."""
    data = request.get_json()
    username = data.get('username')
    style = data.get('style')

    if not username or not style:
        return jsonify({"success": False, "message": "Missing data"}), 400

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # Update the user's avatar_style
    c.execute("UPDATE users SET avatar_style = ? WHERE username = ?", (style, username))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True, "message": "Avatar updated!"})

# --- Get Quiz Question Route ---
@app.route('/get-question', methods=['POST'])
def get_question():
    """Fetches a random question based on the user's current score (rank)."""
    
    data = request.get_json()
    username = data.get('username')

    if not username:
        return jsonify({"success": False, "message": "Username not provided"}), 400

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # 1. Get the user's current score
    c.execute("SELECT score FROM users WHERE username = ?", (username,))
    user_score_tuple = c.fetchone()
    
    if not user_score_tuple:
        conn.close()
        return jsonify({"success": False, "message": "User not found"}), 404
        
    user_score = user_score_tuple[0]

    # 2. Determine difficulty based on score (simple ranking)
    if user_score < 50:
        difficulty = 'easy'
    elif user_score < 150:
        difficulty = 'medium'
    else:
        difficulty = 'hard'
        
    # 3. Fetch ONE random question of that difficulty
    # ORDER BY RANDOM() LIMIT 1 is the key part here
    c.execute("""
        SELECT id, question_text, option_a, option_b, option_c, option_d, points 
        FROM questions 
        WHERE difficulty = ? 
        ORDER BY RANDOM() 
        LIMIT 1
    """, (difficulty,))
    
    question_data = c.fetchone()
    conn.close()

    if question_data:
        # Prepare the data to send back (excluding the correct answer!)
        question = {
            "id": question_data[0],
            "text": question_data[1],
            "options": {
                "a": question_data[2],
                "b": question_data[3],
                "c": question_data[4],
                "d": question_data[5],
            },
            "points": question_data[6]
        }
        return jsonify({"success": True, "question": question})
    else:
        # If no questions found for that difficulty (maybe DB is empty?)
        return jsonify({"success": False, "message": f"No {difficulty} questions found"}), 404

# --- Submit Quiz Answer Route ---
@app.route('/submit-answer', methods=['POST'])
def submit_answer():
    """Checks the user's answer, updates score if correct, AND returns the explanation."""
    
    data = request.get_json()
    username = data.get('username')
    question_id = data.get('question_id')
    selected_answer = data.get('answer') # Expect 'a', 'b', 'c', or 'd'

    if not all([username, question_id, selected_answer]):
        return jsonify({"success": False, "message": "Missing data"}), 400

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    
    # 1. Get the correct answer, points, AND explanation for the question
    # ### CHANGE THIS LINE ###
    c.execute("SELECT correct_answer, points, explanation FROM questions WHERE id = ?", (question_id,))
    question_info = c.fetchone()
    
    if not question_info:
        conn.close()
        return jsonify({"success": False, "message": "Question not found"}), 404
        
    correct_answer = question_info[0]
    points_worth = question_info[1]
    explanation = question_info[2] # ### GET THE EXPLANATION ###
    
    is_correct = (selected_answer == correct_answer)
    
    new_score = -1 # Placeholder, only updated if correct
    
    if is_correct:
        # 2. If correct, update the user's score
        c.execute("UPDATE users SET score = score + ? WHERE username = ?", (points_worth, username))
        conn.commit()
        
        # 3. Get the user's new total score
        c.execute("SELECT score FROM users WHERE username = ?", (username,))
        score_tuple = c.fetchone()
        if score_tuple:
            new_score = score_tuple[0]
            
    conn.close()
    
    # 4. Send back correctness, new score (if applicable), AND the explanation
    # ### CHANGE THIS LINE ###
    return jsonify({
        "success": True, 
        "correct": is_correct, 
        "new_score": new_score, 
        "explanation": explanation 
    })

# --- Quiz Page Route ---
@app.route('/quiz')
def quiz():
    """Serves the quiz.html page."""
    return render_template('quiz.html')

# --- Profile Page Route ---
@app.route('/profile')
def profile():
    """Serves the profile.html page."""
    return render_template('profile.html')

# --- SERI Knowledge Base Route ---
@app.route('/seri')
def seri():
    """Serves the SERI.HTML page for queries and knowledge."""
    import os
    with open('SERI.HTML', 'r', encoding='utf-8') as f:
        return f.read()

# --- Static File Routes for SERI Assets ---
import os

@app.route('/SERI.CSS')
def seri_css():
    """Serves the SERI.CSS file."""
    from flask import send_from_directory
    return send_from_directory('.', 'SERI.CSS')

@app.route('/SERI.JS')
def seri_js():
    """Serves the SERI.JS file."""
    from flask import send_from_directory
    return send_from_directory('.', 'SERI.JS')

@app.route('/files/<path:filename>')
def serve_files(filename):
    """Serves images and other static files from the EcoLearn root directory."""
    from flask import send_from_directory
    
    # List of allowed file extensions
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.svg', '.gif', '.webp', '.ico'}
    
    if any(filename.lower().endswith(ext) for ext in allowed_extensions):
        # Check if file exists in the root directory
        if os.path.exists(filename):
            return send_from_directory('.', filename)
    
    return "File not found", 404

# Run the Server
if __name__ == '__main__':
    init_db()
    app.run(debug=True)