// Load the custom app ES6 modules

import WeathersDataService from 'src/weathers/services/WeathersDataService';

import WeatherList from 'src/weathers/components/list/WeatherList';

// Define the AngularJS 'weathers' module

export default angular
  .module("weathers", ['ngMaterial'])

  .component(WeatherList.name, WeatherList.config)

  .service("WeathersDataService", WeathersDataService);
