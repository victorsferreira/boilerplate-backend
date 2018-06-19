const bunyan = require('bunyan');
const chalk = require('chalk');
const pretty = require('pretty-format');
const log = require('./core/log');

const config = __CONFIG;

class Logger {
    constructor(moduleName) {
        this.moduleName = moduleName;
        this.log = log;
    }

    error(input, object = null) {
        this.log.write(this.moduleName, input, object, 'error', 'red');
    }

    debug(input, object = null) {
        this.log.write(this.moduleName, input, object, 'debug', 'gray');
    }

    info(input, object = null) {
        this.log.write(this.moduleName, input, object, 'info', 'blue');
    }
}

module.exports = Logger;