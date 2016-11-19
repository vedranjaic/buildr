# Buildr
Application builder template

## Installation
- cd into your working directory and `git clone http://github.com/vedranjaic/buildr`
- rename `buildr` folder name and remove its `.git` folder from inside
- cd into your new app directory
- `npm install` will install all gulp modules
- `bower install` will pull all vendor frameworks and scripts
- `gulp init` will copy main app.js, bower frameworks and vendors scripts into build/ and working directories

## Starting the app
- run `gulp` to start server and first build
- save any `*.html` file to build html and refresh browser page, and any `*.scss` file to compile css

## Production
- run `gulp production` to minify css, combine and minify js, optimize images

### ToDo:
- gulp-w3cjs [https://www.npmjs.com/package/gulp-w3cjs/](https://www.npmjs.com/package/gulp-w3cjs/)