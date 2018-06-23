const BaseModel = require('../../libs/core/BaseModel');
const Joi = BaseModel.Joi;

const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    email: Joi.string().required().regex(/.{1,}@.{1,}\..{1,}/),
    password: Joi.string().required(),
    resetPasswordToken: Joi.string().default(""),
    sellerInfo: Joi.object().meta({ default: {} }),
    userInfo: Joi.object().meta({ default: {} }),
    partnerInfo: Joi.object().meta({ default: {} })
});

class AccountModel extends BaseModel {
    constructor() {
        super();
        this.setModel('Account', schema);
    }

    query(_from, _amount) {
        const from = parseInt(_from) || 0;
        const amount = parseInt(_amount) || 10;

        return this.find({}, from, amount);
    }
}

module.exports = new AccountModel();