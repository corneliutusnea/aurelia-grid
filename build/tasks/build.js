var gulp = require('gulp');
var runSequence = require('run-sequence');
var typescript = require('gulp-typescript');
var changed = require('gulp-changed');
var less = require('gulp-less');
var tsc = require('typescript');
var paths = require('../paths');
var plumber = require('gulp-plumber');

var tsProject = typescript.createProject('./tsconfig.json', { typescript: tsc });

gulp.task('build-system', function () {
	return gulp.src(paths.dtsSrc.concat(paths.source))
		.pipe(plumber())
    //.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(changed(paths.output, { extension: '.js' }))
		.pipe(typescript(tsProject))
    //.pipe(sourcemaps.write({includeContent: true}))
		.pipe(gulp.dest(paths.output));
});

gulp.task('build-less', function () {
	return gulp.src(paths.less)
		.pipe(less({ paths: [paths.output] }))
		.pipe(gulp.dest(paths.output));
});


gulp.task('copy-html', function () {
	return gulp.src(paths.html)
		.pipe(gulp.dest(paths.output));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function (callback) {
	return runSequence(
		'clean',
		['build-system', 'build-less', 'copy-html'],
		callback
		);
});
