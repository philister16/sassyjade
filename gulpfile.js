/**
 * SASSY JADE
 *
 * Opinionated gulpfile and frontend dev
 *
 * @author phil@rhinerock.com
 * @url http://rhinerock.com
 * @version 0.0.3
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
//                    it looks for assets based on the sources defined in the config object config
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

// 1. Folder structure
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


// Require in the plugins
var gulp = require("gulp"),
    config = require("./sassyjade.config.json"),
    gulpif = require("gulp-if"),
    rename = require("gulp-rename"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
    stylus = require("gulp-stylus"),
    prefix = require("gulp-autoprefixer"),
    minify = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    imagemin = require("gulp-imagemin"),
    cache = require("gulp-cache"),
    livereload = require("gulp-livereload");

// Plumber error stack
var onError = function(err) {
  console.log(err);
}

/*==============================================================
  Jade
  ============================================================*/

// grabs the index file from the src and compiles it to the dist
// using jade
gulp.task("index", function() {
  return gulp.src("src/index.jade")
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jade({
      pretty: config.option.pretty
    }))
    .pipe(gulp.dest("dist/"))
    .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished updating your index file."})));
});

// grabs all templates in all folders after running the index task
// except the incl/ and mixin/ folder
// also omits the index.jade which will be placed in the root
// plumber applied to keep jade running in case of typos
gulp.task("jade", ["index"],function() {
  return gulp.src(config.templ.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jade({
      pretty: config.option.pretty
    }))
    .pipe(gulp.dest(config.templ.dest))
    .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished compiling Jade."})));
});


/*==============================================================
  SASS / Stylus / CSS
  ============================================================*/

// TODO: unwatch the files of the other preprocesssor
gulp.task("unwatch-util", function() {

// TODO: Check if array is correctly loaded, create multiple folders and files in the config.src
console.log(config.styles.src);

  var outputArr = [];
  var output;
  for(var i = 0; i < config.styles.src.length; i++) {
    output = config.styles.src[i].substr(0,config.styles.src[i].length - 11);
    if(config.option.preprocessor === "sass") {
      output += "scss";
    } else if (config.option.preprocessor === "stylus") {
      output += "styl";
    } else {
      console.log("Error while executing gulp task 'style': No valid preprocessor defined. Check your sassyjade.config.json.");
    }
    outputArr.push(output);
  }
  console.log(outputArr);
});


// convert sass or stylus to css
// create sourcemaps
// plumber applied to keep sass or stylus running in case of typos
// create sourcemaps if config.option.maps is true
gulp.task("style", function() {
  return gulp.src(config.styles.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulpif(config.option.maps, sourcemaps.init()))
      .pipe(gulpif(config.option.preprocessor === "sass", sass()))
      .pipe(gulpif(config.option.preprocessor === "stylus", stylus()))
      .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(concat(config.option.cssName))
      .pipe(gulp.dest(config.styles.dest))
      .pipe(rename({suffix: ".min"}))
      .pipe(minify())
    .pipe(gulpif(config.option.maps, sourcemaps.write()))
    .pipe(gulp.dest(config.styles.dest))
    .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished compiling Sass."})));
});


/*==============================================================
  JS
  ============================================================*/

// concatenate and uglify JS
// create sourcemaps if config.option.maps is true
// output pretty script if config.option.pretty is true
gulp.task("script", ["jshint"], function() {
  return gulp.src(config.scripts.src)
    .pipe(plumber())
    .pipe(gulpif(config.option.maps, sourcemaps.init()))
      .pipe(concat(config.option.jsName))
      .pipe(gulp.dest(config.scripts.dest))
      .pipe(rename({suffix: ".min"}))
      .pipe(uglify())
    .pipe(gulpif(config.option.maps, sourcemaps.write()))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished compiling JS."})));
});

// Util task to hint through JS and check for any errors
gulp.task("jshint", function() {
  return gulp.src(config.scripts.src)
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
  return gulp.src(config.font.src)
  .pipe(gulp.dest(config.font.dest))
  .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished copying fonts."})));
});

// collects images {png,jpg,gif} from different sources and copies them to dist/images
// the following img types are included: png, jpg, gif
gulp.task("img", function() {
  return gulp.src(config.img.src)
  // compressing images if config.autocmpressImg is true
  .pipe(cache(imagemin({
    optimizationLevel: 3, progressive: true, interlaced: true, svgoPlugins: [{removeViewBox: false}]
  })))
  .pipe(gulp.dest(config.img.dest))
  .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished compressing and copying images."})));
});

// collects files from different sources and copies them to dist/files
// Attention! All extensions are collected
gulp.task("files", function() {
  return gulp.src(config.files.src)
  .pipe(gulp.dest(config.files.dest))
  .pipe(gulpif(config.option.messages, notify({message: "Sassyjade finished copying files."})));
});


/*==============================================================
  Watchers
  ============================================================*/

// watching sass or stylus
gulp.task("watch-style", function() {
  gulp.watch(config.styles.src, ["style"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(config.option.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// watching jade
gulp.task("watch-jade", function() {
  gulp.watch(config.templ.src, ["jade"]);
  gulp.watch("src/index.jade", ["jade"]); // we call jade as this is the task that is run, the jade task executes index before itself

  // if livereload is enabled create a server and watch the files in the dist/
  if(config.option.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// watching scripts
gulp.task("watch-script", function() {
  gulp.watch(config.scripts.src, ["script"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(config.option.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// watching static assets
gulp.task("watch-static-assets", function() {
  gulp.watch(config.font.src, ["font"]);
  gulp.watch(config.img.src, ["img"]);
  gulp.watch(config.files.src, ["files"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(config.option.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// global watcher
gulp.task("watch", function() {

  // Watch Index
  gulp.watch("src/index.jade", ["index"]);

  // Watch Jade
  gulp.watch(config.templ.src, ["jade"]);

  // Watch Sass or Sylus
  gulp.watch(config.styles.src, ["style"]);

  // Watch Scripts
  gulp.watch(config.scripts.src, ["script"]);

  // Watch Images
  gulp.watch(config.img.src, ["img"]);

  // Watch Fonts
  gulp.watch(config.font.src, ["font"]);

  // Watch files
  gulp.watch(config.files.src, ["files"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(config.option.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }

});