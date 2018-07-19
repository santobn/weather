'use strict';

var redis = require("redis");
var nconf = require('nconf');
const {promisify} = require('util');

var CacheHelper = function(){
	this.redisConfiguration = nconf.get("RedisConfiguration");
    this.redis_options = {
        host: this.redisConfiguration.Host,
        port: this.redisConfiguration.Port,
        retry_strategy: function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('The server refused the connection');
            }
            if (options.total_retry_time > this.redisConfiguration.Timeout) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error('Retry time exhausted');
            }
            if (options.attempt > this.redisConfiguration.Max_Retry) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 1000);
        }
    }
    
    this.client = {};
}

CacheHelper.prototype.init = async function() {
    var self = this;

    self.client = redis.createClient(this.redis_options);
    self.client.select(this.redisConfiguration.Database);
    self.client.mgetAsync = promisify(self.client.mget).bind(self.client);
    self.client.msetAsync = promisify(self.client.mset).bind(self.client);
    self.client.getAsync = promisify(self.client.get).bind(self.client);
    self.client.setAsync = promisify(self.client.set).bind(self.client);
    self.client.delAsync = promisify(self.client.del).bind(self.client);
}

CacheHelper.prototype.queryAsync = async function(cacheKey) {
    try{
        if(cacheKey){
            this.init();
            var cachedData = await this.client.getAsync(cacheKey);
            this.client.quit();
            return JSON.parse(cachedData);
        }
    }
    catch(ex){
        // Ignore all exception and fallback to normal flow query (i.e. DB or downstream calling)
    } 
    return null;
}

CacheHelper.prototype.mQueryAsync = async function(cacheKeys) {
    try{
        if(cacheKeys){
            this.init();
            var cachedData = await this.client.mgetAsync(cacheKeys);
            this.client.quit();
            return cachedData;
        }
    }
    catch(ex){
        // Ignore all exception and fallback to normal flow query (i.e. DB or downstream calling)
    }   
    return null;
}

CacheHelper.prototype.saveAsync = async function(cacheKey, cacheData) {
    try{
        if(cacheKey && cacheData != null) {
            this.init();
            await this.client.setAsync(cacheKey, JSON.stringify(cacheData));
            this.client.quit();
        }
    }
    catch(ex){
		console.log(JSON.stringify(ex));
        // Ignore all exceptions as redis query will fall back to normal flow if cache is not available.
    }    
}

CacheHelper.prototype.saveExAsync = async function(cacheKey, cacheData, duration) {
    try{
        if(cacheKey && cacheData != null) {
            this.init();
            await this.client.setAsync(cacheKey, JSON.stringify(cacheData), 'EX', duration);
            this.client.quit();
        }
    }
    catch(ex){
		console.log(JSON.stringify(ex));
        // Ignore all exceptions as redis query will fall back to normal flow if cache is not available.
    }    
}

CacheHelper.prototype.mSaveAsync = async function(keyValueArraySet) {
    try{
        if(keyValueArraySet != null) {
            this.init();
            await this.client.msetAsync.apply(this, keyValueArraySet);
            this.client.quit();
        }
    }
    catch(ex){
		console.log(JSON.stringify(ex));
        // Ignore all exceptions as redis query will fall back to normal flow if cache is not available.
    }    
}

CacheHelper.prototype.deleteAsync = async function(cacheKey) {
    if(cacheKey){
        this.init();
        await this.client.delAsync(CacheKey);
        this.client.quit();
    } 
}

module.exports = CacheHelper;