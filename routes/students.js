const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const router = express.Router();

// Страница со студентами
router.get('/', (req, res) => {
    const isAdmin = req.session && req.session.role === 'admin';
    
    db.query('SELECT * FROM students ORDER BY id', (err, results) => {
        if (err) {
            console.error('Ошибка БД:', err);
            results = [];
        }
        
        // Генерируем строки таблицы
        let tableRows = '';
        results.forEach(student => {
            let actionButtons = '';
            if (isAdmin) {
                actionButtons = `
                    <button class="btn-view" onclick="viewStudent(${student.id})">👁️</button>
                    <button class="btn-edit" onclick="editStudent(${student.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteStudent(${student.id})">🗑️</button>
                `;
            } else {
                actionButtons = `<button class="btn-view" onclick="viewStudent(${student.id})">👁️</button>`;
            }
            
            tableRows += `
                <tr>
                    <td>${student.id}</td>
                    <td>
                        <img src="${student.photo || '/uploads/placeholder.jpg'}" 
                             class="student-photo" 
                             alt="Фото"
                             onclick="viewPhoto('${student.photo || '/uploads/placeholder.jpg'}', '${student.full_name}')">
                    </td>
                    <td>${student.full_name || ''}</td>
                    <td>${student.group_name || ''}</td>
                    <td>${student.course || ''}</td>
                    <td>${student.email || ''}</td>
                    <td>${student.phone || ''}</td>
                    <td>${student.enrollment_year || ''}</td>
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
    <title>Студенты - Техникум</title>
    <link rel="stylesheet" href="/css/style.css">
    <style>
        .student-photo {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            cursor: pointer;
            border: 2px solid #667eea;
            transition: transform 0.3s ease;
        }
        .student-photo:hover {
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
            color: #667eea;
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
                <a href="/students" class="active">Студенты</a>
                <a href="/teachers">Преподаватели</a>
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
            <h1>👨‍🎓 Управление студентами</h1>
            
            ${isAdmin ? '<button class="btn-add" onclick="showAddModal()">+ Добавить студента</button>' : ''}
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Фото</th>
                            <th>ФИО</th>
                            <th>Группа</th>
                            <th>Курс</th>
                            <th>Email</th>
                            <th>Телефон</th>
                            <th>Год пост.</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody id="students-table">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    ${isAdmin ? `
    <!-- Модальное окно для добавления/редактирования -->
    <div id="studentModal" class="modal">
        <div class="modal-content">
            <h2 id="modalTitle">Добавить студента</h2>
            <input type="hidden" id="studentId">
            <input type="text" id="fullName" placeholder="ФИО *" required>
            <input type="text" id="groupName" placeholder="Группа">
            <input type="number" id="course" placeholder="Курс">
            <input type="email" id="email" placeholder="Email">
            <input type="text" id="phone" placeholder="Телефон">
            <input type="number" id="enrollmentYear" placeholder="Год поступления">
            <div>
                <label>Фото (URL):</label>
                <input type="text" id="photo" placeholder="/uploads/placeholder.jpg" value="/uploads/placeholder.jpg">
            </div>
            <div class="modal-buttons">
                <button class="btn-save" onclick="saveStudent()">Сохранить</button>
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

        function viewStudent(id) {
            window.location.href = '/students/view/' + id;
        }

        ${isAdmin ? `
        function showAddModal() {
            currentEditId = null;
            document.getElementById('modalTitle').textContent = 'Добавить студента';
            document.getElementById('studentId').value = '';
            document.getElementById('fullName').value = '';
            document.getElementById('groupName').value = '';
            document.getElementById('course').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('enrollmentYear').value = '';
            document.getElementById('photo').value = '/uploads/placeholder.jpg';
            document.getElementById('studentModal').style.display = 'block';
        }

        function editStudent(id) {
            currentEditId = id;
            fetch('/students/api/students/' + id)
                .then(res => res.json())
                .then(student => {
                    document.getElementById('modalTitle').textContent = 'Редактировать студента';
                    document.getElementById('studentId').value = student.id;
                    document.getElementById('fullName').value = student.full_name || '';
                    document.getElementById('groupName').value = student.group_name || '';
                    document.getElementById('course').value = student.course || '';
                    document.getElementById('email').value = student.email || '';
                    document.getElementById('phone').value = student.phone || '';
                    document.getElementById('enrollmentYear').value = student.enrollment_year || '';
                    document.getElementById('photo').value = student.photo || '/uploads/placeholder.jpg';
                    document.getElementById('studentModal').style.display = 'block';
                })
                .catch(error => {
                    alert('Ошибка загрузки данных');
                });
        }

        function saveStudent() {
            const studentData = {
                full_name: document.getElementById('fullName').value,
                group_name: document.getElementById('groupName').value,
                course: document.getElementById('course').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                enrollment_year: document.getElementById('enrollmentYear').value,
                photo: document.getElementById('photo').value || '/uploads/placeholder.jpg'
            };

            if (!studentData.full_name) {
                alert('Поле ФИО обязательно');
                return;
            }

            const id = document.getElementById('studentId').value;
            const url = id ? '/students/api/students/' + id : '/students/api/students';
            const method = id ? 'PUT' : 'POST';

            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
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

        function deleteStudent(id) {
            if (confirm('Вы уверены, что хотите удалить студента?')) {
                fetch('/students/api/students/' + id, { method: 'DELETE' })
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
            document.getElementById('studentModal').style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == document.getElementById('studentModal')) {
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

// Страница просмотра студента
router.get('/view/:id', (req, res) => {
    const studentId = req.params.id;
    const isAdmin = req.session && req.session.role === 'admin';
    const username = req.session.username || '';
    const userRole = req.session.role || '';
    const isLoggedIn = req.session.userId ? true : false;
    
    db.query('SELECT * FROM students WHERE id = ?', [studentId], (err, results) => {
        if (err) {
            console.error('Ошибка БД:', err);
            return res.status(500).send('Ошибка базы данных');
        }
        if (results.length === 0) {
            return res.status(404).send('Студент не найден');
        }
        
        const student = results[0];
        
        res.send(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Просмотр студента</title>
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
        .student-photo-large {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #667eea;
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
                <a href="/students" class="active">Студенты</a>
                <a href="/teachers">Преподаватели</a>
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
            <a href="/students" class="back-btn">← Назад</a>
            <h2>Просмотр студента</h2>
            
            <img src="${student.photo || '/uploads/placeholder.jpg'}" 
                 alt="Фото студента" 
                 class="student-photo-large"
                 onclick="viewPhoto('${student.photo || '/uploads/placeholder.jpg'}', '${student.full_name}')">
            
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>ФИО:</strong> ${student.full_name || 'Не указано'}</p>
            <p><strong>Группа:</strong> ${student.group_name || 'Не указана'}</p>
            <p><strong>Курс:</strong> ${student.course || 'Не указан'}</p>
            <p><strong>Email:</strong> ${student.email || 'Не указан'}</p>
            <p><strong>Телефон:</strong> ${student.phone || 'Не указан'}</p>
            <p><strong>Год поступления:</strong> ${student.enrollment_year || 'Не указан'}</p>
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

// API для работы со студентами
router.get('/api/students/:id', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM students WHERE id = ?', [req.params.id]);
        if (results.length === 0) return res.status(404).json({ error: 'Не найдено' });
        res.json(results[0]);
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/students', auth.isAuthenticated, auth.canModify, async (req, res) => {
    const { full_name, group_name, course, email, phone, enrollment_year, photo } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO students (full_name, group_name, course, email, phone, enrollment_year, photo) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [full_name, group_name, course, email, phone, enrollment_year, photo || '/uploads/placeholder.jpg']
        );
        res.json({ message: 'Добавлено', id: result.insertId });
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/api/students/:id', auth.isAuthenticated, auth.canModify, async (req, res) => {
    const { full_name, group_name, course, email, phone, enrollment_year, photo } = req.body;
    
    try {
        await db.query(
            'UPDATE students SET full_name=?, group_name=?, course=?, email=?, phone=?, enrollment_year=?, photo=? WHERE id=?',
            [full_name, group_name, course, email, phone, enrollment_year, photo || '/uploads/placeholder.jpg', req.params.id]
        );
        res.json({ message: 'Обновлено' });
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).json({ error: err.message });
    }
});

router.delete('/api/students/:id', auth.isAuthenticated, auth.canModify, async (req, res) => {
    try {
        await db.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ message: 'Удалено' });
    } catch (err) {
        console.error('Ошибка БД:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;