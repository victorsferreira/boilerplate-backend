const nodemailer = require('nodemailer');
const Logger = require('./logger');
const config = __CONFIG;

class Mailer {
    constructor() {
        this.config = config.email;
        this.client = nodemailer.createTransport(this.config);
        this.logger = new Logger('Mailer');
    }

    send(from, to, subject, body, rawBody) {
        const options = {
            from: from || this.config.defaultSender,
            to,
            subject,
            html: body,
            text: rawBody
        };

        return new Promise((resolve, reject) => {
            this.client.sendMail(options, (error, info) => {
                if (error) {
                    this.logger.error(`There was an error sending this e-mail`, { options, error });
                    reject(error);
                } else {
                    this.logger.debug(`Successfully sent the e-mail`, { options, info });
                    resolve(info);
                }
            });
        });
    }
}

module.exports = new Mailer();