const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'laravel',
    password: 'Gj5zxs2o',
    database: 'technicum'
});

db.connect();

// Проверяем пользователя admin2
db.query('SELECT * FROM users WHERE username = ?', ['admin2'], (err, results) => {
    if (err) throw err;
    
    if (results.length > 0) {
        const user = results[0];
        console.log('Найден пользователь:');
        console.log('ID:', user.id);
        console.log('Username:', user.username);
        console.log('Role:', user.role);
        console.log('Хеш пароля из БД:', user.password);
        
        // Проверяем пароль
        const testPassword = 'admin123';
        const isValid = bcrypt.compareSync(testPassword, user.password);
        console.log('Пароль admin123 подходит?', isValid);
    } else {
        console.log('Пользователь admin2 не найден');
    }
    
    db.end();
});