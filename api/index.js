'use strict'
let nconf = require('nconf');
let async = require('async');

require('dotenv').load();
nconf.use('memory');
nconf.argv().env().file({file: './src/config/' + nconf.get('NODE_ENV') + '.json'});
console.log(nconf.get("NODE_ENV"));
console.log('[APP] Starting server initialization');

// Initialize Modules
async.series([
    function(nextInitCallback) {
        require('./src/init/server')(nextInitCallback);
    }], function(err) {
        if (err) {
            console.log('[APP] initialization failed', err);
        } else {
            console.log('[APP] initialized SUCCESSFULLY');
        }
    });

process.on("uncaughtException", function(error) {
    console.log(error); 
});