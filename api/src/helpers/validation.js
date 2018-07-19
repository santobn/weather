'use strict';

var ValidationHelper = function(){

}

ValidationHelper.prototype.IsInt = function(value){
	return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))  
}

ValidationHelper.prototype.IsNumeric = function(value){
  return !isNaN(parseFloat(value)) && isFinite(value);
}

ValidationHelper.prototype.IsValidJson = function(jsonString){
    return (/^[\],:{}\s]*$/.test(jsonString.replace(/\\["\\\/bfnrtu]/g, '@').
        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
        replace(/(?:^|:|,)(?:\s*\[)+/g, '')))
}

module.exports = ValidationHelper;