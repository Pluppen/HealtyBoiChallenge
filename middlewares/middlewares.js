const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../utils/jwtUtils');

module.exports = {
    testMode: function (req, res, next) {
        req.session.accountId = 0;
        next();
    },
    requireLoggedIn: function (req, res, next) {
        const authHeader = req.headers.authorization;

        if (req.url == "/account" || req.url == "/login") {
            next();
            return;
        }

        if (authHeader) {
            const token = authHeader.split(' ')[1];

            jwt.verify(token, jwtSecret, (err, payload) => {
                if (err) {
                    return res.status(403).json({
                        success: false,
                        message: 'Invalid token'
                    });
                } else {
                    req.user = payload;
                    next();
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Token is not provided'
            });
        }
    },
};
