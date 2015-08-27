'use strict';

var
    express = require('express'),
    app = express(),
    path = require('path'),
    logger = require('./logs/log.conf'),

    port = process.env.PORT || 9000;

app.use(express.static(path.resolve(__dirname, '../public')));

app.listen(port, function(){
    logger.log('info', "Application started on port %s", port);
});