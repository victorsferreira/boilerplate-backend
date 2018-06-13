const BaseController = require('../../libs/core/BaseController');

class AccountController extends BaseController {
    constructor() {
        super();

        BaseController.build(this, {
            service: ['AccountService', 'UserService'],
            model: ['AccountModel']
        });
    }

    index(req, res, next) {
        return this.accountModel.query(req.query.from, req.query.amount)
            .then((result) => {
                res.status(200).json({ result });

                return next();
            });
    }
}

module.exports = AccountController;