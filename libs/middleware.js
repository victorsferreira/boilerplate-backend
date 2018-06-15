const Logger = require('../logger');
const JWT = require('./jwt');

const logger = new Logger('Middleware');

const config = _CONFIG;

class Middleware {
    static session(req, res, next) {
        if ('Authorization' in req.headers) {
            const bearer = req.headers['Authorization'];
            const token = bearer.split(' ')[1];
            
            if (token) {
                JWT.validate(token)
                    .then((data) => {
                        req.session = {
                            jwt: data
                        };

                        // load session on Redis

                        next();
                    }).catch((err) => {
                        const error = new Error(err);
                        error.code = 'Unauthorized';
                        next(error);
                    });
            } else {
                const error = new Error(err);
                error.code = 'BadRequest';
                next(error);
            }
        } else {
            const error = new Error(err);
            error.code = 'Unauthorized';
            next(error);
        }
    }
}