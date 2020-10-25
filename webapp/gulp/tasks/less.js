var gulp = require('gulp'); 
var less = require('gulp-less');

module.exports =  function() {
  return gulp.src('./views/index.less')
    .pipe(less())
    .pipe(gulp.dest('./statics/css/'));
};
