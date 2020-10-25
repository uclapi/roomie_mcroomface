var gulp = require('gulp');

module.exports = function() {
  gulp.watch('./views/**/*.jsx', gulp.series('browserify'));
  gulp.watch('./views/**/**/*.jsx', gulp.series('browserify'));
  gulp.watch('./views/*.jsx', gulp.series('browserify'));
  gulp.watch('./utils/*.js', gulp.series('browserify'));
  gulp.watch('./views/**/*.less', gulp.series('less'));
  gulp.watch('./views/**/**/*.less', gulp.series('less'));
  gulp.watch('./views/*.less', gulp.series('less'));
};
