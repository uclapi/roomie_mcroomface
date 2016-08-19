var gulp = require('gulp');

module.exports = function() {
  gulp.watch('./**/**/*.jsx', ['browserify']);
  gulp.watch('./**/*.jsx', ['browserify']);
  gulp.watch('./**/**/*.less', ['less']);
  gulp.watch('./**/*.less', ['less']);
};
