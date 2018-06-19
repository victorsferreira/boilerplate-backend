const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');
const Logger = require('../libs/logger');
const { upperCaseFirstLetter } = require('../libs/helpers');
const BaseController = require('../libs/core/BaseController');
const Routes = require('./routes');
const Errors = require('./errors');

const config = __CONFIG;

class Server {
    constructor() {
        this.logger = new Logger('Server');
        this.app = express();
    }

    resolveErrorCode(errorCode) {
        switch (errorCode) {
            case 'InternalError': {
                return Errors.InternalError;
            }

            case 'NotFound': {
                return Errors.NotFound;
            }

            default: {
                return Errors.InternalError;
            }
        }
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
        this.logger.debug(`Request has been received with ID [${req.id}]`, this.resolveRequestData(req));

        next();
    }

    after(req, res, next) {
        this.logger.debug(`Response has been sent for ID [${req.id}]`, this.resolveResponseData(res));

        next();
    }

    errorHandler(err, req, res, next) {
        this.logger.error(`Error caught for ID [${req.id}]`, err);
        const errorObject = this.resolveErrorCode(err.errorCode);
        const { message, code } = errorObject;

        res.status(errorObject.status).json({
            message, code
        });
    }

    routes(){
        const Session = require('../libs/session');
        this.app.use(Session.start((req) => {
            return req.headers['authorization']
        }));

        this.app.get('/api/account/protected', Session.protect, BaseController.action('AccountController', 'protected'));
    }

    setup() {
        // Module Middlewares
        this.app.use(bodyParser.json());
        this.app.use(cors('*'));
        // Custom Middlewares
        this.app.use(this.before.bind(this));
        this.app.use('/', this.resolveRoutes());
        this.routes();
        this.app.use(this.errorHandler.bind(this));
        this.app.use(this.after.bind(this));

        return this;
    }

    resolveRoutes() {
        const router = express.Router();
        let url, method, controller;
        Routes.apis.forEach((api) => {
            api.endpoints.forEach((endpoint) => {
                method = endpoint.method.toLowerCase();
                url = '/' + [Routes.base, api.base, endpoint.url].join('/').replace(/\/\//g, '/');
                controller = api.controller.split('-').map((word) => { return upperCaseFirstLetter(word) }).join('');
                if (controller.search('Controller') === -1) controller = controller + 'Controller';
                router[method](url, BaseController.action(controller, endpoint.action));
                this.logger.debug(`A new route has been defined as [${method.toUpperCase()}] [${url}] [${controller}]#[${endpoint.action}]`);
            });
        });

        return router;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.app.listen(config.port, () => {
                    this.logger.debug(`Server initialized on port [${config.port}]`);
                    resolve(this.app);
                });
            } catch (e) {
                this.logger.error(`Server could not be initialized on port [${config.port}]`);
                reject(e);
            }
        });
    }
}

module.exports = new Server();