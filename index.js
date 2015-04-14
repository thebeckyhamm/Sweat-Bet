var express   = require("express");
var DataStore = require("nedb");
var Mongo     = require("mongodb").MongoClient;

var url = "mongodb://heroku_app35837159:4gs7ru8odn6qntvik1iqvmlfsp@ds061651.mongolab.com:61651/heroku_app35837159?replicaSet=rs-ds06165"

// used for setting the database path
var path = require("path");

var app = express();

// so express can read the body of the request
app.use(require("body-parser").json());

app.use(express.static("public"));

if (process.env.MONGOLAB_URI) {
  connectWithMongo();
} else {
  connectWithNedb();
}


function connectWithMongo() {
  var url = process.env.MONGOLAB_URI;

  Mongo.connect(url, function(err, db){
    
    console.log("connected to mongo");

    var teamsDB = db.collection("teams");
    var usersDB = db.collection("users");
    var goalsDB = db.collection("user_goals");
    var entryDB = db.collection("goal_entries");

    setupServer({
      teams: teamsDB,
      users: usersDB,
      goals: goalsDB,
      entries: entryDB,
    });
  });
}

function connectWithNedb() {
  console.log("connecting with nedb");

  // create a db with the correct filepath name
  // pass in the name when creating the db
  var db = function(name) {
    var filepath = path.join(__dirname, "nedb", name);
    return new DataStore({
      filename: filepath,
      autoload: true
    });
  }

  // 4 dbs: teams, users, goals, and entries
  var teamsDB = db("teams");
  var usersDB = db("users");
  var goalsDB = db("user_goals");
  var entryDB = db("goal_entries");

  setupServer({
    teams: teamsDB,
    users: usersDB,
    goals: goalsDB,
    entries: entryDB,
  });
}

function setupServer(db) {
  
  var teamsDB = db.teams;
  var usersDB = db.users;
  var goalsDB = db.goals;
  var entryDB = db.entries;

  var collectionRouter = require("./express_routers/collection_router");
  var modelRouter = require("./express_routers/model_router");

  // tell express to "mount" the routers to particular dbs and locations
  app.use("/teams",             new collectionRouter(teamsDB).router);
  app.use("/users",             new collectionRouter(usersDB, {include: {fkey: "user_id", db: goalsDB, as: "goals"}}).router);
  app.use("/users/:id/goals",   new collectionRouter(goalsDB, {scope:"user_id", include: {fkey: "goal_id", db: entryDB, as: "entries"}}).router);
  app.use("/goals/:id/entries", new collectionRouter(entryDB, {scope:"goal_id"}).router);

  app.use("/teams",   new modelRouter(teamsDB).router);
  app.use("/users",   new modelRouter(usersDB).router);
  app.use("/goals",   new modelRouter(goalsDB).router);
  app.use("/entries", new modelRouter(entryDB).router);

  app.get("/find_user_by_twitter_id/:twitter_id", function(req, res){
      usersDB.findOne({twitter_id: Number(req.params.twitter_id)}, function(err, data){
          if (err) {
              console.log("err:", err);
              res.status(500).json({error: err.toString()});
          } else {
            
              // console.log("data from find user", data);
              // console.log(data.length);
              res.json(data);
          }
      });
  });

  var port = process.env.PORT || 8025;
  console.log("listening on :" + port);
  app.listen(port);
}
