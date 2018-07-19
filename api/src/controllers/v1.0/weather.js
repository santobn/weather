let WeatherService = require('../../services/weather.city');

var WeatherController = function(){
    this.weatherService = new WeatherService();
}

WeatherController.prototype.Init = function(router) {
    let self = this;

    router.route('/around/:lon/:lat')
    .get(async function(req, res, next){
        try{
			res.send(await self.weatherService.GetWeatherAround(req.params.lon, req.params.lat));
        } catch(ex){
			console.log(ex);
            res.status(500).send();
        }
    });
}

module.exports = WeatherController;