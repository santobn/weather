'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet');

var start = function(nextInitCallback) {
    var port =  process.env.PORT || 3000;    
    var app = express();

    app.use(cors({origin: "*", credentials: true}));
    app.use(bodyParser.json({type: "application/json"}));

    app.use(helmet());
    app.use(helmet.noCache());
    app.use(helmet.hidePoweredBy());
  
    require('./router')(app);
	app.use((err, req, res, next) => {
		res.status(500).send();
	})

    app.listen(port, function(){
        console.log("Server listen on port: " + port);
    })

    if (nextInitCallback) nextInitCallback();
};

module.exports = start;