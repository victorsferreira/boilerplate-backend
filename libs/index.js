const database = require('./db');
const JWT = require('./jwt');
const Logger = require('./logger');
const Session = require('./session');
const Uploader = require('./uploader');
const Middleware = require('./middleware');
const redis = require('./redis');
const Helpers = require('./helpers');
const s3 = require('./s3');
const mailer = require('./mailer');
const Base = require('./core/Base');
const BaseController = require('./core/BaseController');
const BaseModel = require('./core/BaseModel');
const BaseService = require('./core/BaseService');
const log = require('./core/log');
const uploader = new Uploader();

const libs = {
    database,
    JWT,
    Logger,
    Middleware,
    Session,
    Uploader,
    uploader,
    redis,
    Helpers,
    Base,
    BaseController,
    BaseModel,
    BaseService,
    log,
    mailer,
    s3
};

module.exports = {
    load: () => {
        global.__LIBS = libs;
    },
    __LIBS: libs
};