const mongoose = require('mongoose');
const Logger = require('./logger');
mongoose.Promise = Promise;

const config = __CONFIG;

class Database {
    constructor() {
        this.logger = new Logger('Database');
        this.config = config.db;
        this.timer = null;
    }

    connect() {
        return mongoose.connect(`mongodb://${this.config.host}:${this.config.port}/${this.config.name}`, this.config.options)
            .then(result => {
                this.logger.debug(`Connection with MongoDB established at [${this.config.host}] on port [${this.config.port}]`);

                result.connection.on('error', (error) => {
                    this.logger.error(error);
                });

                return result;
            }, (err) => {
                this.logger.error('Something went wrong when trying to connect with MongoDB', { ...this.config });
                throw err;
            });
    }

    connectWithRetry() {
        return this.connect()
            .catch((err) => {
                this.logger.debug('Trying to reconnect...');

                this.timer = setTimeout(() => {
                    this.logger.debug('Esperando...')
                    this.connectWithRetry()
                }, this.config.options.reconnectInterval);
            });
    }
}

module.exports = new Database();