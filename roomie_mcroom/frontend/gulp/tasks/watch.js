var gulp = require('gulp');

module.exports = function() {
  gulp.watch('./**/*.jsx', ['browserify']);
  gulp.watch('./**/*.less', ['less']);
};
