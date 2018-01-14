var gulp = require('gulp')
var sass = require('gulp-sass')
var run = require('tape-run');
var browserify = require('browserify');
var tapSpec = require('tap-spec');

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

gulp.task('test', function() {
   browserify(__dirname + '/test/test.js')
     .bundle() // Browserify
     .pipe(run()) // Run it
     .pipe(tapSpec()) // Render it
     .pipe(process.stdout) // Output it! :]
})
