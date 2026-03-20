const express = require('express');
const path = require('path');
const db = require('../config/database');

const router = express.Router();

// Страница со списком студентов
router.get('/', (req, res) => {
    // Получаем всех студентов из БД
    db.query('SELECT * FROM students ORDER BY full_name', (err, students) => {
        if (err) {
            console.error('Ошибка получения студентов:', err);
            students = [];
        }
        
        // Генерируем HTML для каждого студента
        let studentsHtml = '';
        if (students.length > 0) {
            students.forEach(student => {
                studentsHtml += `
                    <div class="student-card">
                        <h3>${student.full_name}</h3>
                        <p><strong>Группа:</strong> ${student.group_name || 'Не указана'}</p>
                        <p><strong>Курс:</strong> ${student.course || 'Не указан'}</p>
                        <p><strong>Email:</strong> ${student.email || 'Не указан'}</p>
                        <p><strong>Телефон:</strong> ${student.phone || 'Не указан'}</p>
                        <p><strong>Год поступления:</strong> ${student.enrollment_year || 'Не указан'}</p>
                    </div>
                `;
            });
        } else {
            studentsHtml = '<p class="no-data">Студенты не найдены</p>';
        }
        
        // Отправляем HTML страницу
        res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Студенты - Техникум</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .students-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .student-card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            border-left: 4px solid #667eea;
        }
        .student-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        .student-card h3 {
            color: #333;
            margin-bottom: 15px;
            font-size: 1.2rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 8px;
        }
        .student-card p {
            margin: 8px 0;
            color: #555;
        }
        .student-card strong {
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            <li><a href="/students" class="active">Студенты</a></li>
            <li><a href="/teachers">Преподаватели</a></li>
            <li><a href="/contacts">Контакты</a></li>
        </ul>
    </nav>

    <div class="container">
        <div class="content">
            <h1>👨‍🎓 Наши студенты</h1>
            
            <div class="stats">
                <div class="stats-number">${students.length}</div>
                <div>студентов обучается</div>
            </div>
            
            <div class="students-container">
                ${studentsHtml}
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