const winston = require('winston');
require('winston-mongodb');
const { DB_URL } = process.env;

const logger = winston.createLogger({
    transports: [
        // new winston.transports.Console(),
        new winston.transports.MongoDB({ db: DB_URL }),
        new winston.transports.File({ filename: 'logfiles/logfile_' + new Date().toJSON().slice(0, 10) + '.log' })
    ]
});

module.exports = { logger };