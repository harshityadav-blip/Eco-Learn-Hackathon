# EcoLearn - Sustainable Development Goals Learning Platform

A modern, interactive web application designed to educate users about environmental sustainability and Sustainable Development Goals (SDGs) through gamified learning experiences.

## 🌱 Features

- **User Authentication**: Secure signup and login system
- **Profile Customization**: Choose from 14 different avatar styles
- **Interactive Quiz**: Dynamic quiz system with difficulty levels based on user progress
- **Leaderboard**: Compete with other users and track your ranking
- **Daily Challenges**: Complete environmental challenges to earn points
- **Knowledge Base (SERI)**: Comprehensive educational content about nature and sustainability
- **Dark/Light Mode**: Beautiful theme toggle with persistent preferences
- **Responsive Design**: Modern UI that works on all devices

## 🚀 Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: SQLite3
- **Styling**: Tailwind CSS
- **Avatar API**: DiceBear Avatars

## 📦 Installation

### Prerequisites
- Python 3.12 or higher
- pip (Python package manager)

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/harshityadav-blip/Eco-Learn-Hackathon.git
cd Eco-Learn-Hackathon
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
```bash
pip install flask flask-cors
```

5. Initialize the database and add sample questions:
```bash
python populate_db.py
```

6. Run the application:
```bash
python app.py
```

7. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## 📁 Project Structure

```
EcoLearn/
├── app.py                 # Main Flask application
├── populate_db.py         # Database initialization script
├── users.db              # SQLite database (created on first run)
├── static/                # Static files (CSS, JS)
│   ├── css/
│   └── js/
├── templates/             # HTML templates
│   ├── index.html         # Login/Signup page
│   ├── dashboard.html     # Main dashboard
│   ├── quiz.html          # Quiz interface
│   ├── profile.html       # Profile customization
│   └── leaderboard.html   # Leaderboard page
├── SERI.HTML             # Knowledge base page
├── SERI.CSS              # Knowledge base styles
└── SERI.JS               # Knowledge base scripts
```

## 🎮 Usage

1. **Sign Up**: Create a new account with a username and password
2. **Customize Avatar**: Choose your preferred avatar style
3. **Take Quiz**: Answer environmental questions to earn points
4. **Complete Challenges**: Participate in daily sustainability challenges
5. **Check Leaderboard**: See how you rank among all users
6. **Explore Knowledge Base**: Learn more about environmental topics

## 🏆 Features in Detail

### Quiz System
- Questions are dynamically selected based on user's current score
- Difficulty levels: Easy (0-50), Medium (50-150), Hard (150+)
- Each correct answer awards points and provides explanations
- Score increases rank and unlocks harder questions

### Avatar System
- 14 different avatar styles from DiceBear API
- Personalized avatars based on username
- Avatar preferences saved to database

### Leaderboard
- Top 10 users displayed
- Real-time rankings based on total points
- Beautiful medal system for top 3 users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available for educational purposes.

## 👥 Team

- **Web Design**: Sayan Sarkar
- **Web Design/Logic/Quiz**: Harshit Yadav  
- **Web Design/Info Collect**: Swadhin Ghosh
- **Web Design/Pic Collect**: Pritam Das

## 🙏 Acknowledgments

- DiceBear for providing avatar generation API
- Flask community for excellent documentation
- Tailwind CSS for beautiful styling

---

Made with 💚 for a sustainable future

