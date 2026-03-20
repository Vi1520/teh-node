const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'laravel',
    password: process.env.DB_PASSWORD || 'Gj5zxs2o',
    database: process.env.DB_NAME || 'technicum'
});

db.connect(err => {
    if (err) {
        console.log('\n❌ ОШИБКА ПОДКЛЮЧЕНИЯ К БД:');
        console.log('Пользователь: laravel');
        console.log('Пароль: Gj5zxs2o');
        console.log('База: technicum');
        console.log('\nОшибка:', err.message);
    } else {
        console.log('✅ MySQL подключен (пользователь: laravel)');
        console.log('📁 База данных:', process.env.DB_NAME);
    }
});

module.exports = db;