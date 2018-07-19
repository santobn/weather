'use strict';

const controllerDir = '../controllers';
var routeConfig = require('./routes.json');
var changeCase = require('change-case');
var config = require('nconf');
var express = require('express');
var path = require('path');

var Routes = function(app){
	console.log("[APP] Init Api Endpoint");
	for(var versionKey in routeConfig){
		let versionRoutes = routeConfig[versionKey];
		for(var i in versionRoutes){
			let controllerPath = path.join(controllerDir, versionRoutes[i]);
			let controllerName = path.basename(controllerPath);
			let DynamicController = require(controllerPath);
			let controller = new DynamicController();
			
			let router = express.Router();
			controller.Init(router);
			let controllerEndpoint = '/api/' + versionKey + '/' + controllerName;
			console.log( controllerEndpoint + " : " +  controllerPath);
			
			let routeObj = { 
					apiVersion : versionKey
				};
			app.use(controllerEndpoint, function(req, res, next){
				req.headers.route = routeObj;
				next();
			});
			app.use(controllerEndpoint, router);
		}
	}
}

module.exports = Routes;