const BaseModel = require('../../libs/core/BaseModel');
const Joi = BaseModel.Joi;

const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    email: Joi.string().required().regex(/.{1,}@.{1,}\..{1,}/),
    password: Joi.string().required(),
    resetPasswordToken: Joi.string().allow(null).meta({ default: null }),
    resetPasswordTokenExpire: Joi.date().allow(null).meta({ default: null }),
    sellerInfo: Joi.object().default({}).meta({ default: {} }),
    userInfo: Joi.object().default({}).meta({ default: {} }),
    partnerInfo: Joi.object().default({}).meta({ default: {} })
});

class AccountModel extends BaseModel {
    constructor() {
        super();
        this.setModel('Account', schema);
    }

    create(username, email, password) {
        return this.model.create({
            username, email, password
        });
    }

    query(_from, _amount) {
        const from = parseInt(_from) || 0;
        const amount = parseInt(_amount) || 10;

        return this.model.find({}, from, amount);
    }
}

module.exports = new AccountModel();