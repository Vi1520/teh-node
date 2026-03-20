module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session && req.session.userId) {
            return next();
        }
        res.status(401).json({ error: 'Требуется авторизация' });
    },
    
    isAdmin: (req, res, next) => {
        if (req.session && req.session.role === 'admin') {
            return next();
        }
        res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
    },
    
    canModify: (req, res, next) => {
        if (req.session && req.session.role === 'admin') {
            return next();
        }
        res.status(403).json({ error: 'Доступ запрещен. Только администратор может изменять данные' });
    }
};