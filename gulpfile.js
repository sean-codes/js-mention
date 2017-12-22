var gulp = require('gulp')
var sass = require('gulp-sass')

gulp.task('watch', function() {
   gulp.watch('./src/**/*', ['css', 'js'])
})

gulp.task('css', function() {
   return gulp.src('./src/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./bin'))
})

gulp.task('js', function() {
   return gulp.src('./src/**/*.js')
      .pipe(gulp.dest('./bin'))
})
