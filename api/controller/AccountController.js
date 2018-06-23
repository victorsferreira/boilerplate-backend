const BaseController = require('../../libs/core/BaseController');
const { redis, Session } = __LIBS;

class AccountController extends BaseController {
    constructor() {
        super();

        BaseController.build(this, {
            service: ['AccountService', 'UserService'],
            model: ['AccountModel']
        });
    }

    login(req, res, next) {
        Session.init()
            .then((token) => {
                res.status(200).json(token)
            });
    }

    logout(req, res, next) {
        Session.init()
            .then((token) => {
                res.status(200).json(token)
            });
    }

    open(req, res, next) {
        res.status(200).json({
            now: Date.now()
        });
    }

    protected(req, res, next) {
        res.status(200).json({
            now: Date.now()
        });
    }

    index(req, res, next) {
        const result = {};
        redis.set('somekey', { key: 'value' })
            .then(() => {
                return redis.get('somekey');
            })
            .then((data) => {
                result.data = data;
                return redis.del('somekey');
            })
            .then(() => {
                res.status(200).json(result.data);
            })
            .catch((error) => {
                this.logger.error(error);
            })
    }
}

module.exports = AccountController;