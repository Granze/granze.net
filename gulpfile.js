'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    imagemin = require('gulp-imagemin'),
    nodemon = require('gulp-nodemon'),
    csso = require('gulp-csso'),
    paths = {
      css: ['public/components/Simple-Grid/simplegrid.css'],
      scss: ['public/sass/*.scss'],
      images: 'public/img/**/*'
    };

gulp.task('styles', function() {
  return gulp.src(paths.css.concat(paths.scss))
      .pipe(plumber())
      .pipe(sass())
      .pipe(concat('main.css'))
      .pipe(autoprefixer())
      .pipe(csso())
      .pipe(gulp.dest('public/css'));
});

gulp.task('images', function() {
  return gulp.src(paths.images)
      .pipe(plumber())
      .pipe(imagemin())
      .pipe(gulp.dest('public/img'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scss, ['styles']);
  gulp.watch(paths.images, ['images']);
});

gulp.task('node', ['styles', 'images'], function () {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  }).on('start', ['watch'])
      .on('change', ['watch'])
      .on('restart', function () {
        console.log('restarted!');
      });
});

gulp.task('default', ['node']);