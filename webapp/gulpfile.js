var gulp = require('./gulp')([
  'browserify',
  'less',
  'watch',
  'productionBuild'
]);

gulp.task('build', gulp.series('browserify', 'less'));
gulp.task('default', gulp.series('build', 'watch'));
gulp.task('production', gulp.series('productionBuild'));
