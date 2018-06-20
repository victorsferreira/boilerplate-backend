const jwt = require('jsonwebtoken');
const fs = require('fs');
const { session: config } = __CONFIG;

const algorithm = config.algorithm || 'RS256';
const ttl = config.ttl || '1h';
const secret = config.secret;
const privateKey = config.privateKey ? fs.readFileSync(config.privateKey) : null;
const secretOrPrivateKey = privateKey || secret;

class JWT {
    static create(data) {
        return new Promise((resolve, reject) => {
            const options = { expiresIn: ttl };
            if (privateKey) options.algorithm = algorithm;
            
            jwt.sign(data, secretOrPrivateKey, options, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
    }

    static validate(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretOrPrivateKey, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}

module.exports = JWT;