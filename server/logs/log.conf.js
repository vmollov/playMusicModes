var winston = require('winston'),
    path = require('path'),

    logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'error-file',
            filename: path.resolve(__dirname, 'error.log'),
            level: 'error'
        }),
        new (winston.transports.Console)({
            level: 'debug'
        })
    ]
});

module.exports = logger;