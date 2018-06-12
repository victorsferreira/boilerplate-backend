const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(mongoose);
const Joi = require('joi');

const BaseModel = require('../../libs/core/BaseModel');

const schema = Joi.object({
    username: Joi.string().alphanum().required(),
    email: Joi.string().required().regex(/.{1,}@.{1,}\..{1,}/),
    password: Joi.string().required()
}, { collection: 'account' });

const model = Mongoose.model('Account', new Mongoose.Schema(Joigoose.convert(schema)));

class AccountModel extends BaseModel {
    constructor(){
        this.schema = schema;
        this.model = model;
    }
}

module.export = new AccountModel();