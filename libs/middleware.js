const Logger = require('./logger');
const JWT = require('./jwt');
const Session = require('./session');

const logger = new Logger('Middleware');

const config = __CONFIG;

class Middleware {
    static sessionProtected(req, res, next) {
        Session.protect(req, res, next);
    }
}

module.exports = Middleware;