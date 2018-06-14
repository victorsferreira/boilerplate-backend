const config = require('./config');
const server = require('./api/server');
const Database = require('./libs/db');
const Logger = require('./libs/logger');

const logger = new Logger('Application');

process.on('uncaughtException', function (err) {
    logger.error(`Uncaught Exception!`, err);
    console.log(err)
});

server.setup();
server.connect()
    .then((app) => {
        return Database.connect();
    });