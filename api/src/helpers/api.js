'use strict';

let config = require('nconf');
let request = require('request-promise');
let querystring = require('querystring');
let ValidationHelper = require('./validation');

var ApiHelper = function(){
	this.validationHelper = new ValidationHelper();
}

ApiHelper.prototype.Call = async function(apiOptions){
	let self = this;
    try{
		let defaultOption = { forever: true };
		let obj = { ...defaultOption, ...apiOptions }; 
    
        var response = await request(obj);    
        return JSON.parse(response);  
    }
    catch(ex){
        if(ex.response && ex.response.body && self.ValidationHelper.IsValidJson(ex.response.body)){
            throw JSON.parse(ex.response.body);
        }
        else {
            throw ex;
        }
    }    
}

ApiHelper.prototype.GenerateUrl = function(baseUrl, params){
	let url = baseUrl;
	 if( params != null) {
		url += "?" + querystring.unescape( querystring.stringify(params) );
	 }
	return url;
}

module.exports = ApiHelper;