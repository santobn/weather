'use strict';

let url = require('url');
let config = require('nconf');
let CacheHelper = require('../helpers/cache');
var weatherCacheKey = require('../constants/weather.cachekey');

var WeatherCacheService = function(){
    this.cacheHelper = new CacheHelper();
}

WeatherCacheService.prototype.GetWeatherRect = async function(rectLoc){
	var cachedLocationData = await this.cacheHelper.queryAsync(weatherCacheKey.locationCities);
	if(!cachedLocationData){
		return null;
	}
	let cityWeatherKeys = [];
	for(var id in cachedLocationData){
		let cachedObj = cachedLocationData[id];
		if(cachedObj.lon >= rectLoc.lonLeft && cachedObj.lon <= rectLoc.lonRight &&
			cachedObj.lat >= rectLoc.latBtm && cachedObj.lat <= rectLoc.latTop) {
			cityWeatherKeys.push(weatherCacheKey.prefixWeatherCity + id);
		}
	}
	let cachedWeatherData = await this.cacheHelper.mQueryAsync(cityWeatherKeys);
	cachedWeatherData = cachedWeatherData.filter(function(n){ return n != undefined && n != null }); 
	return cachedWeatherData.map(data => JSON.parse(data));
}

WeatherCacheService.prototype.Update = async function(centerLon, centerLat, openWeatherResponseList){
	await this.UpdateLocation(openWeatherResponseList);
	await this.UpdateWeathers(openWeatherResponseList);
}


WeatherCacheService.prototype.UpdateLocation = async function(openWeatherResponseList){
	var cachedData = await this.cacheHelper.queryAsync(weatherCacheKey.locationCities);
	if(!cachedData){
		cachedData = {};
	}
	
	if(openWeatherResponseList != null) {
		for(var i in openWeatherResponseList){
			let openWeatherResponseListObj = openWeatherResponseList[i];
			cachedData[openWeatherResponseListObj.id] = {
				lon: openWeatherResponseListObj.coord.Lon,
				lat: openWeatherResponseListObj.coord.Lat
			};
		}
	}
	await this.cacheHelper.saveAsync(weatherCacheKey.locationCities, cachedData);
}


WeatherCacheService.prototype.UpdateWeathers = async function(openWeatherResponseList){
	let keyValueArraySet = [];
	for(var i in openWeatherResponseList){
		let openWeatherResponseListObj = openWeatherResponseList[i];
		keyValueArraySet.push(weatherCacheKey.prefixWeatherCity + openWeatherResponseListObj.id);
		keyValueArraySet.push(JSON.stringify(openWeatherResponseListObj));
	}
	await this.cacheHelper.mSaveAsync(keyValueArraySet);
}

module.exports = WeatherCacheService;