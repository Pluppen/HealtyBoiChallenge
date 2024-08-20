const jwt = require('jsonwebtoken');

const jwtSecret = 'asdasdasdasd';

const generateToken = (payload) => {
    const secretKey = jwtSecret;
    const options = {
        expiresIn: '4h',
    };

    const token = jwt.sign(payload, secretKey, options);
    return token;
}

module.exports = {
    generateToken,
    jwtSecret
}
