const mongoose = require('mongoose');
const Logger = require('./logger');
mongoose.Promise = Promise;

const config = __CONFIG;

class Database{
    constructor(){
        this.logger = new Logger('Database');
        this.config = config.db;
    }

    connect() {
        return mongoose.connect(`mongodb://${this.config.host}:${this.config.port}/${this.config.name}`)
            .then(result => {
                this.logger.debug(`Connection with MongoDB established at [${this.config.host}] on port [${this.config.port}]`);
                return result;
            }, (err) => {
                this.logger.error('Something went wrong when trying to connect with MongoDB established', err);
                throw err;
            });
    }
}

module.exports = new Database();