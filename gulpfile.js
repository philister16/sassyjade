/*
###
### Has TODO's
###
*/

/**
 * SASSY JADE
 *
 * Opinionated gulpfile and frontend dev
 *
 * @author phil@rhinerock.com
 * @url http://rhinerock.com
 * @version 0.0.2
 * @license MIT
 */

/*==============================================================
  CLI usage
  ============================================================*/

// Gulp Tasks

// gulp index         creates the index.html
//                    looks for index.jade at src/ and outputs index.html at dist/
// gulp jade          builds the html views
//                    looks for .jade files within src/templ and outputs .html at dist/views
//                    the incl and dist folders are invisible
// gulp sass          compiles sass to css
//                    looks for .scss files in the src/sass/ folder and writes css into dist/css/
// gulp minify        minifies existing css files
//                    looks for all css files in the dist/css folder, concatenates and minifies them
// gulp script        concatenates and uglifies all javascripts
//                    looks for javascript in the src/scripts/ folder and writes to the dist/js folder
// gulp asset         copies all assets to the dist version
//                    it looks for assets based on the sources defined in the config object myAssets
//                    this command can also be called as gulp assets
// gulp font          same functionality as gulp asset but targets only fonts
// gulp img           same functionality as gulp asset but targets only images
// gulp files         same functionality as gulp asset but targets only files

// Gulp Watcher

// gulp watch         realizes any changes in the src/ folder and executes "gulp jade", "gulp sass", "gulp script" and "gulp asset"
// gulp watch-sass    realizes changes in the src/sass/ folder and executes "gulp sass"
// gulp watch-jade    realizes changes in the src/templ/ folder and executes "gulp jade"
// gulp watch-script  realizes changes in the src/scripts/ folder and executes "gulp script"
// gulp watch-assets  realizes changes in the src/assets/ folder and executes "gulp asset"


/*==============================================================
  Config
  ============================================================*/

// 0. Folder structure
//============================================================
// Your app should have the following (opinionated) structure:

/*
app-root
  |-node_modules/
  |  |-[dependencies managed by npm]
  |-src/
  |  |-assets/
  |  |  |-files
  |  |  |-font
  |  |  |-img
  |  |-scripts/
  |  |-styles/
  |  |-templ
  |  |  |-incl
  |  |  |-mixin
  |  |-index.jade    --> special entry file, has to be created at the root of src
  |-gulpfile.js
  |-package.json
  |-dist/             --> don't touch! is created and managed automatically through Gulp
*/

// 1. Define the JS of the project
//============================================================
// Collection of sources and destination of scripts

var myScripts = {
  src: [
    "src/scripts/**/*.js",
    "node_modules/materialize-css/bin/materialize.js"
  ],
  dest: "dist/js/"
}

// 2. Define the static assets
//============================================================
// Collection of sources and destinations of static assets
// For each category multiple sources can be specified
// but each category has 1 destination to keep the dist lean

var myAssets = {
  
  // Fonts
  font: {
    src: [
      "src/assets/font/**/*.{eot,svg,ttf,woff,woff2}",
      "node_modules/materialize-css/font/**/*.{eot,svg,ttf,woff,woff2}"
    ],
    dest: "dist/font/"
  },
  
  // Images
  img: {
    src: [
      "src/assets/img/**/*.{png,jpg,gif}"
    ],
    dest: "dist/img/"
  },
  
  // Files
  files: {
    src: [
      "src/assets/files/**/*"
    ],
    dest: "dist/files/"
  }
}

// 3. Options
//============================================================

var myOptions = {
  pretty: true,       // human readable html, css and js
  maps: true,         // generate source maps
  jsName: "main.js",  // name of combined js
  cssName: "main.css" // name of combined css (only relevant for minify method, names from sass are kept)
}

//==================END OF CONFIG============================

// Require in the plugins
var gulp = require("gulp"),
    gulpif = require("gulp-if"),
    plumber = require("gulp-plumber"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
    minify = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify");

var onError = function(err) {
  console.log(err);
}

/*==============================================================
  Jade
  ============================================================*/

// grabs the index file from the src and compiles it to the dist
// using jade
gulp.task("index", function() {
  gulp.src("src/index.jade")
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jade({
      pretty: myOptions.pretty
    }))
    .pipe(gulp.dest("dist/"))
});

// grabs all templates in all folders after running the index task
// except the incl/ and mixin/ folder
// also omits the index.jade which will be placed in the root
// plumber applied to keep jade running in case of typos
gulp.task("jade", ["index"],function() {
  gulp.src([
      "src/templ/**/*.jade",
      "!src/templ/index.jade", // excl index.jade
      "!src/templ/incl/*.jade", // excl folder incl/
      "!src/templ/mixin/*.jade" // excl folder mixin/
    ])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jade({
      pretty: myOptions.pretty
    }))
    .pipe(gulp.dest("dist/views"))
});


/*==============================================================
  SASS / CSS
  ============================================================*/

// convert sass to css
// create sourcemaps
// plumber applied to keep sass running in case of typos
// create sourcemaps if myOptions.maps is true
gulp.task("sass", function() {
  gulp.src("src/styles/**/*.scss")
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulpif(myOptions.maps, sourcemaps.init()))
      .pipe(sass())
      .pipe(gulpif(!myOptions.pretty, minify()))
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest("dist/css/"))
});

// concat and minify the existing css
gulp.task("minify", function() {
  gulp.src("dist/css/**/*.css")
    .pipe(gulpif(myOptions.maps, sourcemaps.init()))
    .pipe(concat(cssName))
    .pipe(minify())
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest("dist/css/"))
});


/*==============================================================
  JS
  ============================================================*/

// concatenate and uglify JS
// create sourcemaps if myOptions.maps is true
// output pretty script if myOtpions.pretty is true
gulp.task("script", ["jshint"], function() {
  gulp.src(myScripts.src)
    .pipe(plumber())
    .pipe(gulpif(myOptions.maps, sourcemaps.init()))
      .pipe(uglify({
        output: {
          beautify: myOptions.pretty
        }
      }))
      .pipe(concat(myOptions.jsName))
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest(myScripts.dest))
});

// Util task to hint through JS and check for any errors
gulp.task("jshint", function() {
  return gulp.src(myScripts.src)
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});

/*==============================================================
  Copy Static Assets
  ============================================================*/

// copy all static assets to the dist version
// @sub-tasks: [fonts, img, files]
gulp.task("assets", ["font", "img", "files"]);
gulp.task("asset", ["font", "img", "files"]); // can be called as "assets" or "asset"

// collects fonts from different sources and copies them to dist/fonts
// the following extensions will be included: eot, svg, ttf, woff, woff2
gulp.task("font", function() {
  gulp.src(myAssets.font.src)
  .pipe(gulp.dest(myAssets.font.dest))
});

// collects images {png,jpg,gif} from different sources and copies them to dist/images
// the following img types are included: png, jpg, gif
gulp.task("img", function() {
  gulp.src(myAssets.img.src)
  // TODO compress images
  .pipe(gulp.dest(myAssets.img.dest))
});

// collects files from different sources and copies them to dist/files
// Attention! All extensions are collected
gulp.task("files", function() {
  gulp.src(myAssets.files.src)
  .pipe(gulp.dest(myAssets.files.dest))
});


/*==============================================================
  Watchers
  ============================================================*/

// TODO: integrate livereload

// watching sass
gulp.task("watch-sass", function() {
  gulp.watch("src/styles/**/*.scss", ["sass"]);
});

// watching jade
gulp.task("watch-jade", function() {
  gulp.watch(["src/templ/**/*.jade", "src/index.jade"], ["jade"]);
});

// watching scripts
gulp.task("watch-script", function() {
  gulp.watch(myScripts.src, ["script"]);
});

// watching static assets
gulp.task("watch-assets", function() {
  gulp.watch("src/assets/**/*", ["assets"]);
});

// global watcher
gulp.task("watch", function() {
  // TODO: create separate watchers for each directory with the respective task, so that not all tasks are executed all the time
  gulp.watch([
      "src/styles/**/*.scss",
      "src/templ/**/*.jade",
      "src/index.jade",
      myScripts.src,
      "src/assets/**/*"
    ],
    [
      "sass",
      "jade",
      "script",
      "assets"
    ]);
});