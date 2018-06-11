const BaseController = require('../../libs/core/BaseController');

class AccountController extends BaseController {
    constructor() {
        super();

        BaseController.build(this, {
            service: ['AccountService', 'UserService']
        });
    }

    teste(req, res, next) {
        res.json('Teste');
        return next();
    }
}

module.exports = AccountController;