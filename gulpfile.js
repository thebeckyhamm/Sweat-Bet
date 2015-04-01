var gulp        = require("gulp");
var concat      = require("gulp-concat");
var sass        = require("gulp-sass");
var bower       = require("main-bower-files");
var react       = require("gulp-react");
var notify      = require("gulp-notify");
var plumber     = require("gulp-plumber");
var _           = require("underscore");
//var browserSync = require("browser-sync");


var notifyError = function() {
  return plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  });
}



//================================================
//  DEFAULT/WATCH
//================================================

gulp.task("default", ["sass", "react", "bower:assets"], function() {
  gulp.watch("./public/*.html");
  gulp.watch(sassPath, ["sass"]);
  gulp.watch(jsxPath, ["react"]);
  gulp.watch("bower.json", ["bower:assets"]);
});


//================================================
//  COMPILING ASSETS
//================================================

var sassPath    = "sass/**/*.scss";
var jsxPath     = "jsx/**/*.jsx";



// -- REACT TEMPLATES -- //

gulp.task('react', function () {
  gulp.src(jsxPath)
    .pipe(notifyError())
    .pipe(react())
    .pipe(concat("react_views.js"))
    .pipe(gulp.dest("./public/js/"));
});


// -- LESS STYLESHEETS -- //

gulp.task("sass", function() {
  gulp.src(sassPath)
    .pipe(notifyError())
    .pipe(sass())
    .pipe(gulp.dest("./public/css"));
});


//================================================
//  BOWER ASSETS
//================================================

gulp.task("bower:assets", ["bower:assets:js",
                           "bower:assets:dev",
                           "bower:assets:fonts"]);

// -- JAVASCRIPT -- //

gulp.task("bower:assets:js", function() {
  var files, sorted, dev;

  // get all bower js assets
  files = bower({filter: "**/*.js"});

  // make sure backbone is last in list
  sorted = _.sortBy(files, function(path) {
    if (path.match(/backbonefire\.js/)) {
      return 2;
    }
    if (path.match(/react\.backbone\.js/)) {
      return 2;
    }
    if (path.match(/backbone\.js/)) {
      return 1;
    }
    return 0;
  });

  gulp.src(sorted)
    .pipe(notifyError())
    .pipe(concat("vendor.js"))
    .pipe(gulp.dest("./public/vendor/js"));
});



// -- FONTS -- //

gulp.task("bower:assets:fonts", function(){
  var files;

  files = bower({filter: /\.(eot|svg|ttf|woff|woff2|otf)$/g});

  gulp.src(files)
    .pipe(notifyError())
    .pipe(gulp.dest("./public/vendor/fonts"));
});

// -- DEV ASSETS -- //

gulp.task("bower:assets:dev", function(){
  var files;

  files = _.difference(bower({includeDev: true}), bower());

  gulp.src(files)
    .pipe(notifyError())
    .pipe(gulp.dest("./public/vendor/dev"));
});


// //================================================
// //  BROWSERSYNC
// //================================================


// gulp.task('browser-sync', function() {
//     browserSync({
//         server: {
//             baseDir: "./"
//         }
//     });
// });