var gulp = require('gulp');
var eslint = require('gulp-eslint');
var zip = require('gulp-zip');

var JS = [
  'content_scripts/main.js',
  'content_scripts/data-stack.js',
  'content_scripts/template-service.js',
  'content_scripts/url-parser.js',
  'content_scripts/form-parser.js',
  'templates/template-table.js',
  'popup/popup.js'
];
var BRUCE_FILES = [
  'content_scripts/comment-parser.js',
  'manifest.json',
  'popup/popup.js'
];

gulp.task('eslint', function () {
  return gulp.src(JS)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('zip', function () {
  return gulp.src(BRUCE_FILES, { base: '.' })
    .pipe(zip('files.zip'))
    .pipe(gulp.dest(''));
});
