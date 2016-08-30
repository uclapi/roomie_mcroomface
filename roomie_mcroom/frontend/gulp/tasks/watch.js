var gulp = require('gulp');

module.exports = function() {
  gulp.watch('./views/**/*.jsx', ['browserify']);
  gulp.watch('./views/*.jsx', ['browserify']);
  gulp.watch('./utils/*.js', ['browserify']);
  gulp.watch('./views/**/*.less', ['less']);
  gulp.watch('./views/*.less', ['less']);
};
