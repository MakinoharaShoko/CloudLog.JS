const axios = require("axios");

class Cloudlog {
    constructor() {
        this.url = '';
        this.level = 'all';
        this.mongoUrl = 'mongodb://localhost:27017/';
        this.collection = 'main';
    }

    init(url, mongoUrl) {
        this.url = url;
        if (mongoUrl) {
            this.mongoUrl = mongoUrl;
        }
    }

    setCollection(c) {
        this.collection = c;
    }

    setLevel(l) {
        this.level = l;
    }

    upload(info, data, level, now) {
        if (typeof info !== 'string') {
            this.error('log的第一个参数不是字符串', undefined, false);
        }
        let postData = {
            log: {
                info: info,
                data: data,
                level: level,
                now: now
            },
            mongoUrl: this.mongoUrl,
            collection: this.collection
        }
        const that = this;
        if (this.url !== '') {
            axios.post(this.url + '/log', postData).then(r => {
                that.trace('Logged to cloud.', undefined, false)
            }).catch(e => {
                that.error('Logging to cloud failed!', undefined, false);
            });
        }
    }

    clog(info, data, level, color, now, upload) {
        const levelToNum = {
            all: 7,
            ALL: 7,
            TRACE: 6,
            DEBUG: 5,
            INFO: 4,
            WARN: 3,
            ERROR: 2,
            FATAL: 1,
            NONE: 0,
            none: 0
        }
        if (levelToNum[level] <= levelToNum[this.level]) {
            console.log('%c%s%c%s%c%s%c %s',
                'color:white;background-color:' + color,
                '[' + level + ']',
                '',
                ' ',
                'color:' + color,
                '[' + now.toLocaleString() + ']',
                '',
                info
            );
            if (data) {
                console.log(data);
                console.log('------------------------')
            }
        }
        if (upload === undefined) {
            this.upload(info, data, level, now);
        }
        if (upload !== undefined) {
            if (upload) {
                this.upload(info, data, level, now);
            }
        }

    }

    trace(info, data, upload) {
        const now = new Date();
        const level = 'TRACE';
        const color = '#005CAF';
        this.clog(info, data, level, color, now, upload);
    }

    debug(info, data, upload) {
        const now = new Date();
        const level = 'DEBUG';
        const color = '#0089A7';
        this.clog(info, data, level, color, now, upload);
    }

    info(info, data, upload) {
        const now = new Date();
        const level = 'INFO';
        const color = '#00896C';
        this.clog(info, data, level, color, now, upload);
    }

    warn(info, data, upload) {
        const now = new Date();
        const level = 'WARN';
        const color = '#DDA52D';
        this.clog(info, data, level, color, now, upload);
    }

    error(info, data, upload) {
        const now = new Date();
        const level = 'ERROR';
        const color = '#AB3B3A';
        this.clog(info, data, level, color, now, upload);
    }

    fatal(info, data, upload) {
        const now = new Date();
        const level = 'FATAL';
        const color = '#E16B8C';
        this.clog(info, data, level, color, now, upload);
    }
}

module.exports = Cloudlog;