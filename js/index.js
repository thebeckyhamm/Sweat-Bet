var express   = require("express");
var DataStore = require("nedb");

// used for setting the database path
var path = require("path");

var app = express();

// so express can read the body of the request
app.use(require("body-parser").json());

app.use(express.static("./"));

//app.set("view engine", "jade");

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


// pull in both constructors
var collectionRouter = require("./express_routers/collection_router");
var modelRouter = require("./express_routers/model_router");

// tell express to "mount" the routers to particular dbs and locations
app.use("/teams",             new collectionRouter(teamsDB).router);
app.use("/teams/:id/users",   new collectionRouter(usersDB, "_team_id").router);
app.use("/users/:id/goals",   new collectionRouter(goalsDB, "_user_id").router);
app.use("/goals/:id/entries", new collectionRouter(entryDB, "_goal_id").router);

app.use("/teams",   new modelRouter(teamsDB).router);
app.use("/users",   new modelRouter(usersDB).router);
app.use("/goals",   new modelRouter(goalsDB).router);
app.use("/entries", new modelRouter(entryDB).router);

app.get("/", function(req, res) {
  res.render("index");
});

var port = process.env.PORT || 8025;
console.log("listening on :" + port);
app.listen(port);







// var express = require("express");

// // express app
// var app = express();




// // directory to load static assets from
// app.use(express.static("/"));

// // needed so we can read json that is posted
// app.use(require("body-parser").json());

// // tell express to use the jade view
// app.set("view engine", "jade");

// // getting the exported stuff from tasks_router.js
// var teamsRouter = require("./teams_router");

// // mounted router to tasks
// app.use("/teams", teamsRouter);

// // gives callback a request and response object
// // this is similar to backbone router
// app.get("/", function(req, res) {
//     res.render("index");
// });


// console.log("Listening on port 8025");
// app.listen(8025);


