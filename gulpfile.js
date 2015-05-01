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

// 2. Define the static assets
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

  // Styles / Stylesheets
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
  pretty: true,            // human readable html, css and js
  maps: true,              // generate source maps
  jsName: "main.js",       // name of combined js
  cssName: "main.css",     // name of combined css (only relevant for minify method, names from sass are kept)
  livereloadOn: true,      // switch on and off livereload mode for auto refresh of browser
  autocompressImg: false   // switch on/off automatic compression of every image added. Alternatively use "gulp compress-img" manually
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
    uglify = require("gulp-uglify"),
    imagemin = require("gulp-imagemin"),
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
    .pipe(livereload());
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
    .pipe(livereload());
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
      .pipe(gulpif(!myOptions.pretty, minify()))
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest(myAssets.styles.dest))
    .pipe(livereload());
});

// concat and minify the existing css
gulp.task("minify", function() {
  return gulp.src("dist/css/**/*.css")
    .pipe(gulpif(myOptions.maps, sourcemaps.init()))
    .pipe(concat(cssName))
    .pipe(minify())
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest("dist/css/"))
    .pipe(livereload());
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
      .pipe(uglify({
        output: {
          beautify: myOptions.pretty
        }
      }))
      .pipe(concat(myOptions.jsName))
    .pipe(gulpif(myOptions.maps, sourcemaps.write()))
    .pipe(gulp.dest(myAssets.scripts.dest))
    .pipe(livereload());
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
  .pipe(livereload());
});

// collects images {png,jpg,gif} from different sources and copies them to dist/images
// the following img types are included: png, jpg, gif
gulp.task("img", function() {
  return gulp.src(myAssets.img.src)
  // compressing images if config.autocmpressImg is true
  .pipe(gulpif(myOptions.autocompressImg, imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}]
  })))
  .pipe(gulp.dest(myAssets.img.dest))
  .pipe(livereload());
});

// collects files from different sources and copies them to dist/files
// Attention! All extensions are collected
gulp.task("files", function() {
  return gulp.src(myAssets.files.src)
  .pipe(gulp.dest(myAssets.files.dest))
  .pipe(livereload());
});

// Separate task for compressing images to not compress all images all the time
// Looks in the dist/img folder, compresss the images and rewrites them to the same location
gulp.task("compress-img", function() {
  return gulp.src("dist/img/**/*.{png,jpg,gif}")
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest("dist/img/"))
    .pipe(livereload());
});


/*==============================================================
  Watchers
  ============================================================*/

// watching sass
gulp.task("watch-sass", function() {
  // if livereload is enabled create a server instance
  if(myOptions.livereloadOn) {
    livereload.listen();
  }
  gulp.watch(myAssets.styles.src, ["sass"]);
});

// watching jade
gulp.task("watch-jade", function() {
  // if livereload is enabled create a server instance
  if(myOptions.livereloadOn) {
    livereload.listen();
  }
  gulp.watch(myAssets.templ.src, ["jade"]);
  gulp.watch("src/index.jade", ["jade"]); // we call jade as this is the task that is run, the jade task executes index before itself
});

// watching scripts
gulp.task("watch-script", function() {
  // if livereload is enabled create a server instance
  if(myOptions.livereloadOn) {
    livereload.listen();
  }
  gulp.watch(myAssets.scripts.src, ["script"]);
});

// watching static assets
gulp.task("watch-static-assets", function() {
  // if livereload is enabled create a server instance
  if(myOptions.livereloadOn) {
    livereload.listen();
  }
  gulp.watch(myAssets.font.src, ["font"]);
  gulp.watch(myAssets.img.src, ["img"]);
  gulp.watch(myAssets.files.src, ["files"]);
});

// global watcher
gulp.task("watch", function() {
  // if livereload is enabled create a server instance
  if(myOptions.livereloadOn) {
    livereload.listen();
  }
  // TODO: create separate watchers for each directory with the respective task, so that not all tasks are executed all the time
  gulp.watch([
      "src/styles/**/*.scss",
      "src/templ/**/*.jade",
      "src/index.jade",
      myAssets.scripts.src,
      "src/assets/**/*"
    ],
    [
      "sass",
      "jade",
      "script",
      "assets"
    ]);
});