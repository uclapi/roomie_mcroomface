'use strict'
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');


module.exports = function() {
  browserify('./views/app.jsx')
    .bundle()
    .on('error', function(err){
      console.error(err.toString());
      this.emit('end');
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./statics/js/'));
};
