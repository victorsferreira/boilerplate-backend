const Base = require('./Base');
const Logger = require('../logger');
const logger = new Logger('BaseController');
const queryString = require('query-string');

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
            object.req = req;
            object.res = res;

            if (methodName in object) object[methodName](req, res, next);
            else {
                const error = new Error(`An action method was not found [${controllerClassName}] [${methodName}]`);
                logger.error(error.message);
                next(error);
            }
        };
    }

    // INPUTS
    cleanInputFields(req, allowedFields = {}) {
        const fields = {};

        for (let input in allowedFields) {
            fields[input] = {};

            if (!req[input]) continue;

            const allowedInputFields = allowedFields[input];
            allowedInputFields.forEach((fieldName) => {
                fields[input][fieldName] = req[input][fieldName] || null;
            });
        }

        return fields;
    }

    resolveCrudInput(req, data) {
        if (req.args.accountBound) data.account = req.session.data.id;
        if (req.args.type) data.type = req.args.type;

        return data;
    }

    resolveMetaInputs(params) {
        const { amount } = params || 10;
        const { from } = params || 0;
        const fields = queryString.parse(params.fields);
        const query = queryString.parse(params.query);
        const page = from * amount;
        let { sort: _sort } = params;
        if (_sort) {
            const sort = {};
            _sort = _sort.split(',');
            _sort.forEach((sortItem) => {
                if (sortItem.charAt(0) === '-') {
                    sort[sortItem.substring(1)] = -1;
                } else {
                    sort[sortItem] = 1;
                }
            });
        }

        return { fields, query, page, amount, sort, from };
    }
 
    // CRUD
    delete(req, res, next) {
        const { id } = req.params;
        this.service.delete(id)
            .then((result) => {
                res.status(204).end();
            })
            .catch((err) => {
                next(err);
            });
    }

    edit(req, res, next) {
        const { id } = req.params;
        const inputFields = this.cleanInputFields(req, this.allowedFields.edit);
        const data = this.resolveCrudInput(req, inputFields.body);

        this.service.edit(id, data, inputFields.files)
            .then((item) => {
                res.status(200).json(item);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    create(req, res, next) {
        const inputFields = this.cleanInputFields(req, this.allowedFields.create);
        const data = this.resolveCrudInput(req, inputFields.body);

        this.service.create(data, inputFields.files)
            .then((item) => {
                res.status(200).json(item);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    show(req, res, next) {
        const { id } = req.params;

        return this.service.show(id)
            .then((item) => {
                res.status(200).json(item);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    profile(req, res, next) {
        const { id } = req.params;

        return this.service.show(id)
            .then((item) => {
                res.status(200).json(item);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    list(req, res, next) {
        const data = this.resolveCrudInput(req, req.body);
        const meta = this.resolveMetaInputs(req);

        return this.service.list(data, meta)
            .then((items) => {
                res.status(200).json(items);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }

    all(req, res, next) {
        const data = this.resolveCrudInput(req, req.body);
        const meta = this.resolveMetaInputs(req);

        return this.service.list(data, meta)
            .then((items) => {
                res.status(200).json(items);
                next();
            })
            .catch((err) => {
                next(err);
            });
    }
}

module.exports = BaseController;