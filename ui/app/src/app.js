// Load libraries
import angular from 'angular';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';

import AppController from 'src/AppController';
import Weathers from 'src/weathers/Weathers';

export default angular.module( 'starter-app', [ 'ngMaterial', Weathers.name ] )
  .config(($mdThemingProvider) => {

    $mdThemingProvider.theme('default')
      .primaryPalette('brown')
      .accentPalette('red');
  })
  .controller('AppController', AppController);
