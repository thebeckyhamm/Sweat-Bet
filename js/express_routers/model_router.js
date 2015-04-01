function ModelRouter(db) {
  var Router = require("express").Router;
  this.db = db;
  this.router = new Router({
    mergeParams: true
  });
  this.setupRoutes();
}

ModelRouter.prototype = {

  setupRoutes: function() {

    // SHOW
    this.router.get("/:id", function(req, res) {
      this.db.findOne({_id: req.params.id}, function(err, data){
        if(err) {
          res.status(500).json({error: err.toString()});
        }
        else {
          res.json(data);
        }
      });
    }.bind(this));

    // UPDATE
    this.router.put("/:id", function(req, res){
      this.db.update({_id: req.params.id}, req.body, {}, function(err){
        if(err) {
          res.status(500).json({error: err.toString()});
          return;
        }
        this.db.findOne({_id: req.params.id}, function(err, data){
          if(err) {
            res.status(500).json({error: err.toString()});
          }
          else {
            res.json(data);
          }
        });
      }.bind(this));
    }.bind(this));

    // DESTROY
    this.router.delete("/:id", function(req, res){
      this.db.remove({_id: req.params.id}, {}, function(err){
        if(err) {
          res.status(500).json({error: err.toString()});
        }
        else {
          res.status(200).end();
        }
      });
    }.bind(this));
  }

}

module.exports = ModelRouter;
