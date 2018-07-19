/**
 * Users DataService
 * Uses embedded, hard-coded data model; acts asynchronously to simulate
 * remote data service call(s).
 *
 * @returns {{loadAll: Function}}
 * @constructor
 */
function WeathersDataService($q, $http) {
 
  // Promise-based API
  return {
    loadWeathers: function(url) {
		return $http.get(url);
    }
  };
}

export default ['$q', '$http', WeathersDataService];

