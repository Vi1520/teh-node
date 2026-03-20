const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
    let photosHtml = '';
    const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
    
    for (let i = 1; i <= 6; i++) {
        const fileName = `${i}.jpg`;
        const filePath = path.join(uploadDir, fileName);
        if (fs.existsSync(filePath)) {
            photosHtml += `<div class="main-gallery-item"><img src="/uploads/${fileName}" alt="Фото ${i}"><p>Техникум - фото ${i}</p></div>`;
        }
    }
    
    if (photosHtml === '') photosHtml = '<p>Фотографии не найдены</p>';
    
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Главная</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <nav style="background:#333; padding:1rem;">
        <div style="max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; gap:20px;">
                <a href="/" style="color:white; text-decoration:none; padding:5px 10px; background:#667eea; border-radius:5px;">Главная</a>
                <a href="/about" style="color:white; text-decoration:none; padding:5px 10px;">О техникуме</a>
                <a href="/students" style="color:white; text-decoration:none; padding:5px 10px;">Студенты</a>
                <a href="/teachers" style="color:white; text-decoration:none; padding:5px 10px;">Преподаватели</a>
                <a href="/contacts" style="color:white; text-decoration:none; padding:5px 10px;">Контакты</a>
            </div>
            <div>
                <a href="/auth/login" style="color:white; text-decoration:none; padding:8px 16px; background:#667eea; border-radius:5px; margin-right:10px;">Вход</a>
                <a href="/auth/register" style="color:white; text-decoration:none; padding:8px 16px; background:#28a745; border-radius:5px;">Регистрация</a>
            </div>
        </div>
    </nav>
    
    <div class="container">
        <h1>Добро пожаловать в Техникум</h1>
        <div class="main-gallery">${photosHtml}</div>
    </div>
    
    <footer style="text-align:center; padding:2rem; background:#333; color:white;">© 2026 Техникум</footer>
</body>
</html>
    `);
});

module.exports = router;