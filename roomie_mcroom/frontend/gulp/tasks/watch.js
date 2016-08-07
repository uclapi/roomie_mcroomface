var gulp = require('gulp');

module.exports = function() {
  gulp.watch('./views/app.jsx', ['browserify']);
  gulp.watch('./views/index.less', ['less']);
};
