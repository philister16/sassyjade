# Sassyjade
Op'ed front-end dev boilerplate with Sass and Jade on Gulp.
## Installation via command line
You can use Saja - Sassyjade's small and simple command line interface to start a new project. The CLI is installed via npm.
```bash
$ npm install -g saja
```
## Getting started
Once you have installed Saja - the Sassyjade CLI globally you can start a new project with 1 simple command:
```bash
$ saja <yourProject>
```
This command will fetch the latest version of [Sassyjade](http://rhinerock.com/sassyjade) boilerplate and install all its dependencies in a new folder called "yourProject", relative to the folder from where you ran the command.

Since the command also installs all necessary dependencies via npm you might run into some permission errors. In this case try to execute the command as super user: `$ sudo saja <yourProject>`.

After that, to start working do:
```
$ cd <yourProject>
$ gulp watch
```
If you don't want the default folder and file structre of Sassyjade add the `--blank` flag. You can also just use `-b` instead.
```
$ saja --blank <yourProject>
```
### Manual Download

If for some reason you don't want or cannot use Saja - the Sassyjade CLI you may alternatively just manually download the latest version of the Sassyjade boilerplate as a ZIP file.

[Sassyjade-0.0.5.zip](http://rhinerock.com/sassyjade/files/sassyjade-0.0.5.zip)

To get started unzip the file into your project folder. Then check that in the root of your project folder the file `package.json` exists. If it does go ahead and install Sassyjade's dependencies via npm and then start the gulp process.
```
$ sudo npm install
$ gulp watch
```
## Working with Sassyjade
Sassyjade is a frontend development boilerplate and build process. It uses the template language [Jade](http://jade-lang.com) to build html pages, the [Sass](http://sass-lang.com) preprocessor to generate css stylesheets and [Gulp](http://gulpjs.com) to manage the build processes. Please refer to the documentation of these awesome tools to find out more what these do, how these work and why these are useful.

Sassyjade is opinionated. This means it has a default folder and file structure which dictate the workflow in a broad way.

However, the folder and file structure can be changed via the `sassyjade.config.json` file to match your preferences.
### Default folders and files
    app-root
      |-sassyjade.config.json
      |-node_modules/
      |-src/
      |  |-assets/
      |  |  |-files/
      |  |  |-font/
      |  |  |-img/
      |  |  |-docs/
      |  |-scripts/
      |  |-styles/
      |  |-templ/
      |  |  |-incl/
      |  |  |  |-config.jade
      |  |  |-mixin/
      |  |  |  |-jadestones.jade
      |  |  |-layout/
      |  |  |  |-base.jade
      |  |-index.jade
      |-gulpfile.js
      |-package.json
      |-dist/
Do take note that if you decide to change the folder structure, you also need to update the `sassyjade.config.json` accordingly. Your project should always have a `src` and a `dist` folder at the minimum.
#### node_modules/
Contains all dependencies and is managed by npm.
#### src/
The "source" folder - this is where the development files live.
#### src/assets/
Contains all static assets split into 4 sub-folders: images, fonts, docs and files for any other file type. Sassyjade expects your docs to by written in markdown.
#### src/scripts/
Contains all javascripts which will be compiled to a single script.
#### src/styles/
Contains all CSS preprocessor files such as SASS and Stylus, which will be compiled to a single CSS stylesheet.
#### src/templ/
Contains Jade templates which will be compiled into html views.
#### dist/
The "production" folder - it is managed by Sassyjade. Generally there is no need to manipulate it manually.
### Configuration
The `sassyjade.config.json` lets you define the paths in the source folders which are observed by Gulp.

Every object in the `sassyjade.config.json` represents a the configuration settings for a Gulp task. The name of the object is identical with the Gulp task which can be called by this name. As such, the names should not be changed.

For example to change the path where to look for your Sass edit the `style.src` property.
```json
"styles": {
      "src": [
        "src/styles/**/*.{scss,styl}"
      ],
      "dest": "dist/css/"
  }
```
The default configuration for each Gulp task is documented together with the respective Gulp task itself.

Please note that you should not change the first and second level of `sassyjade.config.json` as the gulp tasks depend on these. In above example only the values of `src` and `dest` should be changed. The first level, in above example `styles` refers to the respective gulp task.

For the `src` you can generally define more than one folders to observe. `dest` on the other hand can always only have 1 folder.
### Options
In `sassyjade.config.json` you can also define some basic global options.
```json
"option": {
"messages": true,
"pretty": true,
"maps": true,
"jsName": "main.js",
"cssName": "main.css",
"livereloadOn": true,
"preprocessor": "sass"
}
```
Option | Values | Default | Description
:----- | :----- | :------ | :----------
`messages` | boolean | `true` | Shows Sassyjade system messages when tasks ran successfully.
`pretty` | boolean | `true` | Makes the compiled html, css and JS human-readable
`maps` | boolean | `true` | Writes sourcemaps of CSS and JS files.
`jsName` | string | `"main.js"` | The name of the concatenated javascript.
`cssName` | string | `"main.css"` | The name of the concatenated and compiled CSS file.
`livereloadOn` | boolean | `true` | Automatic refresh of the browser on save (needs external browser plugin to work!)
`preprocessor` | string | `"sass"` | The preprocessor of choice as string. Besides Sass also Stylus is supported.
### Gulp Tasks
Sassyjade comes with multiple pre-defined gulp tasks.

For each task, default source and destination folders are predefined. They can be changed in `sassyjade.config.json` if needed.
#### `$ gulp build`
Make an all new build of the project. This command runs all other defined tasks once together. As this is the default Gulp task you can just use the shorthand `$ gulp` instead.
#### `$ gulp rebuild`
Same as build but cleans out the dist/ folder completely beforehand. This is useful to ensure that files which were deleted from the src/ but still exist at the dist/ from earlier builds are deleted.
#### `$ gulp index`
Looks up the index file in the source, compiles and copies it to the distribution version.
##### Config:
Sassyjade expects an `index.jade` file at the `/src/templ/` folder. This will be resolved to an `index.html` file at the root of the `/dist/` folder.

#### `$ gulp jade`
Sees jade files and compiles them into html. This task also runs the index task automatically.
##### Default config:
```
"templ": {
      "src": [
        "src/templ/**/*.jade",
        "!src/templ/index.jade",
        "!src/templ/incl/*.jade",
        "!src/templ/mixin/*.jade",
        "!src/templ/layout/*.jade"
      ],
      "dest": "dist/views/"
  }
```
Due to its special nature the `index.jade` file should generally be excluded. It is handled by the special `$ gulp index` task. Sassyjade always expects the index files at the root folders in both `/src/` and `/dist/`.
#### `$ gulp markdown`
Sees markdown (.md) files and compiles them into html.
##### Default config:
```
"markdown": {
      "src": [
        "readme.md",
        "src/assets/docs/**/*.md"
      ],
      "dest": "dist/docs/"
  }
```
Sassyjade assumes that the main readme file lives at the root of the project folder. It is generally the only evaluated file which should live there.
#### `$ gulp style`
Identifies stylesheets of the preprocessor selected and compiles these into 1 css file.
##### Default config:
```
"styles": {
      "src": [
        "src/styles/**/*.{scss,styl}"
      ],
      "dest": "dist/css/"
  }
```
Please note that only the files of the preprocessor set in `sassyjade.config.json` are evaluated, despite declaring multiple file types.
#### `$ gulp script`
Sees javascript files, concatenates and compiles them into one script file.
##### Default config:
```
"scripts": {
      "src": [
        "src/scripts/**/*.js"
      ],
      "dest": "dist/js/"
  }
```
Please note that the order of the sources matters! For example, if you intend to use a library such as jQuery make sure to specify its source path first. This way, the files of the sources declared thereafter can depend on it.
#### `$ gulp font`
Copies fonts from the source to the destination specified.
##### Default config:
```
"font": {
    "src": [
      "src/assets/font/**/*.{eot,svg,ttf,woff,woff2,otf}"
    ],
    "dest": "dist/font/"
  }
```
#### `$ gulp img`
Copies images from the source to the destination specified.
##### Default config:
```
"img": {
    "src": [
      "src/assets/img/**/*.{png,jpg,gif}"
    ],
    "dest": "dist/img/"
  }
```
#### `$ gulp files`
Copies changed files from the source into the destination selected.
##### Default config:
```
"files": {
    "src": [
      "src/assets/files/**/*"
    ],
    "dest": "dist/files/"
  }
```
#### `$ gulp static-assets`
Runs the 3 tasks `font`, `img` and `files` together.
### Gulp watchers
Every defined stand-alone Gulp task comes with a built-in watcher that runs the task everytime a relevant file changes. To run a task and keep watching the files simply prepend the task with `watch-`.
```
$ gulp watch-<task>
```
For example: to watch for changes on the jade templates run: `$ gulp watch-jade`.
#### `$ gulp watch`
A special, global watch task that keeps track of all changes and updates the relevant files.
### Gulp killers
Every defined stand-alone Gulp taks comes with a built-in killer that deletes the task's output in the dist/ folder completely. To run the killer on any task simply prepend it with `kill-`. Killers are useful to clean the dist/ from any old files which might have been deleted at the src/ but still exist at the dist/.
```
$ gulp kill-<task>
```
For example: to kill (= delete) all static-assets run: `$ gulp kill-static-assets`.
#### `$ gulp kill`
Is a special, global kill task that deletes the entire dist/ folder completely. This might be useful before building for production to make sure all old files are wiped before uploading the build to the server.
### Livereload
Sassyjade is livereload enabled by default. In order for the browser to refresh automatically you need the respective livereload plugin. Refer to the [livereload documentation](http://livereload.com).
## Jade Templates
Sassyjade has a predefined Jade templates structure. You are free to change it as you wish. Please note that this documentation only deals with the usage of Jade and its building blocks in context of the Sassyjade boilerplate. Please refer to the [Jade API](http://jade-lang.com) to understand how the language works in detail.
### Folder structure
    templ/
    |--incl/      // contains reusable snippets
    |--layout/    // defines the layout structure of pages
    |--mixin/     // contains all mixin
All Jade files are contained within the `templ` folder and are organized in 3 sub-folders. The actual templates which are evaluated to html live at the root directory. You can organize these in folders as well.

### Jade configuration
In the `templ/incl` folder lives the `config.jade` file. If you are using Sassyjade's CLI "saja" to setup your project, it allows you to configure this file via command line.
```jade
//- Project name
- var site = 'Sassyjade';
```
Sets the site name of the project. It can be used with the `<title>`-tag for example.
```jade
//- Page title format
- var title = site + ' | ' + page;
```
Sets the global format of the page titles. Above default version would evaluate into something like `<title>Sassyjade | Home</title>`. Please note that the page variable can be set on each individual page. This way you can have different titles such as "Home", "About", "Contact" etc. for each template.
```jade
//- Project root
- var root = '/path/to/sassyjade/dist/';
```
Sets the root of the dist/ of the project. If you develop locally you have to pass the full path to the `dist/` on your machine. This is helpful to preview your distribution version in a browser. The full path is also needed to create navigations with ease.
```jade
//- CSS file to be included in distribution
- var css = root + 'css/main.css';

//- JS file to be included in distribution
- var js = root + 'js/main.js';
```
Sets the names of the compiled and concatenated css and javascript files in your distribution. Make sure that these paths are the same as your respective options in the `sassyjade.config.json` file.
```json
  "option": {
    "jsName": "main.js",
    "cssName": "main.css"
  }
```
### Layouts
The `templ/layout/` directory contains the layouts of the project. `html.jade` serves as the core structure and should be extended by all other layouts.
#### html.jade
Is something like the root layout of all other layouts. Since it defines the doctype and contains the root html tag it should be extended by all other layouts.

Sassyjade uses Jade's `block` option to construct layouts. This is convenient because blocks exposed by extended layouts can be overwritten by its child layouts. This leaves more flexibility as opposed to working with includes only.

`html.jade` exposes a number of blocks to all layouts that it is extended by.
```jade
doctype html
block html
  html
    block depends
      block vars              //- use to set variables on pages
      include ../incl/config.jade
    block head
      head
        block meta            //- use to define meta-tags
          include ../incl/aux/meta.jade
        block title           //- use to set the title-tag
          title= title
        block stylesheet      //- use to link to stylesheets
          include ../incl/aux/stylesheet.jade
    block body
      body
        block layout          //- use this block to create your layouts
        block script          //- use to include your scripts
          include ../incl/aux/script.jade
```
##### block depends
Exposes the block "vars" which can be used on every page to set variables available for the whole page. `config.jade` is also included here. Note that the variables need to be set before everything else.
##### block head
Defines the head of the html and by default exposes 3 blocks: "meta", "title" and "stylesheet". The 3 blocks do as they say. By default Sassyjade expects all pages and templates to use the same stylesheets and meta tags. Therefore, for meta-tags and stylesheets include files are used (located at `templ/incl/aux`). However, if on one or more sites different ones are needed you can use the respective block to overwrite the defaults.
##### block body
Represents the actual `<body>`-tag of the html. It exposes `block layout` and `block script`. The latter is similar to the blocks exposed in block "head". Sassyjade thinks you want to include your scripts at the end of the page and expects the same scripts on all pages and templates, hence the include methodology. You can overwrite the block "script" if you need different scripts on different sites.
##### block layout
This is the main block exposed by `html.jade` for you to build page layouts. Read in the next paragraph how you might want to do this.
#### Create a new layout
In order to create a new layout extend `html.jade` first. This will give you the "layout" block, amongst the other blocks exposed, where you will be able to the define your layout. For example:
```jade
extends html.jade

block layout
  block header
    include ../incl/part/header.jade
  block nav
    include ../incl/nav/nav.jade
  block main
  block footer
    include ../incl/part/footer.jade
```

Take note that for Sassyjade a template is a general structure of a page, without any specifics and without any content.

You can define any number of additional blocks in your layout and use includes to reuse components.
#### Create a new template
To create an actual template you should finally be able to just quickly extend a layout.
```jade
extends layout/layout.jade

block vars
  - var page= "Home"

block main
  //- put custom definitions and content here
```
### Includes
Sassyjade sees includes as components, which might be reused in a project in different contexts. Typical examples are navigations, forms or page partials such header/footer.

By default all partials are stored in the `templ/incl/par` directory and the navigations at `templ/incl/nav`. 

The `templ/incl/aux` directory contains all auxillary includes such stylesheet.jade or meta.jade (also see [here]()).
## License
MIT &copy; [philister16](mailto:phil@rinerock.com)

























