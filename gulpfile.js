// Gulp & plugins
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	tinify = require('gulp-tinify'),
	svgmin = require('gulp-svgmin'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	fileinclude = require("gulp-file-include");

// Sources
var src = {
	bootstrap: 'src/sass/bootstrap/',
	modules: 'src/modules/**/*.html',
	images: 'src/images/**/*.{gif,jpg,png,ico}',
	html: 'src/*.tpl.html',
	sass: 'src/sass/',
	scss: 'src/sass/**/*.scss',
	svg: 'src/images/**/*.svg',
	js: 'src/js/**/*.js',
	// Bower
	bootstrapsassfolder: 'bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.*',
	bootstrapsass: 'bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',
	bootstrapjs: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
	modernizr: 'bower_components/modernizr/modernizr.js',
	jquery: 'bower_components/jquery/dist/jquery.min.js'
}

// Builds
var build = {
	scripts: ["build/assets/js/**/*.js"],
	images: 'build/assets/images/',
	dest: 'build/',
	html: 'build/**/*.html',
	css: 'build/',
	js: 'build/assets/js',
	// Vendors
	vendors: 'build/assets/js/vendors/'
}



// --- [ TASKS ]
// Static server & watcher
gulp.task('server', ['sass'], function() {

	browserSync.init({
		server: build.dest,
		open: false
	});

	// Watch for SCSS
	gulp.watch(src.scss, ['sass']);
	// Watch for HTML Template files
	gulp.watch(src.html, ['fileinclude']);
	// Watch for HTML modules
	gulp.watch(src.modules, ['fileinclude']);
	gulp.watch(build.html).on('change', browserSync.reload);
	// Watch for JS
	gulp.watch(src.js, ['app-js']);
	gulp.watch(build.scripts, browserSync.reload);

});



// --- [ SASS ]
// Sass, Error handling, Autoprefixer and sourcemaps
gulp.task('sass', function () {

	return sass(src.scss, {
			style: 'expanded',
			sourcemap: true
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('/', {
			includeContent: false,
			sourceRoot: '/'
		}))
		.pipe(gulp.dest(build.css))
		.pipe(browserSync.stream({match: '**/*.css'}));
});
// Sass min, Error handling, Autoprefixer
gulp.task('sass-min', function () {
	return sass(src.scss, {
			style: 'compressed'
		})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(autoprefixer({
			browsers: ['last 4 versions'],
			cascade: false
		}))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(build.css))
		.pipe(browserSync.stream({match: '**/*.css'}));
});



// --- [ FILEINCLUDE ]
// Fileinclude and rename files
gulp.task('fileinclude', function() {
	
	return gulp.src([src.html])
		.pipe(fileinclude({
			indent: true
		}))
		.pipe(rename({
			extname: ""
		}))
		.pipe(rename({
			extname: ".html"
		}))
		.pipe(gulp.dest(build.dest));

});



// --- [ IMAGES & SVG ]
// Copy images
gulp.task('images', function() {

	// Copy images and svgs
	return gulp.src([src.images, src.svg])
		.pipe(gulp.dest(build.images));

});
// Optimize images
gulp.task('image-min', function() {
	gulp.src(src.images)
		.pipe(tinify('hcYKDxhpqdqHfZKwnZ9lzM85RvyOzIee'))
		.pipe(gulp.dest(build.images));
});
// SVGO
gulp.task('svg-min', function () {
	return gulp.src(src.svg)
		.pipe(svgmin({plugins: [{
				removeViewBox: false,
				cleanupIDs: false,
				cleanupAttrs: false
			}]
		}))
		.pipe(gulp.dest(build.images));
});



// --- [ SCRIPTS FOR PRODUCTION ]
// Main app.js file
gulp.task('app-js', function() {

	// Copy main app.js
	return gulp.src([src.js])
		.pipe(gulp.dest(build.js));

});
// Concat all .js files into new _app.js
gulp.task('js-concat', function() {
  return gulp.src(build.scripts)
    .pipe(concat('_app.js'))
    .pipe(gulp.dest(build.js));
});
// Minify .js
gulp.task('js-min', function() {
	return gulp.src('build/assets/js/_app.js')
		.pipe(uglify())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(build.js))
});


// --- [ COPY FRAMEWORKS & SCRIPTS ]
// BOWER - Javascript vendors
gulp.task('js-vendors', function() {
	// Copy all vendors
	return gulp.src([
			src.bootstrapjs, 
			src.modernizr,
			src.jquery
		])
		.pipe(gulp.dest(build.vendors));
});
// BOWER - Bootstrap sass and folder
gulp.task('bootstrap-sass', function() {
	// Copy _bootstrap.scss
	return gulp.src([src.bootstrapsass])
		.pipe(gulp.dest(src.sass));
});
gulp.task('bootstrap-sass-folder', function() {
	// Copy /bootstrap/ folder
	return gulp.src([src.bootstrapsassfolder])
		.pipe(gulp.dest(src.bootstrap));
});



// --- [ INSTALL PROJECT ]
// gulp install - Copies main app.js file, Bootstrap scss and js, jQuery, Modernizr, images and SVGs
gulp.task('install', ['app-js', 'js-vendors', 'bootstrap-sass', 'bootstrap-sass-folder', 'images']);


// --- [ PRODUCTION DEPLOY ]
// gulp production - compresses .css, combines all .js into _app.js and minifies, optimizes all images and svgs
gulp.task('production', ['sass-min', 'js-concat', 'js-min', 'image-min', 'svg-min'])


// --- [ DEFAULT TASK ]
// gulp
gulp.task('default', ['sass', 'server', 'app-js']);


