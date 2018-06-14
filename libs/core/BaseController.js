const Base = require('./Base');
const Logger = require('../logger');
const logger = new Logger('BaseController');

class BaseController extends Base {
    constructor(moduleName) {
        super(moduleName);
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
}

module.exports = BaseController;