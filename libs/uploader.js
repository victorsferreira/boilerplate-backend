const formidable = require('formidable');
const s3 = require('./s3');
const path = require('path');

const config = __CONFIG;

class Uploader {
    constructor() {
        this.config = config.uploads;
        this.formidable = new formidable.IncomingForm();
        this.s3 = s3;
    }

    toS3(localFile, { bucket, key }) {
        if (!bucket) bucket = this.config.s3.buckets.default;
        if (!key) key = path.basename(localFile);

        this.s3.upload(localFile, key, bucket);
    }

    toDisk(req) {
        return new Promise((resolve, reject) => {
            this.formidable.parse(req, (err, fields, files) => {
                var oldpath = files.filetoupload.path;
                var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
                fs.rename(oldpath, newpath, function (err, result) {
                    if (err) reject(err);
                    else resolve({ oldpath, newpath, result });
                });
            });
        });
    }

}

module.exports = Uploader;