/**
 * Main App Controller for the AngularJS Material Starter App
 * @param WeathersDataService
 * @param $mdSidenav
 * @constructor
 */
function AppController(WeathersDataService) {
  var self = this;

  self.selected     = null;
  self.weathers        = [ ];
  self.geolocation = {long: 0, lat: 0};
  function findMe() {
    if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
        self.geolocation.long = position.coords.longitude;
		self.geolocation.lat = position.coords.latitude;
		loadWeathers();
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  findMe();
  
  function weatherUpdateUrl() {
	return '/api/v1.0/weather/around/'+self.geolocation.long+'/'+self.geolocation.lat;
  }
  var loadWeatherRunning = false;
  // Load all registered users
  function loadWeathers() {
	  loadWeatherRunning = true;
	  WeathersDataService
			.loadWeathers(weatherUpdateUrl())
			.then( function( weathers ) {
				loadWeatherRunning = false;
				self.weathers = [].concat(weathers.data);
			});
  }
  var loadWeatherInt = setInterval(function() {
	  if(!loadWeatherRunning) {
        loadWeathers();
	  }
    }, 10000);

	// *********************************
  // Internal methods
  // *********************************

}

export default [ 'WeathersDataService', AppController ];
