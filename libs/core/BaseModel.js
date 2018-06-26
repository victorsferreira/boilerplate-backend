const Joi = require('joi');
const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, null, { _id: true, timestamps: false });

const Base = require('./Base');

class BaseModel extends Base {
    constructor(moduleName) {
        super(moduleName);

        this.schema = null;
        this.model = null;
    }

    setModel(modelName, schema) {
        this.schema = schema;
        this.model = Mongoose.model(modelName, new Mongoose.Schema(Joigoose.convert(schema)));
    }

    updateField(criteria, field, value) {
        if (typeof (criteria) !== 'object') criteria = { _id: criteria };
        const data = {};
        data[field] = value;

        return this.model.update(criteria, { $set: data });
    }

    updateFields(criteria, data) {
        if (typeof (criteria) !== 'object') criteria = { _id: criteria };
        return this.model.update(criteria, { $set: data });
    }

    existsBy(field, value) {
        const criteria = {};
        criteria[field] = value;

        return this.model.findOne(criteria)
            .then((result) => {
                return !!result;
            });
    }

    find(criteria, from, amount) {
        return this.model.find({}).skip(from).limit(amount);
    }
}

BaseModel.Joi = Joi;

module.exports = BaseModel;