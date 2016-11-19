// Gulp & plugins
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	fileinclude = require("gulp-file-include");

// Sources
var src = {
	bootstrap: 'src/sass/bootstrap/',
	scripts: ["src/js/jquery.js", "src/js/modernizr.js", "src/js/app.js"],
	modules: 'src/modules/**/*.html',
	images: 'src/images/*.{gif,jpg,png,svg,ico}',
	html: 'src/*.tpl.html',
	sass: 'src/sass/',
	scss: 'src/sass/**/*.scss',
	js: 'src/js/**/*.js',
	// Vendors
	bootstrapsassfolder: 'bower_components/bootstrap-sass/assets/stylesheets/bootstrap/**/*.*',
	bootstrapsass: 'bower_components/bootstrap-sass/assets/stylesheets/_bootstrap.scss',
	bootstrapjs: 'bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
	modernizr: 'bower_components/modernizr/modernizr.js',
	jquery: 'bower_components/jquery/dist/jquery.min.js'
}

// Builds
var build = {
	scripts: ["build/assets/js/**/*.js"],
	images: 'build/assets/images',
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



// --- [ INIT FRAMEWORKS & SCRIPTS ]
// Init main script and vendors
gulp.task('app-js', function() {
	// Init main app.js
	return gulp.src([src.js])
		.pipe(gulp.dest(build.js));
});
// Javascript vendors
gulp.task('js-vendors', function() {
	// Init vendors
	return gulp.src([
			src.bootstrapjs, 
			src.modernizr,
			src.jquery
		])
		.pipe(gulp.dest(build.vendors));
});
// Bootstrap sass and folder
gulp.task('bootstrap-sass', function() {
	// Init vendors
	return gulp.src([src.bootstrapsass])
		.pipe(gulp.dest(src.sass));
});
gulp.task('bootstrap-sass-folder', function() {
	// Init vendors
	return gulp.src([src.bootstrapsassfolder])
		.pipe(gulp.dest(src.bootstrap));
});



// --- [ INIT PROJECT ]
// gulp init
gulp.task('init', ['app-js', 'js-vendors', 'bootstrap-sass', 'bootstrap-sass-folder']);



// --- [ DEFAULT TASK ]
// gulp
gulp.task('default', ['sass', 'server', 'app-js']);


