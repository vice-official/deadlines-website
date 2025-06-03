from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
import os

app = Flask(__name__)
app.secret_key = 'secret_key_123'  # Для работы сессий


# Создаем базу данных при первом запуске
def init_db():
    if not os.path.exists('users.db'):
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()
        conn.close()


init_db()


@app.route("/")
def home():
    if 'email' not in session:
        return redirect(url_for('login'))
    return render_template("index.html", email=session['email'])


@app.route("/login", methods=['GET', 'POST'])
def login():

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
        user = cursor.fetchone()
        conn.close()
        if not email or '@' not in email:
            return "Некорректный email"

        if len(password) < 6:
            return "Пароль слишком короткий"
        if user:
            session['email'] = email  # Сохраняем email в сессии
            return redirect(url_for('home'))
        else:
            return "Неверные email или пароль"

    return render_template("login.html")


@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        try:
            conn = sqlite3.connect('users.db')
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, password))
            conn.commit()
            conn.close()

            session['email'] = email  # Авторизуем сразу после регистрации
            return redirect(url_for('home'))
        except sqlite3.IntegrityError:
            return "Пользователь с таким email уже существует"

    return render_template("reg.html")


@app.route("/logout")
def logout():
    session.pop('email', None)
    return redirect(url_for('login'))


import sqlite3

# Подключаемся к базе
conn = sqlite3.connect('users.db')
cursor = conn.cursor()

# Выполняем запрос
cursor.execute("SELECT * FROM users")
users = cursor.fetchall()

# Выводим результат
for user in users:
    print(user)

# Закрываем соединение
conn.close()

if __name__ == "__main__":
    app.run(debug=True) 