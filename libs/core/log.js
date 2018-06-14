const bunyan = require('bunyan');
const chalk = require('chalk');
const pretty = require('pretty-format');

const config = _CONFIG;

class Log {
    constructor() {
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

        this.bunyan = bunyan.createLogger(logConfig);
    }

    write(moduleName, input, object, level = 'info', color = 'gray') {
        input = `INFO [${moduleName}]: ${input}`;
        object = object ? pretty(object, { maxDepth: 3 }) : '';
        console.log(chalk[color](input));
        this.bunyan[level](input, object);
    }
}

module.exports = new Log();