const config = require('./config');
const server = require('./api/server');
const Database = require('./libs/db');
const Log = require('./libs/log');

const log = new Log('Application');

process.on('uncaughtException', function (err) {
    log.error(`Uncaught Exception!`, err);
    console.log(err)
});

server.setup();
server.connect()
    .then((app) => {
        return Database.connect();
    });