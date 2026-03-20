const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    let photosHtml = '';
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    
    for (let i = 7; i <= 12; i++) {
        const fileName = `${i}.jpg`;
        const filePath = path.join(uploadDir, fileName);
        if (fs.existsSync(filePath)) {
            photosHtml += `
                <div style="flex:0 0 auto; width:300px;">
                    <img src="/uploads/${fileName}" alt="Фото ${i}" style="width:100%; height:200px; object-fit:cover; border-radius:10px; box-shadow:0 4px 8px rgba(0,0,0,0.1);">
                </div>
            `;
        }
    }
    
    if (photosHtml === '') {
        photosHtml = '<p style="text-align:center; color:#999;">Фотографии не найдены</p>';
    }

    res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Контакты - Техникум</title>
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
        h2 {
            color: #333;
            margin: 30px 0 20px;
            font-size: 2rem;
        }
        .contact-gallery {
            display: flex;
            gap: 20px;
            overflow-x: auto;
            padding: 20px 0;
            margin-bottom: 30px;
        }
        .contact-gallery::-webkit-scrollbar {
            height: 8px;
        }
        .contact-gallery::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .contact-gallery::-webkit-scrollbar-thumb {
            background: #667eea;
            border-radius: 10px;
        }
        .info-block {
            margin: 30px 0;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .contact-info {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            margin: 10px 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .contact-info i {
            font-size: 1.5rem;
            min-width: 30px;
        }
        .working-hours {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 10px;
            margin: 30px 0;
        }
        .working-hours h3 {
            color: #333;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
        .working-hours p {
            margin: 10px 0;
            color: #555;
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
            h1 {
                font-size: 2rem;
            }
            h2 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <nav>
        <div class="nav-container">
            <div class="nav-links">
                <a href="/">Главная</a>
                <a href="/about">О техникуме</a>
                <a href="/students">Студенты</a>
                <a href="/teachers">Преподаватели</a>
                <a href="/contacts" class="active">Контакты</a>
            </div>
            <div class="nav-auth">
                <a href="/auth/login" class="btn-auth btn-login">Вход</a>
                <a href="/auth/register" class="btn-auth btn-register">Регистрация</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="content">
            <h1>Контактная информация</h1>
            
            <h2>🏫 Фотографии техникума</h2>
            <div class="contact-gallery">
                ${photosHtml}
            </div>
            
            <div class="info-block">
                <h2>🏢 Адрес</h2>
                <div class="contact-info">
                    <i>📍</i>
                    <div>
                        <strong>г. Москва, ул. Образования, д. 15</strong><br>
                        <span style="color:#666;">м. Университет, выход №3</span>
                    </div>
                </div>
            </div>
            
            <div class="info-block">
                <h2>📞 Телефоны</h2>
                <div class="contact-info">
                    <i>📱</i>
                    <div>
                        <strong>Приемная комиссия:</strong><br>
                        <a href="tel:+74951234567" style="color:#667eea; text-decoration:none;">+7 (495) 123-45-67</a>
                    </div>
                </div>
                <div class="contact-info">
                    <i>📞</i>
                    <div>
                        <strong>Учебная часть:</strong><br>
                        <a href="tel:+74951234568" style="color:#667eea; text-decoration:none;">+7 (495) 123-45-68</a>
                    </div>
                </div>
            </div>
            
            <div class="info-block">
                <h2>✉️ Email</h2>
                <div class="contact-info">
                    <i>📧</i>
                    <div>
                        <strong>Общие вопросы:</strong><br>
                        <a href="mailto:info@technicum.ru" style="color:#667eea; text-decoration:none;">info@technicum.ru</a>
                    </div>
                </div>
                <div class="contact-info">
                    <i>📧</i>
                    <div>
                        <strong>Приемная комиссия:</strong><br>
                        <a href="mailto:priem@technicum.ru" style="color:#667eea; text-decoration:none;">priem@technicum.ru</a>
                    </div>
                </div>
            </div>
            
            <div class="working-hours">
                <h3>🕒 Часы работы</h3>
                <p><strong>Приемная комиссия:</strong></p>
                <p>Пн-Пт: 9:00 - 18:00</p>
                <p>Сб: 10:00 - 15:00</p>
                <p>Вс: выходной</p>
            </div>
            
            <div class="info-block">
                <h2>🌐 Социальные сети</h2>
                <div class="contact-info">
                    <i>📘</i>
                    <a href="#" style="color:#667eea; text-decoration:none;">ВКонтакте: vk.com/technicum</a>
                </div>
                <div class="contact-info">
                    <i>📷</i>
                    <a href="#" style="color:#667eea; text-decoration:none;">Instagram: @technicum_official</a>
                </div>
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