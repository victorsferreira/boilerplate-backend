const Joi = require('joi');
const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, null, { _id: true, timestamps: false });

const Base = require('./Base');

class BaseModel extends Base {
    constructor(moduleName) {
        super(moduleName);

        this.schema = null;
        this.db = null;
    }

    setModel(modelName, schema) {
        this.schema = schema;
        this.db = Mongoose.model(modelName, new Mongoose.Schema(Joigoose.convert(schema)));
    }

    updateField(criteria, field, value) {
        if (typeof (criteria) !== 'object') criteria = { _id: criteria };
        const data = {};
        data[field] = value;

        return this.db.update(criteria, { $set: data });
    }

    updateFields(criteria, data) {
        if (typeof (criteria) !== 'object') criteria = { _id: criteria };
        return this.db.update(criteria, { $set: data });
    }

    create(data) {
        return this.db.create(data);
    }

    edit(id, data) {
        return this.db.update({ _id: id }, { $set: data });
    }

    permanentDelete(id) {
        return this.db.deleteOne({ _id: id });
    }

    softDelete(id) {
        return this.db.update({ _id: id }, { $set: { deleted: true } });
    }

    existsBy(field, value) {
        const criteria = {};
        criteria[field] = value;

        return this.db.findOne(criteria)
            .then((result) => {
                return !!result;
            });
    }

    find(criteria, from = 0, amount = 10) {
        return this.db.find({}).skip(from).limit(amount);
    }
}

BaseModel.Joi = Joi;

module.exports = BaseModel;