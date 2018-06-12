const BaseController = require('../../libs/core/BaseController');

class AccountController extends BaseController {
    constructor() {
        super();

        BaseController.build(this, {
            service: ['AccountService', 'UserService']
        });
    }

    index(req, res, next) {
        res.status(200).json({message: 'success'});
        return next();
    }
}

module.exports = AccountController;