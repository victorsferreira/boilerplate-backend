const Joi = require('joi');
const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, null, { _id: false, timestamps: false });

const Base = require('./Base');

class BaseModel extends Base {
    constructor() {
        super();

        this.schema = null;
        this.model = null;
    }

    setModel(modelName, schema) {
        this.schema = schema;
        this.model = Mongoose.model(modelName, new Mongoose.Schema(Joigoose.convert(schema)));
    }

    find(criteria, from, amount) {
        return this.model.find({}).skip(from).limit(amount);
    }
}

BaseModel.Joi = Joi;

module.exports = BaseModel;