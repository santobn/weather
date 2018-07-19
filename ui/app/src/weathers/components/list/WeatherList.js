// Notice that we do not have a controller since this component does not
// have any specialized logic.

export default {
  name : 'weathersList',
  config : {
    bindings         : {  weathers: '<' },
    templateUrl      : 'src/weathers/components/list/WeatherList.html'
  }
};
