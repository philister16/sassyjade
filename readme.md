# Sassyjade
Op'ed front-end dev boilerplate with Sass and Jade on Gulp.
## Installation via command line
You can a use Saja - Sassyjade's small and simple command line interface to start a new project. The CLI is installed via npm.
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

[Sassyjade-0.0.4.zip](http://rhinerock.com/sassyjade/files/sassyjade-0.0.4.zip)

To get started unzip the file into your project folder. Then check that in the root of your project folder the file `package.json` exists. If it does go ahead and install Sassyjade's dependencies via npm and then start the gulp process.
```
$ sudo npm install
$ gulp watch
```
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
Contains all dependencies and is managed by npm.
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
For example: to watch for changes on the jade templates run: `$ gulp watch-jade`
#### `$ gulp watch`
A special, global watch task that keeps track of all changes and updates the relevant files.
### Livereload
Sassyjade is livereload enabled by default. In order for the browser to refresh automatically you need the respective livereload plugin. Refer to the [livereload documentation](http://livereload.com).
## License
MIT &copy; [philister16](mailto:phil@rinerock.com)













