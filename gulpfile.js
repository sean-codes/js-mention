var gulp = require('gulp')
var sass = require('gulp-sass')
var babel = require("gulp-babel")
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var browserify = require('browserify')
var tapSpec = require('tap-spec')
var run = require('tape-run')

// Defauklt / Watch
gulp.task('default', ['css', 'js', 'compress'])
gulp.task('watch', function() {
   gulp.watch(['./src/**/*', './test/test.js'], ['default'])
})

gulp.task('css', function() {
   return gulp.src('./src/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./bin'))
})

gulp.task('js', function() {
   return gulp.src('src/mention.js')
      .pipe(babel({ "presets": ["env"] })).on('error', console.log)
      .pipe(gulp.dest('bin'))
})

gulp.task('compress', function() {
   return gulp.src('bin/mention.js')
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('bin'))
})

gulp.task('test', function() {
   browserify(__dirname + '/test/test.js')
     .bundle() // Browserify
     .pipe(run()) // Run it
     .pipe(tapSpec()) // Render it
     .pipe(process.stdout) // Output it! :]
})
