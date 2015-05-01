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

// 2. Define assets
//============================================================
// Collection of sources and destinations of static assets
// For each category multiple sources can be specified
// but each category has 1 destination to keep the dist lean

var myAssets = {

  // Templates
  templ: {
      src: [
        "src/templ/**/*.jade",
        "!src/templ/index.jade", // excl index.jade
        "!src/templ/incl/*.jade", // excl folder incl/
        "!src/templ/mixin/*.jade" // excl folder mixin/
      ],
      dest: "dist/views/"
  },

  // Scripts
  scripts: {
      src: [
        "src/scripts/**/*.js",
        "node_modules/materialize-css/bin/materialize.js"
      ],
      dest: "dist/js/"
  },

  // SASS Stylesheets
  styles: {
      src: [
        "src/styles/**/*.scss"
      ],
      dest: "dist/css/"
  },
  
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
  messages: true,          // enable system messages
  pretty: true,            // human readable html
  maps: true,              // generate source maps
  jsName: "main.js",       // name of combined js
  cssName: "main.css",     // name of combined css (only relevant for minify method, names from sass are kept)
  livereloadOn: true       // switch on and off livereload mode for auto refresh of browser
}

//==================END OF CONFIG============================

// Require in the plugins
var gulp = require("gulp"),
    gulpif = require("gulp-if"),
    rename = require("gulp-rename"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    jade = require("gulp-jade"),
    sass = require("gulp-sass"),
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
      pretty: myOptions.pretty
    }))
    .pipe(gulp.dest("dist/"))
    .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished updating your index file."})));
});

// grabs all templates in all folders after running the index task
// except the incl/ and mixin/ folder
// also omits the index.jade which will be placed in the root
// plumber applied to keep jade running in case of typos
gulp.task("jade", ["index"],function() {
  return gulp.src(myAssets.templ.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(jade({
      pretty: myOptions.pretty
    }))
    .pipe(gulp.dest(myAssets.templ.dest))
    .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished compiling Jade."})));
});


/*==============================================================
  SASS / CSS
  ============================================================*/

// convert sass to css
// create sourcemaps
// plumber applied to keep sass running in case of typos
// create sourcemaps if myOptions.maps is true
gulp.task("sass", function() {
  return gulp.src(myAssets.styles.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gulpif(myOptions.maps, sourcemaps.init()))
      .pipe(sass())
      .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(concat(myOptions.cssName))
      .pipe(gulp.dest(myAssets.styles.dest))
      .pipe(rename({suffix: ".min"}))
      .pipe(minify())
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest(myAssets.styles.dest))
    .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished compiling Sass."})));
});


/*==============================================================
  JS
  ============================================================*/

// concatenate and uglify JS
// create sourcemaps if myOptions.maps is true
// output pretty script if myOptions.pretty is true
gulp.task("script", ["jshint"], function() {
  return gulp.src(myAssets.scripts.src)
    .pipe(plumber())
    .pipe(gulpif(myOptions.maps, sourcemaps.init()))
      .pipe(concat(myOptions.jsName))
      .pipe(gulp.dest(myAssets.scripts.dest))
      .pipe(rename({suffix: ".min"}))
      .pipe(uglify())
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest(myAssets.scripts.dest))
    .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished compiling JS."})));
});

// Util task to hint through JS and check for any errors
gulp.task("jshint", function() {
  return gulp.src(myAssets.scripts.src)
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
  return gulp.src(myAssets.font.src)
  .pipe(gulp.dest(myAssets.font.dest))
  .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished copying fonts."})));
});

// collects images {png,jpg,gif} from different sources and copies them to dist/images
// the following img types are included: png, jpg, gif
gulp.task("img", function() {
  return gulp.src(myAssets.img.src)
  // compressing images if config.autocmpressImg is true
  .pipe(cache(imagemin({
    optimizationLevel: 3, progressive: true, interlaced: true, svgoPlugins: [{removeViewBox: false}]
  })))
  .pipe(gulp.dest(myAssets.img.dest))
  .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished compressing and copying images."})));
});

// collects files from different sources and copies them to dist/files
// Attention! All extensions are collected
gulp.task("files", function() {
  return gulp.src(myAssets.files.src)
  .pipe(gulp.dest(myAssets.files.dest))
  .pipe(gulpif(myOptions.messages, notify({message: "Sassyjade finished copying files."})));
});


/*==============================================================
  Watchers
  ============================================================*/

// watching sass
gulp.task("watch-sass", function() {
  gulp.watch(myAssets.styles.src, ["sass"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(myOptions.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// watching jade
gulp.task("watch-jade", function() {
  gulp.watch(myAssets.templ.src, ["jade"]);
  gulp.watch("src/index.jade", ["jade"]); // we call jade as this is the task that is run, the jade task executes index before itself

  // if livereload is enabled create a server and watch the files in the dist/
  if(myOptions.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// watching scripts
gulp.task("watch-script", function() {
  gulp.watch(myAssets.scripts.src, ["script"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(myOptions.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }
});

// watching static assets
gulp.task("watch-static-assets", function() {
  gulp.watch(myAssets.font.src, ["font"]);
  gulp.watch(myAssets.img.src, ["img"]);
  gulp.watch(myAssets.files.src, ["files"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(myOptions.livereloadOn) {

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
  gulp.watch(myAssets.templ.src, ["jade"]);

  // Watch Sass
  gulp.watch(myAssets.styles.src, ["sass"]);

  // Watch Scripts
  gulp.watch(myAssets.scripts.src, ["script"]);

  // Watch Images
  gulp.watch(myAssets.img.src, ["img"]);

  // Watch Fonts
  gulp.watch(myAssets.font.src, ["font"]);

  // Watch files
  gulp.watch(myAssets.files.src, ["files"]);

  // if livereload is enabled create a server and watch the files in the dist/
  if(myOptions.livereloadOn) {

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);
  }

});
















