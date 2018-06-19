const Logger = require('./logger');
const JWT = require('./jwt');

const logger = new Logger('Middleware');

const config = __CONFIG;

class Middleware {
    static session(req, res, next) {
        
    }
}

module.exports = Middleware;