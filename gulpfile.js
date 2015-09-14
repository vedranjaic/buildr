// Gulp & plugins
var gulp = require('gulp'),
	rename = require('gulp-rename'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require("gulp-file-include");

// Sources
var src = {
	scripts: ["src/js/jquery.js", "src/js/modernizr.js", "src/js/app.js"],
	images: 'src/images/*.{gif,jpg,png,svg,ico}',
	html: 'src/*.tpl.html',
	sass: 'src/sass/',
	scss: 'src/sass/**/*.scss',
	js: 'src/js/**/*.js'
}

// Builds
var build = {
	images: 'build/assets/images',
	dest: 'build/',
	html: 'build/**/*.html',
	css: 'build/',
	js: 'build/assets/js'
}



// TASKS
// Static server
gulp.task('server', ['sass'], function() {

	browserSync.init({
        server: build.dest,
        open: false
    });

	gulp.watch(src.scss, ['sass']);
	gulp.watch(src.html, ['fileinclude']);
	gulp.watch(build.html).on('change', browserSync.reload);

});

// SASS
gulp.task('sass', function () {

	return sass(src.scss, {sourcemap: true})
		.on('error', function (err) {
			console.error('Error!', err.message);
		})
		.pipe(sourcemaps.write('/', {
			includeContent: false,
			sourceRoot: '/'
		}))
		.pipe(gulp.dest(build.css))
		.pipe(browserSync.stream({match: '**/*.css'}));
});

// Fileinclude
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

// Default
gulp.task('default', ['sass', 'server']);
