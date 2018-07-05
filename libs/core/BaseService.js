const Base = require('./Base');

class BaseService extends Base {
    constructor(moduleName) {
        super(moduleName);
    }

    resolveAllowedData(data, allowed) {
        const allowedData = {};
        allowed.forEach((key) => {
            allowedData[key] = data[key];
        });

        return allowedData;
    }
}

module.exports = BaseService;