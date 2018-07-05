const uuid = require('uuid/v4');
const redis = require('./redis');
const JWT = require('./jwt');
const Logger = require('./logger');
const { isEmpty } = require('./helpers');

const config = __CONFIG;

const logger = new Logger('Session');

class Session {
    constructor(id, token) {
        this.logger = new Logger('Session');
        this.config = config.session;
        this.defaultTtl = 60 * 60; //
        this.redis = redis;
        this.id = id;
        this.token = token;
        this.data = {};

        this.empty = true;
        this.uninitialized = true;
        this.active = false;

        this.setInactive();
    }

    static init(data = {}) {
        const sessionId = uuid();

        return redis.set(Session.getRedisKey(sessionId), data)
            .then((result) => {
                return JWT.create({ sessionId });
            })
            .catch((error) => {
                logger.error('There was an error starting a new session', { error });
                throw error;
            });
    }

    static protect(req, res, next) {
        if ('authorization' in req.headers) {
            const authorization = req.headers['authorization'].split(' ');
            const token = authorization[1];

            if (authorization[0].toLowerCase() === 'bearer' && token) {
                JWT.validate(token)
                    .then((data) => {
                        const session = new Session(data.sessionId, token);
                        return session.load()
                            .then(() => {
                                if (session.isActive()) {
                                    req.session = session;
                                    next();
                                } else {
                                    // Session is anactive
                                    const error = new Error(err);
                                    error.code = 'Unauthorized';
                                    next(error);
                                }
                            })
                            .catch((err) => {
                                // A problem loading the session
                                const error = new Error(err);
                                error.code = 'InternalError';
                                next(error);
                            });
                    })
                    .catch((err) => {
                        // JWT expired or invalid
                        const error = new Error(err);
                        error.code = 'Unauthorized';
                        next(error);
                    });
            } else {
                // Didn't send a well-formated bearer
                const error = new Error(err);
                error.code = 'BadRequest';
                next(error);
            }
        } else {
            // There is no 'Authorization' header
            const error = new Error(err);
            error.code = 'Unauthorized';
            next(error);
        }
    }

    static start(resolveId) {
        return (req, res, next) => {
            const id = resolveId(req);
            const session = new Session(id);
            req.session = session;

            req.on('close', () => {
                if (session.isActive()) session.update();
            });

            next();
        };
    }

    update() {
        return this.redis.set(Session.getRedisKey(this.id), this.data);
    }

    destroy() {
        return this.redis.del(Session.getRedisKey(this.id))
            .then(() => {
                this.setInactive();
                this.setEmpty();
            })
    }

    load() {
        return this.redis.get(Session.getRedisKey(this.id))
            .then((data) => {
                if (data) {
                    this.data = data;

                    this.setActive();
                    this.setUninitialized(false);
                    this.setEmpty(isEmpty(data));
                } else {
                    this.setUninitialized();
                }
            });
    }

    setInactive() {
        this.active = false;
    }

    setActive() {
        this.active = true;
    }

    setEmpty(value = true) {
        this.empty = value;
    }

    setUninitialized(value = true) {
        this.uninitialized = value;
    }

    isInactive() {
        return !this.active;
    }

    isActive() {
        return this.active;
    }

    isEmpty() {
        return this.empty;
    }

    isUninitialized() {
        this.uninitialized;
    }

    has(key) {
        return Promise.resolve(key in this.data);
    }

    get(key) {
        return Promise.resolve(this.data[key]);
    }

    set(key, value) {
        this.data[key] = value;
        return Promise.resolve(this.data);
    }

    del(key) {
        delete this.data[key];
        return Promise.resolve(this.data);
    }

    static getRedisKey(sessionId) {
        return `session-${sessionId}`;
    }
}

module.exports = Session;