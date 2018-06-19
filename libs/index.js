const database = require('./db');
const JWT = require('./jwt');
const Logger = require('./logger');
const Session = require('./session');
const Middleware = require('./middleware');
const redis = require('./redis');
const Helpers = require('./helpers');
const Base = require('./core/Base');
const BaseController = require('./core/BaseController');
const BaseModel = require('./core/BaseModel');
const BaseService = require('./core/BaseService');
const log = require('./core/log');

const libs = {
    database,
    JWT,
    Logger,
    Middleware,
    Session,
    redis,
    Helpers,
    Base,
    BaseController,
    BaseModel,
    BaseService,
    log
};

module.exports = {
    load: () => {
        global.__LIBS = libs;
    },
    __LIBS: libs
};