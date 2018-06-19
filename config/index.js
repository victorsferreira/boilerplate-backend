const env = process.env.NODE_ENV || 'development';
const _config = require(`./env/${env}`);
const config = Object.assign({}, process.env, _config, { env });

global.__CONFIG = config;

module.exports = config;