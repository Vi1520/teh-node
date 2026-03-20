const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// Импорт маршрутов
const indexRoutes = require('./routes/index');
const aboutRoutes = require('./routes/about');
const contactsRoutes = require('./routes/contacts');
const studentsRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Сессии
app.use(session({
    secret: process.env.SESSION_SECRET || 'technicum-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 3600000
    }
}));

// Подключение маршрутов - ВАЖЕН ПОРЯДОК!
app.use('/about', aboutRoutes);
app.use('/contacts', contactsRoutes);
app.use('/students', studentsRoutes);
app.use('/teachers', teachersRoutes);
app.use('/auth', authRoutes);
app.use('/', indexRoutes); // это должно быть ПОСЛЕДНИМ

// Обработка 404
app.use((req, res) => {
    res.status(404).send('Страница не найдена');
});

module.exports = app;