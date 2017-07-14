'use strict';

var validate = require('gulp-w3c-css');

var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var htmlhint = require("gulp-htmlhint");
var beautify = require('gulp-beautify');
var babel = require('gulp-babel');
var stripDebug = require('gulp-config-strip-debug');
var csso = require('gulp-csso');
var rename = require("gulp-rename");

var srcPath = './assets/css/*.css';
var dstPath = './build';

gulp.task('sass', function() {
  return gulp.src('./assets/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css/'));
});

//we created this task called validate based on the variable validate we brought
//in above for the gulp-w3c-css
gulp.task('validate', function(){
    gulp.src(srcPath)
      .pipe(validate())
      .pipe(gulp.dest(dstPath));
});
//html in console
gulp.task('htmlhint', function(){
    gulp.src("./src/*.html")
    .pipe(htmlhint());
});


 //create dist folder, create a es6 file and run
gulp.task('babel', () => {
    return gulp.src('../assets/js/es6.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('beautify', function() {
  return gulp.src('./assets/js/*.js')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./public/'))
});


gulp.task('stripDebug', function () {
    return gulp.src('./assets/js/*.js')
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist'));
});
//csso
gulp.task('csso', function () {
    return gulp.src(srcPath)
        .pipe(csso())
        .pipe(gulp.dest('./out'));
});
 
gulp.task('development', function () {
    return gulp.src(srcPath)
        .pipe(csso({
            restructure: false,
            sourceMap: true,
            debug: true
        }))
        .pipe(gulp.dest('./out'));
});

// rename via string 
gulp.task('rename', function () {
gulp.src("./assets/**/hello.txt")
  .pipe(rename(function (path) {
    path.dirname += "/ciao";
    path.basename += "-goodbye";
    path.extname = ".md"
  }))
  .pipe(gulp.dest("./dist")); // ./dist/main/text/ciao/hello-goodbye.md 
});

gulp.task('default', ['sass', 'validate', 'csso', 'development', 'htmlhint', 'beautify', 'babel', 'stripDebug', 'rename'  ]);
gulp.task('css', ['sass', 'validate', 'csso']);
gulp.task('html', ['htmlhint' ]);
gulp.task('javascript', ['beautify', 'babel', 'stripDebug' ]);
