const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const uuid = require('uuid/v4');
const Logger = require('../libs/logger');
const Middleware = require('../libs/middleware');
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

            case 'Unauthorized': {
                return Errors.Unauthorized;
            }

            default: {
                return Errors.InternalError;
            }
        }
    }

    before(req, res, next) {
        req.id = uuid();
        this.logger.debug(`Request has been received with ID [${req.id}]`, BaseController.resolveRequestData(req));

        next();
    }

    after(req, res, next) {
        this.logger.debug(`Response has been sent for ID [${req.id}]`, BaseController.resolveResponseData(res));

        next();
    }

    errorHandler(err, req, res, next) {
        this.logger.error(`Error caught for ID [${req.id}]`, err);
        const errorObject = this.resolveErrorCode(err.code);
        const { message, code } = errorObject;

        res.status(errorObject.status).json({
            message, code
        });
    }

    healthcheck(req, res, next) {
        res.status(200).send('The application is up and running');
        next();
    }

    setup() {
        // Module Middlewares
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cors(config.cors));
        this.app.use(fileUpload());
        // Custom Middlewares
        this.app.use(this.before.bind(this));
        this.app.get('/healthcheck', this.healthcheck.bind(this));
        this.app.use('/', this.resolveRoutes());
        this.app.use(this.errorHandler.bind(this));
        this.app.use(this.after.bind(this));

        return this;
    }

    resolveRoutes() {
        const router = express.Router();
        let url, method, controller, middlewares;
        Routes.apis.forEach((api) => {
            let endpoints = api.endpoints || [];

            if (api.crud) {
                const crudEndpoints = [];

                crudOperations.forEach((crudOperation) => {
                    // Skip actions
                    if (api.crud.exclude && api.crud.exclude.includes(crudOperation.action)) return false;

                    const operation = { ...crudOperation };
                    operation.middlewares = api.crud.middlewares;
                    if(api.crud.alias && operation.action in api.crud.alias){
                        // Rename action
                        operation.action = api.crud.alias[operation.action];
                    }

                    crudEndpoints.push(operation);
                });

                endpoints = endpoints.concat(crudEndpoints);
            }
            
            endpoints.forEach((endpoint) => {
                method = endpoint.method.toLowerCase();
                url = '/' + [Routes.base, api.base, endpoint.url].join('/').replace(/\/\//g, '/');
                controller = api.controller.split('-').map((word) => { return upperCaseFirstLetter(word) }).join('');
                if (controller.search('Controller') === -1) controller = controller + 'Controller';
                
                middlewares = (endpoint.middlewares || []).map((middleware) => {
                    const middlewareParts = middleware.split(':');
                    const middlewareName = middlewareParts[0];
                    const middlewareArguments = middlewareParts[1] ? middlewareParts[1].split(',') : [];

                    return Middleware[middlewareName].bind(null, middlewareArguments);
                });
                
                router[method](url, middlewares, BaseController.action(controller, endpoint.action));
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