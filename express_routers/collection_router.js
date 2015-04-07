function CollectionRouter(db, opts) {
  var Router = require("express").Router;
  this.db = db;
  opts || (opts = {});
  this.scope = opts.scope;
  this.include = opts.include; // {fkey: "goal_id", db: entriesDB, as: entries}
  this.router = new Router({
    mergeParams: true
  });
  this.setupRoutes();
}

CollectionRouter.prototype = {

  setupRoutes: function() {

    // INDEX
    this.router.get("/", function(req, res) {
      var query = {}
      if (req.params.id && this.scope) {
        query[this.scope] = req.params.id;
      }

      this.db.find(query, function(err, data){
        if(err) {
          res.status(500).json({error: err.toString()});
        }
        else {

          if (this.include) {
            // get all the ids from the records we just fetched
            var ids = data.map(function(d){
              return d._id;
            });
            
            // build the query for the include
            var qry = {}
            qry[this.include.fkey] = { "$in": ids};

            // find all the included records
            this.include.db.find(qry, function(err, fdata){
              if(err) {
                res.status(500).json({error: err.toString()});
              } else {
                // add the included records to each record
                data = data.map(function(record){
                  
                  record[this.include.as] = fdata.filter(function(frecord){
                    return frecord[this.include.fkey] === record._id;
                  }.bind(this));
                  
                  return record;
                
                }.bind(this));
                
                res.json(data);
              }
            }.bind(this));
          } else {
            res.json(data);
          }

          
        }
      }.bind(this));
    }.bind(this));

    // CREATE
    this.router.post("/", function(req, res){
      this.db.insert(req.body, function(err, data){
        if(err) {
          res.status(500).json({error: err.toString()});
        }
        else {
          res.json(data);
        }
      });
    }.bind(this));

  }

};

module.exports = CollectionRouter;
