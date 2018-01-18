var gulp = require('gulp')
var sass = require('gulp-sass')
var browserify = require('browserify');
var tapSpec = require('tap-spec');
var run = require('tape-run');
var babel = require("gulp-babel");
var concat = require('gulp-concat')
// Defauklt / Watch
gulp.task('default', ['css', 'js', 'test'])
gulp.task('watch', function() {
   gulp.watch(['./src/**/*', './test/test.js'], ['default'])
})

gulp.task('css', function() {
   return gulp.src('./src/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./bin'))
})

gulp.task('js', function() {
   return gulp.src(['./src/**/*.js', './node_modules/babel-polyfill/dist/polyfill.min.js'])
      .pipe(concat('mention.js'))
      .pipe(babel())
      .pipe(gulp.dest('./bin'))
})

gulp.task('test', function() {
   browserify(__dirname + '/test/test.js')
     .bundle() // Browserify
     .pipe(run()) // Run it
     .pipe(tapSpec()) // Render it
     .pipe(process.stdout) // Output it! :]
})
