const Base = require('./Base');
const Logger = require('../logger');
const logger = new Logger('BaseController');

class BaseController extends Base {
    constructor(moduleName) {
        super(moduleName);
    }

    static resolveRequestData(req) {
        return {
            method: req.method || '',
            url: req.url || '',
            params: req.params || {},
            query: req.query || {},
            body: req.body || {},
            headers: req.headers || {}
        };
    }

    static resolveResponseData(res) {
        return {
            body: res._body || {},
            headers: res._headers || {},
            status: res.statusCode || null
        };
    }

    static action(controllerClassName, methodName) {
        return (req, res, next) => {
            const EntityClass = Base.getEntityClass('controller', controllerClassName);
            const object = new EntityClass();
            if (methodName in object) object[methodName](req, res, next);
            else {
                const error = new Error(`An action method was not found [${controllerClassName}] [${methodName}]`);
                logger.error(error.message);
                next(error);
            }
        };
    }

    showHandler(promise){}
    listHandler(promise){}
    createHandler(promise){}
    editHandler(promise){}
    deleteHandler(promise){}
}

module.exports = BaseController;