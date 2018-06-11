const bunyan = require('bunyan');
const chalk = require('chalk');
const pretty = require('pretty-format');

const config = _CONFIG;

class log {
    constructor(moduleName) {
        const logConfig = {
            name: config.name,
            ...config.log,
            streams: [{
                type: 'rotating-file',
                path: `${process.cwd()}/logs/${config.name}.log`,
                period: '1d',
                count: 200
            }, {
                type: 'rotating-file',
                path: `${process.cwd()}/logs/${config.name}.log`,
                period: '1d',
                count: 200,
                level: 'debug'
            }, {
                type: 'rotating-file',
                path: `${process.cwd()}/logs/${config.name}.log`,
                period: '1d',
                count: 200,
                level: 'error'
            }]
        };

        this.moduleName = moduleName;
        this.logger = bunyan.createLogger(logConfig);
    }

    error(input, object = null) {
        this.write(input, object, 'error', 'red');
    }

    debug(input, object = null) {
        this.write(input, object, 'debug', 'gray');
    }

    info(input, object = null) {
        this.write(input, object, 'info', 'blue');
    }

    write(input, object, level = 'info', color = 'gray') {
        input = `INFO [${this.moduleName}]: ${input}`;
        object = object ? pretty(object, { maxDepth: 3 }) : '';
        console.log(chalk[color](input));
        this.logger[level](input, object);
    }
}

module.exports = log;