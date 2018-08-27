const Joi = require('joi');
const Mongoose = require('mongoose');
const Joigoose = require('joigoose')(Mongoose, null, { _id: true, timestamps: false });

const MongooseSchema = Mongoose.Schema;

const Base = require('./Base');

class BaseModel extends Base {
    constructor(moduleName) {
        super(moduleName);

        this.schema = null;
        this.db = null;
    }

    returnBoolean(result) {
        return result.ok > 0 && result.nModified > 0 && result.n > 0;
    }

    setModel(modelName, schema) {
        this.schema = schema;
        this.db = Mongoose.model(modelName, new MongooseSchema(Joigoose.convert(schema)));
    }

    push(id, key, value, returnBoolean = true) {
        if (!Array.isArray(value)) value = [value];

        const pushValue = {};
        pushValue[key] = value;

        return this.db.update({ _id: id }, { $push: pushValue })
            .then((result) => {
                if (returnBoolean) return this.returnBoolean(result);
                return result;
            });
    }

    pull(id, key, value, returnBoolean = true) {
        const pullValue = {};
        pullValue[key] = Array.isArray(value) ? { $in: value } : value;

        return this.db.update({ _id: id }, { $pull: pullValue }, { multi: true })
            .then((result) => {
                if (returnBoolean) return this.returnBoolean(result);
                return result;
            });
    }

    addArrayItem(id, key, value, returnBoolean) {
        return this.push(id, key, value);
    }

    removeArrayItem(id, key, value, returnBoolean) {
        return this.pull(id, key, value);
    }

    editArrayItem(id, field, condition, data, returnBoolean = true) {
        const criteria = { _id: id };
        const setData = {};

        for (let arrayField in condition) {
            criteria[`${field}.${arrayField}`] = condition[arrayField];
        }

        for (let arrayField in data) {
            setData[`${field}.$.${arrayField}`] = data[arrayField];
        }

        return this.db.update(criteria, {
            $set: setData
        }).then((result) => {
            if (returnBoolean) return this.returnBoolean(result);
            return result;
        });
    }

    getArrayItem(id, field, condition) {
        const criteria = {};
        criteria[field] = { $elemMatch: condition };

        return this.db.find({
            _id: this.id(id)
        }, criteria).then((result) => {
            if (result.length) {
                const item = result[0];
                if (field in item && Array.isArray(item[field])) return item[field][0];
            }

            return null;
        });
    }

    create(data) {
        return this.db.create(data);
    }

    updateField(criteria, field, value, returnBoolean = true) {
        if (typeof (criteria) !== 'object') criteria = { _id: criteria };
        const data = {};
        data[field] = value;

        return this.db.update(criteria, { $set: data })
            .then((result) => {
                if (returnBoolean) return this.returnBoolean(result);
                return result;
            });
    }

    updateFields(criteria, data, returnBoolean = true) {
        if (typeof (criteria) !== 'object') criteria = { _id: criteria };
        return this.db.update(criteria, { $set: data })
            .then((result) => {
                if (returnBoolean) return this.returnBoolean(result);
                return result;
            });
    }

    edit(id, data, options) {
        if (!options) options = { new: true };
        return this.db.findOneAndUpdate({ _id: id }, { $set: data }, options);
    }

    permanentDelete(id, returnBoolean = true) {
        return this.db.deleteOne({ _id: id })
            .then((result) => {
                if (returnBoolean) return this.returnBoolean(result);
                return result;
            });
    }

    softDelete(id, returnBoolean = true) {
        return this.db.update({ _id: id }, { $set: { deleted: true } })
            .then((result) => {
                if (returnBoolean) return this.returnBoolean(result);
                return result;
            });
    }

    contains(key, value) {
        if (!Array.isArray(value)) value = [value];

        const contains = {};
        contains[key] = { $in: value };

        return this.db.find(contains);
    }

    existsBy(field, value) {
        const criteria = {};
        criteria[field] = value;

        return this.db.findOne(criteria)
            .then((result) => {
                return !!result;
            });
    }

    findIn(ids, from = 0, amount = 10) {
        return this.db.find({ _id: { $in: ids } }).skip(from).limit(amount);
    }

    findById(id) {
        return this.db.findOne({ _id: id });
    }

    find(criteria = {}, from = 0, amount = 10) {
        return this.db.find(criteria).skip(from).limit(amount);
    }

    findActive(criteria, from = 0, amount = 10) {
        return this.find({ ...criteria, deleted: false }, from, amount);
    }

    id(number) {
        return Mongoose.Types.ObjectId(number);
    }
}

BaseModel.Joi = Joi;
BaseModel.ObjectId = MongooseSchema.Types.ObjectId

module.exports = BaseModel;