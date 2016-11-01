"use strict";

/* Dependencies  */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del');


/* Concat Js */
gulp.task("concatJs", function() {
    return gulp.src([
        'js/external/*.js',
        'js/script.js'
    ])
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

/* Js Minify */
/* Must concat before minify */
gulp.task("minifyJs", ["concatJs"], function() {
    return gulp.src("js/app.js")
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('js'));
});

/* Compile Sass */
gulp.task('compileSass', function() {
    return gulp.src("scss/app.scss")
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'));
});

/* gulp clean */
/* Delete dist */
gulp.task('clean', function () {
    del('dist');
});


/* Auto sass and Js compile */
gulp.task('openI', function() {
    gulp.watch('scss/**/*.scss', ['compileSass']);
    gulp.watch('js/main.js', ['concatJs']);
})

/* gulp prod */
/* Moves compiled files to production. */
gulp.task('prod', ['minifyJs', 'compileSass'], function () {
    return gulp.src([
        'css/*.css',        
        'js/app.min.js',
        'index.html',
        'img/**', 
        'fonts/**'
    ],                    
/* Retain file structure */
    { base: './' })
    .pipe(gulp.dest('dist'))
})

/* gulp build */
/* Backup if gulp cannot be used. */
gulp.task("build", ['minifyJs', 'compileSass']);

/* gulp serve */
gulp.task('serve', ['openI']);

/* gulp */
gulp.task("default", ["build"]);
