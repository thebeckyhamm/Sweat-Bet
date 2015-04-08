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

          
          // at this point we have data which is an array of goals
          // if we have an `include` (which is for associating entries to goals
          // but could be for associating anything to anything else) then we
          // need to get the records (entries) for each record (goal) in data
          if (this.include) {
            // this is the associated data
            var fdb = this.include.db;
            // this is the key on the assoc. data that ties each record
            var fkey = this.include.fkey;
            // this is what we call it when we assign the associated reocrds
            var as = this.include.as;

            // get all the (goal) ids from the records we just fetched
            var ids = data.map(function(d){
              return d._id;
            });
            
            // build the query for the include
            var qry = {}
            qry[fkey] = { "$in": ids};

            // ids: [1,2,3,4]

            // goals
            // [
            //   {_id 1, ...},
            //   {_id 2, ...},
            //   {_id 3, ...},
            //   {_id 4, ...},
            // ]

            // entries
            // [
            //   {_id: 56, goal_id: 1 ...},
            //   {_id: 57, goal_id: 2 ...},
            //   {_id: 58, goal_id: 3 ...},
            //   {_id: 59, goal_id: 4 ...},
            // ]

            // qry looks like {goal_id: {"$in" : [1,2,3,4]}}

            // find all the included records
            fdb.find(qry, function(err, fdata){
              if(err) {
                res.status(500).json({error: err.toString()});
              } else {
                // add the included records to each record
                data = data.map(function(record){
                  
                  // get assoc records (entries) for each record (goal)
                  record[as] = fdata.filter(function(frecord){
                    return frecord[fkey] === record._id;
                  });
                  
                  return record;
                
                });
                
                res.json(data);
              }
            });
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
