const mongoose = require('mongoose');
const Logger = require('./logger');
mongoose.Promise = Promise;

const config = _CONFIG;

class Database{
    constructor(){
        this.logger = new Logger('Database');
    }

    connect() {
        return mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
            .then(result => {
                this.logger.debug(`Connection with MongoDB established at [${config.db.host}] on port [${config.db.port}]`);
                return result;
            }, (err) => {
                this.logger.error('Something went wrong when trying to connect with MongoDB established', err);
                throw err;
            });
    }
}

module.exports = new Database();