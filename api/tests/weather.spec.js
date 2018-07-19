let environment = "test";
process.env.NODE_ENV = environment;

let nconf = require('nconf');
require('dotenv').load();
nconf.use('memory');
let testConfigPath = require('path').resolve(__dirname, '../src/config/test.json');
nconf.argv().env().file({file: testConfigPath});
console.log("environment: " + nconf.get("NODE_ENV"));


var assert = require("assert");

var WeatherCity = require('../src/services/weather.city');
var WeatherCache = require('../src/services/weather.cache');

var weatherCity = new WeatherCity();
var weatherCache = new WeatherCache();

describe('Weather Location Validation', () => {
  let centerLoc;
  let lon = 11;
  let lat = 22;
  it('It should success validate location', (done) => {
	 centerLoc = weatherCity.ValidateLocation(lon, lat);
	 assert.equal(lon, centerLoc.lon);
     assert.equal(lat, centerLoc.lat);
	 done();
  });
});

describe('Get value from OpenWeatherMap', () => {
    it('It should be equal with cached', async () => {
		let lon = 11;
		let lat = 22;
		let rectLoc = weatherCity.GenerateRectLoc({lon:lon, lat:lat});
		let openWeatherConfiguration = nconf.get('OpenWeatherConfiguration');
		let rectEndpoint = openWeatherConfiguration.Endpoint + "box/city";
		let zoom = 10;
		let rectParams = {
			bbox: rectLoc.lonLeft+","+rectLoc.latBtm+","+rectLoc.lonRight+","+rectLoc.latTop+","+zoom,
			appid: openWeatherConfiguration.AppId,
			unit: "metric"
		}
		let url = weatherCity.apiHelper.GenerateUrl(rectEndpoint, rectParams);
		let openWeatherResponseList = await weatherCity.CallOpenWeather(url, openWeatherConfiguration.TimeoutMs);
		await weatherCache.Update(lon, lat, openWeatherResponseList);
		
		 let cachedOpenWeatherResponseList = await weatherCache.GetWeatherRect(rectLoc);
		 assert.equal(openWeatherResponseList.length, cachedOpenWeatherResponseList.length);
    });
});