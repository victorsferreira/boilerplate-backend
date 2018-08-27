const Logger = require('./logger');
const JWT = require('./jwt');
const Session = require('./session');
const Uploader = require('./uploader');

const logger = new Logger('Middleware');

const config = __CONFIG;

class Middleware {
    static sessionProtected(allowedTypes, req, res, next) {
        if (!allowedTypes.length) allowedTypes = null;
        Session.protect(allowedTypes, req, res, next);
    }

    static accountBound(args, req, res, next) {
        req.args.accountBound = true;
        next();
    }

    static withArgs(args, req, res, next) {
        req.args = { ...req.args, ...args };
        next();
    }
}

module.exports = Middleware;