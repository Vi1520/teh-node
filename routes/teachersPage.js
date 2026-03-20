const express = require('express');
const path = require('path');
const db = require('../config/database');

const router = express.Router();

// Страница со списком преподавателей
router.get('/', (req, res) => {
    // Получаем всех преподавателей из БД
    db.query('SELECT * FROM teachers ORDER BY full_name', (err, teachers) => {
        if (err) {
            console.error('Ошибка получения преподавателей:', err);
            teachers = [];
        }
        
        // Генерируем HTML для каждого преподавателя
        let teachersHtml = '';
        if (teachers.length > 0) {
            teachers.forEach(teacher => {
                teachersHtml += `
                    <div class="teacher-card">
                        <h3>${teacher.full_name}</h3>
                        <p><strong>Предмет:</strong> ${teacher.subject || 'Не указан'}</p>
                        <p><strong>Квалификация:</strong> ${teacher.qualification || 'Не указана'}</p>
                        <p><strong>Опыт:</strong> ${teacher.experience ? teacher.experience + ' лет' : 'Не указан'}</p>
                        <p><strong>Email:</strong> ${teacher.email || 'Не указан'}</p>
                        <p><strong>Телефон:</strong> ${teacher.phone || 'Не указан'}</p>
                        <p><strong>Кафедра:</strong> ${teacher.department || 'Не указана'}</p>
                    </div>
                `;
            });
        } else {
            teachersHtml = '<p class="no-data">Преподаватели не найдены</p>';
        }
        
        // Отправляем HTML страницу
        res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Преподаватели - Техникум</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .teachers-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .teacher-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            border-left: 4px solid #764ba2;
        }
        .teacher-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .teacher-card h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.2rem;
            border-bottom: 2px solid #764ba2;
            padding-bottom: 8px;
        }
        .teacher-card p {
            margin: 8px 0;
            color: #555;
        }
        .teacher-card strong {
            color: #333;
            width: 120px;
            display: inline-block;
        }
        .no-data {
            text-align: center;
            color: #999;
            font-size: 1.2rem;
            padding: 40px;
            grid-column: 1/-1;
        }
        .stats {
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .stats-number {
            font-size: 2rem;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <nav>
        <ul>
            <li><a href="/">Главная</a></li>
            <li><a href="/about">О техникуме</a></li>
            <li><a href="/students">Студенты</a></li>
            <li><a href="/teachers" class="active">Преподаватели</a></li>
            <li><a href="/contacts">Контакты</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="content">
            <h1>👨‍🏫 Наши преподаватели</h1>
            
            <div class="stats">
                <div class="stats-number">${teachers.length}</div>
                <div>преподавателей работают</div>
            </div>
            
            <div class="teachers-container">
                ${teachersHtml}
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
});

module.exports = router;