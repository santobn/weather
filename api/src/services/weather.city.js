'use strict';

let url = require('url');
let config = require('nconf');
var ValidationHelper = require('../helpers/validation');
let ApiHelper = require('../helpers/api');
let WeatherCache = require('./weather.cache');

var WeatherCityService = function(){
    this.validationHelper = new ValidationHelper();
    this.apiHelper = new ApiHelper();
    this.weatherCache = new WeatherCache();
}

WeatherCityService.prototype.GetWeatherAround = async function(centerLon, centerLat){
	let centerLoc = this.ValidateLocation(centerLon, centerLat);

	let rectLoc = this.GenerateRectLoc(centerLoc);
	let openWeatherConfiguration = config.get('OpenWeatherConfiguration');
	let rectEndpoint = openWeatherConfiguration.Endpoint + "box/city";
	let zoom = 10;
	let rectParams = {
		bbox: rectLoc.lonLeft+","+rectLoc.latBtm+","+rectLoc.lonRight+","+rectLoc.latTop+","+zoom,
		appid: openWeatherConfiguration.AppId,
		unit: "metric"
	}
	let url = this.apiHelper.GenerateUrl(rectEndpoint, rectParams);
	
	let openWeatherResponseList = await this.CallOpenWeather(url, openWeatherConfiguration.TimeoutMs);
	if(openWeatherResponseList != null){
		// update cache
		await this.weatherCache.Update(centerLon, centerLat, openWeatherResponseList);
		return openWeatherResponseList;
	} else {
		// retrieve cache
		return await this.weatherCache.GetWeatherRect(rectLoc);
	}
}

WeatherCityService.prototype.CallOpenWeather = async function(url, timeoutMs) {
	try {
		let openWeatherResponse = await this.apiHelper.Call({
			method: "GET",
			url: url,
			timeout: timeoutMs
		});
		if(openWeatherResponse.cod == 200) 
			return openWeatherResponse.list;
	}  catch(ex){
		console.log(ex);
	}
	return null;
}

WeatherCityService.prototype.GenerateRectLoc = function(centerLoc){
	return {
		lonLeft : (centerLoc.lon - 90),
		lonRight : (centerLoc.lon + 90),
		latTop : (centerLoc.lat + 45),
		latBtm : (centerLoc.lat - 45)
	}
}

WeatherCityService.prototype.ValidateLocation = function(centerLon, centerLat){
	let validateLon = this.validationHelper.IsNumeric(centerLon);
	let validateLat = this.validationHelper.IsNumeric(centerLat);
	if(validateLon && validateLat) {
		let centerLoc = {
			lon: parseFloat(centerLon),
			lat: parseFloat(centerLat)
		}
		if(centerLoc.lon >= -180 && centerLoc.lon <= 180 &&
			centerLoc.lat >= -90 && centerLoc.lat <= 90) {
				return centerLoc;
			}
	}
	throw new Error("IsNumeric : " + centerLon + " " + validateLon + " - " + centerLat + " " + validateLat);
}

module.exports = WeatherCityService;