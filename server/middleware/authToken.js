const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token non fourni.' });
    }
    jwt.verify(token, 'caca', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token invalide.' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;