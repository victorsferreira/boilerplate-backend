const redis = require('redis');
const Logger = require('./logger');

const config = __CONFIG;

class Redis {
    constructor() {
        this.logger = new Logger('Redis');
        this.client = null;
        this.config = config.redis;
        this.defaultTtl = 60 * 60; //1h
    }

    connect() {
        this.client = redis.createClient(this.config);
        this.client.on("error", (error) => {
            this.logger.error("There was an error with Redis", { error });
        });

        this.client.on("connect", (error) => {
            this.logger.debug(`Connection with Redis established at [${this.config.host}] on port [${this.config.port}]`, { error });
        });
    }

    set(key, _data, _ttl) {
        const ttl = _ttl || this.config.ttl || this.defaultTtl;
        const data = JSON.stringify(_data);

        return new Promise((resolve, reject) => {
            this.client.set(key, data, 'EX', ttl, (error, result) => {
                if (error) {
                    this.logger.error(error);
                    reject(error);
                }else resolve(result);
            });
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error, result) => {
                if (error) {
                    this.logger.error(error);
                    reject(error);
                }else resolve(JSON.parse(result));
            });
        });
    }

    del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (error, result) => {
                if (error) {
                    this.logger.error(error);
                    reject(error);
                }else resolve(result);
            });
        });
    }

    close() {
        this.client.quit();
    }
}

module.exports = new Redis();