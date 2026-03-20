const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Страница с преподавателями
router.get('/', (req, res) => {
    const isAdmin = req.session && req.session.role === 'admin';
    
    db.query('SELECT * FROM teachers ORDER BY id', (err, results) => {
        if (err) {
            console.error('Ошибка БД:', err);
            results = [];
        }
        
        // Генерируем строки таблицы
        let tableRows = '';
        results.forEach(teacher => {
            let actionButtons = '';
            if (isAdmin) {
                actionButtons = `
                    <button class="btn-view" onclick="viewTeacher(${teacher.id})">👁️</button>
                    <button class="btn-edit" onclick="editTeacher(${teacher.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteTeacher(${teacher.id})">🗑️</button>
                `;
            } else {
                actionButtons = `<button class="btn-view" onclick="viewTeacher(${teacher.id})">👁️</button>`;
            }
            
            tableRows += `
                <tr>
                    <td>${teacher.id}</td>
                    <td>
                        <img src="${teacher.photo || '/uploads/placeholder.jpg'}" 
                             class="teacher-photo" 
                             alt="Фото"
                             onclick="viewPhoto('${teacher.photo || '/uploads/placeholder.jpg'}', '${teacher.full_name}')">
                    </td>
                    <td>${teacher.full_name || ''}</td>
                    <td>${teacher.subject || ''}</td>
                    <td>${teacher.qualification || ''}</td>
                    <td>${teacher.experience || ''}</td>
                    <td>${teacher.email || ''}</td>
                    <td>${teacher.phone || ''}</td>
                    <td>${teacher.department || ''}</td>
                    <td>${actionButtons}</td>
                </tr>
            `;
        });

        const username = req.session.username || '';
        const userRole = req.session.role || '';
        const isLoggedIn = req.session.userId ? true : false;

        res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Преподаватели - Техникум</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .teacher-photo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            cursor: pointer;
            border: 2px solid #764ba2;
            transition: transform 0.3s ease;
        }
        .teacher-photo:hover {
            transform: scale(1.1);
        }
        .btn-view {
            background: #17a2b8;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        }
        .btn-view:hover {
            background: #138496;
        }
        .btn-edit {
            background: #ffc107;
            color: #333;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        }
        .btn-edit:hover {
            background: #e0a800;
        }
        .btn-delete {
            background: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        }
        .btn-delete:hover {
            background: #c82333;
        }
        .photo-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            text-align: center;
        }
        .photo-modal-content {
            margin: 50px auto;
            max-width: 800px;
            padding: 20px;
        }
        .photo-modal img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 10px;
            border: 3px solid white;
        }
        .photo-modal .close {
            color: white;
            font-size: 40px;
            position: absolute;
            top: 20px;
            right: 40px;
            cursor: pointer;
        }
        .photo-modal .close:hover {
            color: #764ba2;
        }
        .photo-caption {
            color: white;
            font-size: 20px;
            margin-top: 15px;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: white;
            margin: 50px auto;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
        }
        .modal-content input {
            width: 100%;
            padding: 8px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .modal-buttons {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }
        .btn-save {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            flex: 1;
        }
        .btn-cancel {
            background: #6c757d;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            flex: 1;
        }
        .btn-add {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            margin-bottom: 20px;
        }
        nav {
            background: #333;
            padding: 1rem;
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-links {
            display: flex;
            gap: 20px;
        }
        .nav-links a {
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .nav-links a:hover, .nav-links a.active {
            background: #667eea;
        }
        .nav-auth {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .nav-auth span {
            color: white;
        }
        .btn-login {
            background: #667eea;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
        }
        .btn-register {
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
        }
        .btn-logout {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
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
                <a href="/teachers" class="active">Преподаватели</a>
                <a href="/contacts">Контакты</a>
            </div>
            <div class="nav-auth">
                ${isLoggedIn ? `
                    <span>👤 ${username} (${userRole})</span>
                    <a href="/auth/logout" class="btn-logout">Выйти</a>
                ` : `
                    <a href="/auth/login" class="btn-login">Вход</a>
                    <a href="/auth/register" class="btn-register">Регистрация</a>
                `}
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="content">
            <h1>👨‍🏫 Управление преподавателями</h1>
            
            ${isAdmin ? '<button class="btn-add" onclick="showAddModal()">+ Добавить преподавателя</button>' : ''}
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Фото</th>
                            <th>ФИО</th>
                            <th>Предмет</th>
                            <th>Квалификация</th>
                            <th>Опыт</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Кафедра</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody id="teachers-table">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    ${isAdmin ? `
    <!-- Модальное окно для добавления/редактирования -->
    <div id="teacherModal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">Добавить преподавателя</h2>
            <input type="hidden" id="teacherId">
            <input type="text" id="fullName" placeholder="ФИО *" required>
            <input type="text" id="subject" placeholder="Предмет">
            <input type="text" id="qualification" placeholder="Квалификация">
            <input type="number" id="experience" placeholder="Опыт (лет)">
            <input type="email" id="email" placeholder="Email">
            <input type="text" id="phone" placeholder="Телефон">
            <input type="text" id="department" placeholder="Кафедра">
            <div>
                <label>Фото (URL):</label>
                <input type="text" id="photo" placeholder="/uploads/placeholder.jpg" value="/uploads/placeholder.jpg">
            </div>
            <div class="modal-buttons">
                <button class="btn-save" onclick="saveTeacher()">Сохранить</button>
                <button class="btn-cancel" onclick="closeModal()">Отмена</button>
            </div>
        </div>
    </div>
    ` : ''}

    <!-- Модальное окно для просмотра фото -->
    <div id="photoModal" class="photo-modal">
        <span class="close" onclick="closePhotoModal()">&times;</span>
        <div class="photo-modal-content">
            <img id="modalPhoto" src="" alt="Фото">
            <div id="modalPhotoCaption" class="photo-caption"></div>
        </div>
    </div>

    <footer>
        <p>© 2026 Техникум. Все права защищены.</p>
    </footer>

    <script>
        let currentEditId = null;
        const isAdmin = ${isAdmin};

        function viewPhoto(src, name) {
            document.getElementById('modalPhoto').src = src;
            document.getElementById('modalPhotoCaption').textContent = name;
            document.getElementById('photoModal').style.display = 'block';
        }

        function closePhotoModal() {
            document.getElementById('photoModal').style.display = 'none';
        }

        function viewTeacher(id) {
            window.location.href = '/teachers/view/' + id;
        }

        ${isAdmin ? `
        function showAddModal() {
            currentEditId = null;
            document.getElementById('modalTitle').textContent = 'Добавить преподавателя';
            document.getElementById('teacherId').value = '';
            document.getElementById('fullName').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('qualification').value = '';
            document.getElementById('experience').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('department').value = '';
            document.getElementById('photo').value = '/uploads/placeholder.jpg';
            document.getElementById('teacherModal').style.display = 'block';
        }

        function editTeacher(id) {
            currentEditId = id;
            fetch('/teachers/api/teachers/' + id)
                .then(res => res.json())
                .then(teacher => {
                    document.getElementById('modalTitle').textContent = 'Редактировать преподавателя';
                    document.getElementById('teacherId').value = teacher.id;
                    document.getElementById('fullName').value = teacher.full_name || '';
                    document.getElementById('subject').value = teacher.subject || '';
                    document.getElementById('qualification').value = teacher.qualification || '';
                    document.getElementById('experience').value = teacher.experience || '';
                    document.getElementById('email').value = teacher.email || '';
                    document.getElementById('phone').value = teacher.phone || '';
                    document.getElementById('department').value = teacher.department || '';
                    document.getElementById('photo').value = teacher.photo || '/uploads/placeholder.jpg';
                    document.getElementById('teacherModal').style.display = 'block';
                })
                .catch(error => {
                    alert('Ошибка загрузки данных');
                });
        }

        function saveTeacher() {
            const fullName = document.getElementById('fullName').value;
            const subject = document.getElementById('subject').value;
            const qualification = document.getElementById('qualification').value;
            const experience = document.getElementById('experience').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const department = document.getElementById('department').value;
            const photo = document.getElementById('photo').value || '/uploads/placeholder.jpg';

            if (!fullName) {
                alert('Поле ФИО обязательно');
                return;
            }

            const teacherData = {
                full_name: fullName,
                subject: subject || null,
                qualification: qualification || null,
                experience: experience ? parseInt(experience) : null,
                email: email || null,
                phone: phone || null,
                department: department || null,
                photo: photo
            };

            const id = document.getElementById('teacherId').value;
            const url = id ? '/teachers/api/teachers/' + id : '/teachers/api/teachers';
            const method = id ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(teacherData)
            })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Ошибка: ' + data.error);
                } else {
                    closeModal();
                    location.reload();
                }
            })
            .catch(error => {
                alert('Ошибка соединения');
            });
        }

        function deleteTeacher(id) {
            if (confirm('Вы уверены, что хотите удалить преподавателя?')) {
                fetch('/teachers/api/teachers/' + id, { method: 'DELETE' })
                    .then(res => res.json())
                    .then(data => {
                        if (data.error) {
                            alert('Ошибка: ' + data.error);
                        } else {
                            location.reload();
                        }
                    })
                    .catch(error => {
                        alert('Ошибка соединения');
                    });
            }
        }

        function closeModal() {
            document.getElementById('teacherModal').style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == document.getElementById('teacherModal')) {
                closeModal();
            }
            if (event.target == document.getElementById('photoModal')) {
                closePhotoModal();
            }
        }
        ` : ''}
    </script>
</body>
</html>
        `);
    });
});

// Страница просмотра преподавателя
router.get('/view/:id', (req, res) => {
    const teacherId = req.params.id;
    const username = req.session.username || '';
    const userRole = req.session.role || '';
    const isLoggedIn = req.session.userId ? true : false;
    
    db.query('SELECT * FROM teachers WHERE id = ?', [teacherId], (err, results) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).send('Ошибка базы данных');
        }
        if (results.length === 0) {
            return res.status(404).send('Преподаватель не найден');
        }
        
        const teacher = results[0];
        
        res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Просмотр преподавателя</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        nav {
            background: #333;
            padding: 1rem;
        }
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .nav-links {
            display: flex;
            gap: 20px;
        }
        .nav-links a {
            color: white;
            text-decoration: none;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .nav-links a:hover, .nav-links a.active {
            background: #667eea;
        }
        .nav-auth {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .nav-auth span {
            color: white;
        }
        .btn-login {
            background: #667eea;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
        }
        .btn-register {
            background: #28a745;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
        }
        .btn-logout {
            background: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 5px;
            text-decoration: none;
        }
        .view-container {
            max-width: 600px;
            margin: 30px auto;
            background: white;
            border-radius: 10px;
            padding: 30px;
        }
        .view-container p {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
        }
        .back-btn {
            display: inline-block;
            margin-bottom: 20px;
            padding: 8px 15px;
            background: #6c757d;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .teacher-photo-large {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #764ba2;
            margin: 20px auto;
            display: block;
            cursor: pointer;
        }
        .photo-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            text-align: center;
        }
        .photo-modal-content {
            margin: 50px auto;
            max-width: 800px;
            padding: 20px;
        }
        .photo-modal img {
            max-width: 100%;
            max-height: 70vh;
            border-radius: 10px;
            border: 3px solid white;
        }
        .photo-modal .close {
            color: white;
            font-size: 40px;
            position: absolute;
            top: 20px;
            right: 40px;
            cursor: pointer;
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
                <a href="/teachers" class="active">Преподаватели</a>
                <a href="/contacts">Контакты</a>
            </div>
            <div class="nav-auth">
                ${isLoggedIn ? `
                    <span>👤 ${username} (${userRole})</span>
                    <a href="/auth/logout" class="btn-logout">Выйти</a>
                ` : `
                    <a href="/auth/login" class="btn-login">Вход</a>
                    <a href="/auth/register" class="btn-register">Регистрация</a>
                `}
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="view-container">
            <a href="/teachers" class="back-btn">← Назад</a>
            <h2>Просмотр преподавателя</h2>
            
            <img src="${teacher.photo || '/uploads/placeholder.jpg'}" 
                 alt="Фото преподавателя" 
                 class="teacher-photo-large"
                 onclick="viewPhoto('${teacher.photo || '/uploads/placeholder.jpg'}', '${teacher.full_name}')">
            
            <p><strong>ID:</strong> ${teacher.id}</p>
            <p><strong>ФИО:</strong> ${teacher.full_name || 'Не указано'}</p>
            <p><strong>Предмет:</strong> ${teacher.subject || 'Не указан'}</p>
            <p><strong>Квалификация:</strong> ${teacher.qualification || 'Не указана'}</p>
            <p><strong>Опыт:</strong> ${teacher.experience ? teacher.experience + ' лет' : 'Не указан'}</p>
            <p><strong>Email:</strong> ${teacher.email || 'Не указан'}</p>
            <p><strong>Телефон:</strong> ${teacher.phone || 'Не указан'}</p>
            <p><strong>Кафедра:</strong> ${teacher.department || 'Не указана'}</p>
        </div>
    </div>

    <div id="photoModal" class="photo-modal">
        <span class="close" onclick="closePhotoModal()">&times;</span>
        <div class="photo-modal-content">
            <img id="modalPhoto" src="" alt="Фото">
            <div id="modalPhotoCaption" class="photo-caption"></div>
        </div>
    </div>

    <footer>
        <p>© 2026 Техникум. Все права защищены.</p>
    </footer>

    <script>
        function viewPhoto(src, name) {
            document.getElementById('modalPhoto').src = src;
            document.getElementById('modalPhotoCaption').textContent = name;
            document.getElementById('photoModal').style.display = 'block';
        }
        function closePhotoModal() {
            document.getElementById('photoModal').style.display = 'none';
        }
        window.onclick = function(event) {
            if (event.target == document.getElementById('photoModal')) {
                closePhotoModal();
            }
        }
    </script>
</body>
</html>
        `);
    });
});

// API для работы с преподавателями
router.get('/api/teachers/:id', (req, res) => {
    db.query('SELECT * FROM teachers WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Не найдено' });
        res.json(results[0]);
    });
});

router.post('/api/teachers', auth.isAuthenticated, auth.canModify, (req, res) => {
    const { full_name, subject, qualification, experience, email, phone, department, photo } = req.body;
    db.query(
        'INSERT INTO teachers (full_name, subject, qualification, experience, email, phone, department, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [full_name, subject, qualification, experience, email, phone, department, photo || '/uploads/placeholder.jpg'],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Добавлено', id: result.insertId });
        }
    );
});

router.put('/api/teachers/:id', auth.isAuthenticated, auth.canModify, (req, res) => {
    const { full_name, subject, qualification, experience, email, phone, department, photo } = req.body;
    db.query(
        'UPDATE teachers SET full_name=?, subject=?, qualification=?, experience=?, email=?, phone=?, department=?, photo=? WHERE id=?',
        [full_name, subject, qualification, experience, email, phone, department, photo || '/uploads/placeholder.jpg', req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Обновлено' });
        }
    );
});

router.delete('/api/teachers/:id', auth.isAuthenticated, auth.canModify, (req, res) => {
    db.query('DELETE FROM teachers WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Удалено' });
    });
});

module.exports = router;