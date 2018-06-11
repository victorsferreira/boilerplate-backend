const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const uuid = require('uuid/v4');
const Log = require('../libs/log');

const config = _CONFIG;

class Server {
    constructor() {
        this.log = new Log('Server');
        this.app = express();
    }

    resolveRequestData(req) {
        return {
            method: req.method || '',
            url: req.url || '',
            params: req.params || {},
            query: req.query || {},
            body: req.body || {},
            headers: req.headers || {}
        };
    }

    resolveResponseData(res) {
        return {
            body: res._body || {},
            headers: res._headers || {},
            status: res.statusCode || null
        };
    }

    before(req, res, next) {
        req.id = uuid();
        this.log.debug(`Request has been received with ID [${req.id}]`, this.resolveRequestData(req));

        next();
    }

    after(req, res, next) {
        this.log.debug(`Response has been sent for ID [${req.id}]`, this.resolveResponseData(res));

        next();
    }

    errorHandler(err, req, res, next) {
        this.log.error(`Error caught for ID [${req.id}]`, err);
        next();
    }

    setup() {
        // Module Middlewares
        this.app.use(bodyParser.json());
        this.app.use(cors());
        // Custom Middlewares
        this.app.use(this.errorHandler.bind(this));
        this.app.use(this.before.bind(this));
        this.app.use('/', routes);
        this.app.use(this.after.bind(this));

        return this;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.app.listen(config.port, () => {
                    this.log.debug(`Server initialized on port [${config.port}]`);
                    resolve(this.app);
                });
            } catch (e) {
                this.log.error(`Server could not be initialized on port [${config.port}]`);
                reject(e);
            }
        });
    }
}

module.exports = new Server();