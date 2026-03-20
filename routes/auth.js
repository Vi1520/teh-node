const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

const router = express.Router();

// Страница входа
router.get('/login', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход - Техникум</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-links {
            display: flex;
            list-style: none;
            gap: 20px;
        }
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        .nav-links a:hover {
            background: #667eea;
            color: white;
        }
        .nav-auth {
            display: flex;
            gap: 10px;
        }
        .btn-auth {
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
            color: white;
            background: #667eea;
            transition: background 0.3s ease;
        }
        .btn-auth:hover {
            background: #764ba2;
        }
        .btn-register {
            background: #28a745;
        }
        .btn-register:hover {
            background: #218838;
        }
        .auth-container {
            max-width: 400px;
            margin: 50px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .auth-container h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        .auth-container input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .auth-container button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
        }
        .auth-container button:hover {
            background: #764ba2;
        }
        .auth-container p {
            text-align: center;
            margin-top: 20px;
        }
        .auth-container a {
            color: #667eea;
            text-decoration: none;
        }
        .error {
            color: red;
            text-align: center;
            margin: 10px 0;
        }
        .success {
            color: green;
            text-align: center;
            margin: 10px 0;
        }
        @media (max-width: 768px) {
            .nav-container {
                flex-direction: column;
                gap: 10px;
            }
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="nav-container">
            <ul class="nav-links">
                <li><a href="/">Главная</a></li>
                <li><a href="/about">О техникуме</a></li>
                <li><a href="/students">Студенты</a></li>
                <li><a href="/teachers">Преподаватели</a></li>
                <li><a href="/contacts">Контакты</a></li>
            </ul>
            <div class="nav-auth">
                <a href="/auth/login" class="btn-auth">Вход</a>
                <a href="/auth/register" class="btn-auth btn-register">Регистрация</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="auth-container">
            <h2>Вход в систему</h2>
            <div id="error" class="error"></div>
            <div id="success" class="success"></div>
            <input type="text" id="username" placeholder="Имя пользователя" required>
            <input type="password" id="password" placeholder="Пароль" required>
            <button onclick="login()">Войти</button>
            <p>Нет аккаунта? <a href="/auth/register">Зарегистрироваться</a></p>
        </div>
    </div>

    <footer>
        <p>© 2026 Техникум. Все права защищены.</p>
    </footer>

    <script>
        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            document.getElementById('error').textContent = '';
            document.getElementById('success').textContent = '';

            if (!username || !password) {
                document.getElementById('error').textContent = 'Заполните все поля';
                return;
            }

            fetch('/auth/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('error').textContent = data.error;
                } else {
                    document.getElementById('success').textContent = 'Вход выполнен! Перенаправление...';
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1000);
                }
            })
            .catch(error => {
                document.getElementById('error').textContent = 'Ошибка соединения';
            });
        }
    </script>
</body>
</html>
    `);
});

// Страница регистрации
router.get('/register', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация - Техникум</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-links {
            display: flex;
            list-style: none;
            gap: 20px;
        }
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            padding: 5px 10px;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        .nav-links a:hover {
            background: #667eea;
            color: white;
        }
        .nav-auth {
            display: flex;
            gap: 10px;
        }
        .btn-auth {
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
            color: white;
            background: #667eea;
            transition: background 0.3s ease;
        }
        .btn-auth:hover {
            background: #764ba2;
        }
        .btn-register {
            background: #28a745;
        }
        .btn-register:hover {
            background: #218838;
        }
        .auth-container {
            max-width: 400px;
            margin: 50px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .auth-container h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }
        .auth-container input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .auth-container button {
            width: 100%;
            padding: 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 20px;
        }
        .auth-container button:hover {
            background: #764ba2;
        }
        .auth-container p {
            text-align: center;
            margin-top: 20px;
        }
        .auth-container a {
            color: #667eea;
            text-decoration: none;
        }
        .error {
            color: red;
            text-align: center;
            margin: 10px 0;
        }
        .success {
            color: green;
            text-align: center;
            margin: 10px 0;
        }
        @media (max-width: 768px) {
            .nav-container {
                flex-direction: column;
                gap: 10px;
            }
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="nav-container">
            <ul class="nav-links">
                <li><a href="/">Главная</a></li>
                <li><a href="/about">О техникуме</a></li>
                <li><a href="/students">Студенты</a></li>
                <li><a href="/teachers">Преподаватели</a></li>
                <li><a href="/contacts">Контакты</a></li>
            </ul>
            <div class="nav-auth">
                <a href="/auth/login" class="btn-auth">Вход</a>
                <a href="/auth/register" class="btn-auth btn-register">Регистрация</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="auth-container">
            <h2>Регистрация</h2>
            <div id="error" class="error"></div>
            <div id="success" class="success"></div>
            <input type="text" id="username" placeholder="Имя пользователя *" required>
            <input type="password" id="password" placeholder="Пароль *" required>
            <input type="email" id="email" placeholder="Email (необязательно)">
            <button onclick="register()">Зарегистрироваться</button>
            <p>Уже есть аккаунт? <a href="/auth/login">Войти</a></p>
        </div>
    </div>

    <footer>
        <p>© 2026 Техникум. Все права защищены.</p>
    </footer>

    <script>
        function register() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const email = document.getElementById('email').value;
            
            document.getElementById('error').textContent = '';
            document.getElementById('success').textContent = '';

            if (!username || !password) {
                document.getElementById('error').textContent = 'Заполните обязательные поля';
                return;
            }

            fetch('/auth/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('error').textContent = data.error;
                } else {
                    document.getElementById('success').textContent = 'Регистрация успешна! Перенаправление на вход...';
                    setTimeout(() => {
                        window.location.href = '/auth/login';
                    }, 2000);
                }
            })
            .catch(error => {
                document.getElementById('error').textContent = 'Ошибка соединения';
            });
        }
    </script>
</body>
</html>
    `);
});

