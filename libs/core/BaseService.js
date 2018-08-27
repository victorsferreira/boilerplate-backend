const Base = require('./Base');
const path = require('path');
const s3 = require('../s3');
const uuid = require('uuid/v4');

const { isEmpty, getValueByFieldName, getInnerMostFieldName, objectFields, setValueByFieldName } = require('../helpers');

class BaseService extends Base {
    constructor(moduleName) {
        super(moduleName);
    }

    deletePhoto(key) {
        return s3.delete(key);
    }

    deleteFile(key) {
        return s3.delete(key);
    }

    cleanOutputFields(fields, output = {}) {
        const responseFields = output.fields || this.output.fields || [];
        const responseFieldsAlias = output.alias || this.output.alias || {};

        return objectFields(fields, responseFields, responseFieldsAlias);
    }

    handleFiles(data, oldData, files) {
        const id = data.id || data._id;

        const promises = files.map((currentFile) => {
            const { file, field } = currentFile;

            if (file) {
                // Upload photo
                const fieldName = getInnerMostFieldName(field);
                const key = `${fieldName}_${id}${path.extname(file.name)}`;

                return s3.upload(file.data, key)
                    .then((result) => {
                        // Update database
                        const updateData = setValueByFieldName({}, field, result.key);
                        const outerMostFieldName = field.split('.')[0];
                        const fieldValue = data[outerMostFieldName];
                        if (fieldValue && typeof (fieldValue) === 'object') {
                            updateData[outerMostFieldName] = { ...data[outerMostFieldName], ...updateData[outerMostFieldName] };
                        }

                        return this.model.edit(id, updateData);
                    })
                    .then(() => {
                        setValueByFieldName(data, field, key);

                        return key;
                    });
            } else if (oldData) {
                const old = getValueByFieldName(oldData, field);
                const current = getValueByFieldName(data, field);
                if (old && !current) {
                    // Delete photo
                    return s3.delete(old)
                        .then(() => {
                            setValueByFieldName(data, field, null);

                            return null;
                        });
                }
            }
        });

        return Promise.all(promises)
            .then(() => {
                return data;
            });
    }

    uploadFile(photo, filename) {
        if (!filename) filename = uuid();
        const key = `${filename}${path.extname(photo.name)}`;
        return s3.upload(photo.data, key)
            .then((result) => {
                return { filename, key };
            });
    }

    uploadPhoto(data, photo, field) {
        const id = data._id || data.id;
        const key = `${field}_${id}${path.extname(photo.name)}`;

        return s3.upload(photo.data, key)
            .then((result) => {
                // if (updateField) {
                //     if (data[updateField] !== key) {
                //         return s3.delete(data[updateField]);
                //     }
                // }
                return result;
            })
            .then((result) => {
                const updateData = {};
                updateData[field] = key;
                return this.model.edit(id, updateData);
            })
            .then((result) => {
                return key;
            });
    }

    // Response
    

    // CRUD
    handleUploadedFiles(files) {
        const processedFiles = [];

        if (!isEmpty(files)) {
            for (let k in files) {
                processedFiles.push({
                    file: files[k], field: this.files[k]
                });
            }
        }

        return processedFiles;
    }

    create(data, files) {
        return this.model.create(data)
            .then((item) => {
                if (files) {
                    return this.handleFiles(item, null, this.handleUploadedFiles(files));
                }

                return item;
            })
            .then((item) => {
                return this.cleanOutputFields(item);
            })
    }

    edit(id, data, files) {
        const results = {};

        return this.model.findById(id)
            .then((oldItem) => {
                if (!oldItem) {
                    const error = new Error(`Couldn't find an item type with ID [${id}]`);
                    error.code = 'NotFound';

                    throw error;
                }

                results.oldItem = oldItem;
                return this.model.edit(id, data)
            })
            .then((item) => {
                this.logger.debug(`Item successfully edited ${id}`, { item });

                if (files) {
                    return this.handleFiles(item, results.oldItem, this.handleUploadedFiles(files));
                }

                return item;
            })
            .then((item) => {
                return this.cleanOutputFields(item);
            })
    }

    delete(id) {
        return this.model.softDelete(id)
            .then((result) => {
                if (!result) {
                    const error = new Error(`Couldn't delete an item with id ${id}`);
                    error.code = 'NotFound';

                    throw error;
                }

                return true;
            });
    }

    show(id) {
        return this.model.findActive({ _id: id }, 0, 1)
            .then((result) => {
                if (result.length) {
                    this.logger.debug(`Item successfully found"`, { result });
                    return this.cleanOutputFields(result[0]);
                }

                const error = new Error("Couldn't find a Item with this id", { id });
                error.code = 'NotFound';

                throw error;
            });
    }

    search(criteria, meta) {
        if (!criteria) criteria = {};

        return this.model.find(criteria, meta.from, meta.amount, meta.sorting, meta.fields)
            .then((result) => {
                return result.map((item) => {
                    return this.cleanOutputFields(item);
                });
            });
    }

    list(criteria, meta) {
        if (!criteria) criteria = {};

        return this.model.findActive(criteria, meta.from, meta.amount, meta.sorting, meta.fields)
            .then((result) => {
                return result.map((item) => {
                    return this.cleanOutputFields(item);
                });
            });
    }
}

module.exports = BaseService;