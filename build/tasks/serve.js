var gulp = require('gulp');
var browserSync = require('browser-sync');
var path = require('path');
var paths = require('../paths');

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {
  var bs = browserSync.create('Grid Server');

  bs.init({
    server: {
      baseDir: paths.sample,
      routes: {
        '/src/aurelia-grid': paths.output,
      },
    },
  }, done);
});
