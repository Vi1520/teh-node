const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Используем pool вместо одного соединения
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'laravel',
    password: process.env.DB_PASSWORD || 'Gj5zxs2o',
    database: process.env.DB_NAME || 'technicum',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000 // 10 секунд таймаут
});

// Экспортируем pool с поддержкой промисов
const promisePool = pool.promise();

// Проверяем подключение при старте
promisePool.getConnection()
    .then(connection => {
        console.log('✅ MySQL подключен к Railway!');
        console.log('📁 База данных:', process.env.DB_NAME);
        connection.release();
    })
    .catch(err => {
        console.log('\n❌ ОШИБКА ПОДКЛЮЧЕНИЯ К БД:');
        console.log('Хост:', process.env.DB_HOST);
        console.log('Пользователь:', process.env.DB_USER);
        console.log('База:', process.env.DB_NAME);
        console.log('\nОшибка:', err.message);
    });

module.exports = promisePool;