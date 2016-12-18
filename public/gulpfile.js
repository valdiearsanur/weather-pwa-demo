var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var swPrecache = require('sw-precache');

gulp.task('sass', function() {
    return gulp
        .src('./assets/styles/*.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./assets/styles/'))
        .pipe(minifyCss({}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./assets/styles/'));
});

gulp.task('generate-sw', function() {
    var swOptions = {
        staticFileGlobs: [
            './index.html',
            //'./assets/*.{png,svg,gif,jpg,js,css,woff,eot,ttf,svg}',
            './assets/images/*.{png,svg,gif,jpg}',
            './assets/scripts/*.js',
            './assets/styles/*.css'
        ],
        stripPrefix: '.',
        runtimeCaching: [{
            urlPattern: /^https:\/\/query\.yahooapis\.com\/v1\/public\/yql\?q=select%20\*%20from%20weather\.forecast%20where%20woeid%20%3D%20[0-9]+%20and%20u%3D%27c%27&format=json/,
            //urlPattern: /^http:\/\/api.openweathermap.org\/data\/2.5\/forecast\/daily\?units=metric&cnt=7&APPID=94391138b18139a052b943e0b9d8f840/,
            //urlPattern: /^https:\/\/publicdata-weather\.firebaseio\.com/,
            handler: 'networkFirst',
            options: {
                cache: {
                    name: 'weatherData-v3'
                }
            }
        }]
    };
    return swPrecache.write('./service-worker.js', swOptions);
});

gulp.task('serve', ['generate-sw'], function() {
    gulp.watch('./assets/styles/*.scss', ['sass']);
    browserSync({
        notify: false,
        logPrefix: 'weatherPWA',
        server: ['.'],
        open: false
    });
    gulp.watch([
        './*.html',
        './assets/scripts/*.js',
        './assets/styles/*.css',
        '!./service-worker.js',
        '!./gulpfile.js'
    ], ['generate-sw'], browserSync.reload);
});

gulp.task('default', ['serve']);