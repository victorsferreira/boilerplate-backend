const AWS = require('aws-sdk');
const fs = require('fs');

const config = __CONFIG;

class S3 {
    constructor() {
        this.config = config.uploads.s3;

        this.client = new AWS.S3({
            accessKeyId: this.config.keys.accessKeyId,
            secretAccessKey: this.config.keys.secretAccessKey,
            Bucket: this.config.buckets.default
        });
    }

    getUrl(key, expires, bucket) {
        if (!bucket) bucket = this.config.buckets.default;
        if (!expires) expires = this.config.expires;

        const url = this.client.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: key,
            Expires: expires
        });

        return url;
    }

    getFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const file = new Buffer(data, 'binary');
                    resolve(file);
                }
            });
        });
    }

    delete(key, bucket) {
        if (!bucket) bucket = this.config.buckets.default;

        const params = {
            Bucket: bucket,
            Key: key
        };

        return new Promise((resolve, reject) => {
            this.client.deleteObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    put(file, key, bucket) {
        if (!bucket) bucket = this.config.buckets.default;

        const params = {
            Bucket: bucket,
            Key: key,
            Body: file
        };

        return new Promise((resolve, reject) => {
            this.client.putObject(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    upload(file, key, bucket) {
        if (!bucket) bucket = this.config.buckets.default;

        const params = {
            Bucket: bucket,
            Key: key,
            Body: file
        };

        return new Promise((resolve, reject) => {
            this.client.upload(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}

module.exports = new S3();