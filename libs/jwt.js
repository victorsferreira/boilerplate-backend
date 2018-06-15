const jwt = require('jsonwebtoken');
const config = _CONFIG;

const algorithm = config.session.algorithm || 'RS256';
const ttl = config.session.ttl || '1h';
const secret = config.session.secret || Date.now();

class JWT {
    static create(data) {
        return new Promise((reject, resolve) => {
            jwt.sign(data, this.secret, { expiresIn: this.ttl, algorithm: this.algorithm }, (err, token) => {
                if (err) reject(err);
                else resolve(token);
            });
        });
    }

    static validate(token) {
        return new Promise((reject, resolve) => {
            jwt.verify(token, this.secret, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    }
}

module.exports = JWT;