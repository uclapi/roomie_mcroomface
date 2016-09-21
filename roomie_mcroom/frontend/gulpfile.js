var gulp = require('./gulp')([
  'browserify',
  'watch'
]);

gulp.task('build', ['browserify']);
gulp.task('default', ['build', 'watch']);
