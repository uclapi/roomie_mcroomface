var gulp = require('./gulp')([
  'browserify',
  'less',
  'watch',
  'productionBuild'
]);

gulp.task('build', ['browserify', 'less']);
gulp.task('default', ['build', 'watch']);
gulp.task('production', ['productionBuild']);
