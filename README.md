# Buildr v0.63
Application builder template

## Installation
- cd into your working directory and `git clone git@github.com:vedranjaic/buildr newApp`
- cd into your newApp directory
- remove git folder with `rm -rf .git`
- `npm install` will install all gulp modules
- `bower install` will pull all vendor frameworks and scripts
- `gulp install` will copy main app.js, bower frameworks and vendors scripts into build/ and working directories

## Starting the app
- run `gulp` to start server and first build
- save any `*.html` file to build html and refresh browser page, and any `*.scss` file to compile css

## Production
- run `gulp production` to minify css, combine and minify js, optimize images

### ToDo:
- gulp-w3cjs [https://www.npmjs.com/package/gulp-w3cjs/](https://www.npmjs.com/package/gulp-w3cjs/)

### v0.63
- `transition` now accepts multiple properties
- `:focus` outline - option to change focus outlines for mouse/tab navigation
### v0.62
- `transition` now specifies which property to pass (past: all)
