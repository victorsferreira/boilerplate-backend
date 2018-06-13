const Base = require('./Base');

class BaseController extends Base{
    constructor() {
        super();
    }

    static action(controllerClassName, methodName) {
        return (req, res, next) => {
            const EntityClass = Base.getEntityClass('controller', controllerClassName);
            const object = new EntityClass();
            object[methodName](req, res, next);
        }
    }
}

module.exports = BaseController;