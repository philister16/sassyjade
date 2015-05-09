# Sassyjade
Op'ed front-end dev with sass and jade on Gulp.
## Installation via command line
Use NPM to install Sassyjade globally. This will later on give you the capability to quickly start new projects via command line.
```bash
$ npm install sassyjade -g
```
## Download
Alternatively you can download the latest version as a ZIP file.

[Sassyjade-0.0.4.zip](sassyjade.rhinerock.com/files/sassyjade-0.0.4.zip)
## Getting started
If you have installed Sassyjade globally via command line you can use the simple command line interface that comes with it. To start a new project:
```
$ saja create <yourProject>
$ cd <yourProject>
$ gulp watch
```
This will create a new folder with the name of your project, install all dependencies via NPM and create the default folder and file structure.
If you don't want the file and folder structure you can set the blank flag:
```
$ saja create --blank <yourProject>
```
If you decide not to install Sassyjade globally simply unpack the zip file in the desired folder and install the dependencies manually.
```
$ cd <yourProject>
$ npm install
```
The install command has to be run from the root of your project. This is also where the `package.json` file should be located.
## Working with Sassyjade
Sassyjade is opinionated. This means it has a default folder and file structure which dictate the workflow in a broad way.
The folder and file structure can be changed via the `sassyjade.config.json` file.
### Default folders and files
    app-root
      |-sassyjade.config.json
      |-node_modules/
      |-src/
      |  |-assets/
      |  |  |-files/
      |  |  |-font/
      |  |  |-img/
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
#### node_modules/
Contains all dependencies and is managed by NPM.
#### src/
The "source" folder - this is where the development files live.
#### src/assets/
Contains all static assets split into 3 sub-folders: images, fonts and files for any other file type.
#### src/scripts/
Contains all javascripts which will be compiled to a single script.
#### src/styles/
Contains all CSS preprocessor files such as SASS and Stylus, which will be compiled to a single CSS stylesheet.
#### src/templ/
Contains Jade templates which will be compiled into html views.
#### dist/
The "production" folder - it is managed by Sassyjade and should not be manipulated manually.
### Configuration
The `sassyjade.config.json` lets you define the paths in the source folders which are observed by Gulp.
For example to change the path where to look for your Sass edit the `style.src` property.
```json
"styles": {
      "src": [
        "src/styles/**/*.{scss,styl}"
      ],
      "dest": "dist/css/"
  }
```
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
#### `$ gulp index`
Looks up the index file in the source, compiles and copies it to the distribution version.
#### `$ gulp jade`
Sees jade files and compiles them into html. This task also runs the index task automatically.
#### `$ gulp markdown`
Sees markdown (.md) files and compiles them into html.
#### `$ gulp style`
Identifies stylesheets of the preprocessor selected and compiles these into 1 css file.
#### `$ gulp script`
Sees javascript files, concatenates and compiles them into one script file.
#### `$ gulp font`
Copies fonts from the source to the destination specified.
#### `$ gulp img`
Copies images from the source to the destination specified.
#### `$ gulp files`
Copies changed files from the source into the destination selected.
#### `$ gulp static-assets`
Runs the 3 tasks `font`, `img` and `files` together.
### Gulp watchers
Every defined stand-alone Gulp task comes with a built-in watcher that runs the task everytime a relevant file changes. To run a task and keep watching the files simply prepend the task with `watch-`.
```
$ gulp watch-<task>
```
For example: to watch for changes of the jade templates run: `$ gulp watch-jade`
#### `$ gulp watch`
A special, global watch task that keeps track of all changes and updates the relevant files.
### Livereload
Sassyjade is livereload enabled by default. In order for the browser to refresh automatically you need the respective livereload plugin. Refer to the [livereload documentation](http://livereload.com).
## License
MIT &copy; [philister16](mailto:phil@rinerock.com)













