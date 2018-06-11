const mongoose = require('mongoose');
const Log = require('./log');
mongoose.Promise = Promise;

const config = _CONFIG;

class Database{
    constructor(){
        this.log = new Log('Database');
    }

    connect() {
        return mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
            .then(result => {
                this.log.debug(`Connection with MongoDB established at [${config.db.host}] on port [${config.db.port}]`);
                return result;
            }, (err) => {
                this.log.error('Something went wrong when trying to connect with MongoDB established', err);
                throw err;
            });
    }
}

module.exports = new Database();