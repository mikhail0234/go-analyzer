const gulp = require("gulp");
const webpack = require("webpack");
const gwebpack = require("webpack-stream");

const stylus = require('gulp-stylus');
const concat_css = require('gulp-concat-css');
const del = require('del');

var argv = require('yargs').argv;
var gutil = require('gulp-util');
var wb_config = require('./webpack.config');

var APP_SOURCE = 'src/';
var BUILD_DEST = '_build/';


/**
 *  Build options
 *
 */
var production = argv.production ? argv.production : null;


gulp.task('go:clean', function () {
    return del.sync([BUILD_DEST], {force: true});
});

gulp.task('go:styles', function () {
    return gulp.src(APP_SOURCE + '**/*.styl')
        .pipe(stylus({
            compress: true
        }))
        .pipe(concat_css('bundle.css'))
        .pipe(gulp.dest(BUILD_DEST));
});

gulp.task('go:bundle', function () {
    if (production) {
        wb_config.mode = 'production';
        wb_config.devtool = false;
    }
    return gwebpack(wb_config, webpack)
        .pipe(gulp.dest(BUILD_DEST));
});

gulp.task('go:assemble', ['go:clean', 'go:bundle', 'go:styles'], function () {
    gutil.log(gutil.colors.green('[INFO]'), 'Production: ' + (production ? "true" : "false"));
});