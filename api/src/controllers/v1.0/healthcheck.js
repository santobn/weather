var HealthcheckController = function(){
}

HealthcheckController.prototype.Init = function(router) { 
    router.route('/')
    .get(function(req, res, next){
            res.status(200).send({success:true});        
    });
}

module.exports = HealthcheckController;