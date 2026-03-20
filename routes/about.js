const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>О техникуме</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        nav {
            background: rgba(255,255,255,0.95);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-links {
            display: flex;
            gap: 30px;
        }
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        .nav-links a:hover {
            color: #667eea;
        }
        .nav-links a.active {
            color: #667eea;
            font-weight: 600;
        }
        .nav-auth {
            display: flex;
            gap: 15px;
        }
        .btn-auth {
            padding: 8px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .btn-login {
            background: #667eea;
            color: white;
        }
        .btn-login:hover {
            background: #764ba2;
        }
        .btn-register {
            background: #28a745;
            color: white;
        }
        .btn-register:hover {
            background: #218838;
        }
        .container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
        }
        .content {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
            font-size: 2.5rem;
            text-align: center;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin: 40px 0;
        }
        .stat-item {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        .stat-item:hover {
            transform: translateY(-5px);
        }
        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .stat-label {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        .info-block {
            margin: 40px 0;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .info-block h2 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.8rem;
        }
        .info-block p {
            color: #555;
            line-height: 1.8;
            font-size: 1.1rem;
        }
        .info-block ul {
            list-style: none;
            padding: 0;
        }
        .info-block li {
            padding: 10px 0;
            color: #555;
            font-size: 1.1rem;
            border-bottom: 1px solid #ddd;
        }
        .info-block li:last-child {
            border-bottom: none;
        }
        .info-block li:before {
            content: "•";
            color: #667eea;
            font-weight: bold;
            margin-right: 10px;
        }
        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
        }
        @media (max-width: 768px) {
            .nav-container {
                flex-direction: column;
                gap: 15px;
            }
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
            }
            .stats {
                grid-template-columns: 1fr;
            }
            h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="nav-container">
            <div class="nav-links">
                <a href="/">Главная</a>
                <a href="/about" class="active">О техникуме</a>
                <a href="/students">Студенты</a>
                <a href="/teachers">Преподаватели</a>
                <a href="/contacts">Контакты</a>
            </div>
            <div class="nav-auth">
                <a href="/auth/login" class="btn-auth btn-login">Вход</a>
                <a href="/auth/register" class="btn-auth btn-register">Регистрация</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="content">
            <h1>О нашем техникуме</h1>
            
            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">25+</div>
                    <div class="stat-label">лет опыта</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">5000+</div>
                    <div class="stat-label">выпускников</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">компаний-партнеров</div>
                </div>
            </div>
            
            <div class="info-block">
                <h2>📚 История</h2>
                <p>Техникум основан в 1995 году. За это время мы выпустили более 5000 специалистов, работающих в ведущих компаниях страны. Наша миссия - подготовка квалифицированных кадров, готовых к вызовам современного рынка труда.</p>
            </div>
            
            <div class="info-block">
                <h2>🎯 Наши цели</h2>
                <ul>
                    <li>Подготовка квалифицированных специалистов</li>
                    <li>Развитие практических навыков</li>
                    <li>Сотрудничество с работодателями</li>
                    <li>Внедрение современных технологий обучения</li>
                </ul>
            </div>
            
            <div class="info-block">
                <h2>🏆 Достижения</h2>
                <ul>
                    <li>1 место в городском конкурсе профмастерства (2025)</li>
                    <li>Грант на развитие инноваций в образовании (2024)</li>
                    <li>Лучший техникум года (2023)</li>
                </ul>
            </div>
        </div>
    </div>

    <footer>
        <p>© 2026 Техникум. Все права защищены.</p>
    </footer>
</body>
</html>
    `);
});

module.exports = router;