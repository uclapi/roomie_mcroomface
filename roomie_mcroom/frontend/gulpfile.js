var gulp = require('./gulp')([
  'browserify',
  'less',
  'watch'
]);

gulp.task('build', ['browserify', 'less']);
gulp.task('default', ['build', 'watch']);
