var browserify = require('browserify');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');

module.exports = function(){
  var b = browserify({
    entries: './views/app.jsx',
    debug: true
  });
  b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      // Add transformation tasks to the pipeline here.
      .pipe(uglify())
      .on('error', gutil.log)
    .pipe(gulp.dest('./statics/js/'));
  gulp.src('./views/index.less')
    .pipe(less())
    .pipe(cleanCSS())
    .pipe(gulp.dest('./statics/css/'));
};
