/**
 * SASSY JADE
 *
 * Opinionated gulpfile and frontend dev
 *
 * @author phil@rhinerock.com
 * @url http://rhinerock.com
 * @version 0.0.5
 * @license MIT
 */

/*==============================================================
  Util
  ============================================================*/

// Require in the plugins
var gulp = require("gulp"),
    del = require("del"),
    config = require("./sassyjade.config.json"),
    gulpif = require("gulp-if"),
    rename = require("gulp-rename"),
    changed = require("gulp-changed"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    jade = require("gulp-jade"),
    markdown = require("gulp-markdown"),
    sass = require("gulp-sass"),
    stylus = require("gulp-stylus"),
    prefix = require("gulp-autoprefixer"),
    minify = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    livereload = require("gulp-livereload");

// Plumber error stack
var onError = function(err) {
  console.log(err);
}

// Clean the styles source to only include files of the activated preprocessor
function getStylesSrc() {

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
      break;
    }
    outputArr.push(output);
  }

  return outputArr;
}

/*==============================================================
  Jade / Markdown
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
    .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished updating your index file."})));
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
    .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished compiling Jade."})));
});

// grab the markdown files and compile
gulp.task("markdown", function() {
  return gulp.src(config.markdown.src)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(markdown())
    .pipe(gulp.dest(config.markdown.dest))
    .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished rendering markdown."})));
});

/*==============================================================
  SASS / Stylus / CSS
  ============================================================*/

// convert sass or stylus to css
// create sourcemaps
// plumber applied to keep sass or stylus running in case of typos
// create sourcemaps if config.option.maps is true
gulp.task("style", function() {
  return gulp.src(getStylesSrc())
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
    .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished compiling "+config.option.preprocessor+"."})));
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
    .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished compiling JS."})));
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
gulp.task("static-assets", ["font", "img", "files"], function(cb) {
  cb(); // hack to indicate that task finished
});

// first deletes all asset folders and then recreates them
gulp.task("clean-static-assets", ["kill-static-assets", "static-assets"], function(cb) {
  cb(); // hack to indicate that task finished
});

// collects fonts from different sources and copies them to dist/fonts
// the following extensions will be included: eot, svg, ttf, woff, woff2
gulp.task("font", function() {
  return gulp.src(config.font.src)
  .pipe(changed(config.font.dest))
  .pipe(gulp.dest(config.font.dest))
  .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished copying fonts."})));
});

// collects images {png,jpg,gif} from different sources and copies them to dist/images
// the following img types are included: png, jpg, gif
gulp.task("img", function() {
  return gulp.src(config.img.src)
    .pipe(changed(config.img.dest))
  .pipe(gulp.dest(config.img.dest))
  .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished copying images."})));
});

// collects files from different sources and copies them to dist/files
// Attention! All extensions are collected
gulp.task("files", function() {
  return gulp.src(config.files.src)
  .pipe(changed(config.files.dest))
  .pipe(gulp.dest(config.files.dest))
  .pipe(gulpif(config.option.messages, notify({onLast: true, message: "Sassyjade finished copying files."})));
});

/*==============================================================
  Overall build tasks
  ============================================================*/

// runs all tasks in order to (re-)build the dist/
gulp.task("build", ["index", "jade", "markdown", "style", "script", "static-assets"], function() {
  return notify({onLast: true, message: "Sassyjade finished building."});
});

// default task should do the same as build
gulp.task("default", ["index", "jade", "markdown", "style", "script", "static-assets"], function() {
  return notify({onLast: true, message: "Sassyjade finished building."});
});

gulp.task("rebuild", ["kill", "index", "jade", "markdown", "style", "script", "static-assets"], function() {
  return notify({onLast: true, message: "Sassyjade finished rebuilding."});
});

/*==============================================================
  Watchers
  ============================================================*/

// watching sass or stylus
gulp.task("watch-style", function() {
  gulp.watch(getStylesSrc(), ["style"]);

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

// watching markdown
gulp.task("watch-markdown", function() {
  gulp.watch(config.markdown.src, ["markdown"]);

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

  // Watch Markdown
  gulp.watch(config.markdown.src, ["markdown"]);

  // Watch Sass or Sylus
  gulp.watch(getStylesSrc(), ["style"]);

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

/*==============================================================
  Killers
  ============================================================*/

/**
 * Util function to display the kill messages in the console
 * @params str the item that got deleted
 * @params str the task to run to recreate it
 * @return str the message to be displayed
 */
function getKillMsg(killed, recreate) {
  var msg = "Sassyjade killed the ";
  msg += killed;
  msg += ". Run <gulp ";
  msg += recreate;
  msg += "> to recreate it.";
  console.log(msg);
}

// Overall killer
gulp.task("kill", function(cb) {
  del("dist/");
  getKillMsg("full distribution", "build");
  cb(); // hack to indicate that task finished
});

// Kills the index file
gulp.task("kill-index", function() {
  del("dist/index.html");
  return getKillMsg("index file", "index");
});

// Kills all views and the index file
gulp.task("kill-jade", function() {
  del([
      config.templ.dest,
      "dist/index.html"
    ]);
  return getKillMsg("views and index files", "jade");
});

// Kills the docs
gulp.task("kill-markdown", function() {
  del(config.markdown.dest);
  return getKillMsg("docs folder", "markdown");
});

// Kills the css
gulp.task("kill-style", function() {
  del(config.styles.dest);
  return getKillMsg("css folder", "style");
});

// Kills the js
gulp.task("kill-script", function() {
  del(config.scripts.dest);
  return getKillMsg("js folder", "script");
});

// Kills the images
gulp.task("kill-img", function() {
  del(config.img.dest);
  return getKillMsg("img folder", "img");
});

// Kills the fonts
gulp.task("kill-font", function() {
  del(config.font.dest);
  return getKillMsg("font folder", "font");
});

// Kills the files
gulp.task("kill-files", function() {
  del(config.files.dest);
  return getKillMsg("files folder", "files");
});

// Kills fonts, files and images
gulp.task("kill-static-assets", function(cb) {
  del([
      config.img.dest,
      config.font.dest,
      config.files.dest
    ]);
    getKillMsg("static assets", "static-assets");
    cb(); // hack to indicate that task finished
});