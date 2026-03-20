-- Создание базы данных
CREATE DATABASE IF NOT EXISTS technicum;
USE technicum;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица фотографий
CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    filename VARCHAR(255) NOT NULL,
    description TEXT,
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Добавление тестового администратора (пароль: admin123)
INSERT INTO users (username, password, email, role) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere', 'admin@technicum.ru', 'admin')
ON DUPLICATE KEY UPDATE username=username;
