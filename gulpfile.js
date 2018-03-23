var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stripComments = require('gulp-strip-comments');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var bytediff = require('gulp-bytediff');
var order = require('gulp-order');


var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', ['sass'], function () {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('js', [], function () {
  var source = './src';

  return gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.min.js', { newLine: ';' }))
    // Annotate before uglify so the code get's min'd properly.
    .pipe(ngAnnotate({
      // true helps add where @ngInject is not used. It infers.
      // Doesn't work with resolve, so we must be explicit there
      add: true
    }))
    .pipe(bytediff.start())
    .pipe(uglify({ mangle: true }))
    .pipe(bytediff.stop())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/dist/'));
});

gulp.task('jshint', function () {
  gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('script', function () {
  return gulp.src('./src/**/*.js')
    .pipe(order([
      "app.js",
      "**/*.module.js",
      "**/*.route.js",
      "**/*.controller.js",
      "**/*.*.service.js"
    ]))
    .pipe(sourcemaps.init())
    .pipe(ngAnnotate())
    .pipe(concat('practera.js'))
    .pipe(stripComments())
    //.pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gutil.env.env === 'dev' ? gutil.noop() : sourcemaps.write('maps'))
    .pipe(gulp.dest('./www/dist/'))
});

