'use strict';
var
    gulp = require('gulp'),
    angularTemplates = require('gulp-angular-templates'),
    browserify = require('gulp-browserify2'),
    concat = require('gulp-concat'),
    del = require('del'),
    insert = require('gulp-insert'),
    karma = require('gulp-karma'),
    less = require('gulp-less'),
    mocha = require('gulp-mocha'),
    minifyHtml = require('gulp-minify-html'),
    processHtml = require('gulp-processhtml'),
    server = require('gulp-express'),
    uglify = require('gulp-uglify'),
    backEndUnitTestsGlob = [
        './server/**/*.spec.js'
    ],
    frontEndUnitTestGlob = [
        './node_modules/angular/angular.js',
        './node_modules/angular-mocks/angular-mocks.js',
        './node_modules/angular-route/angular-route.js',
        './node_modules/angular-animate/angular-animate.js',
        './ui/*.js',
        './ui/**/*.js',
        './ui/directives/*.html'
    ],
    serverInitFile = 'server/app.js',
    errorHandler = function (err) {
        console.error(err);
        this.emit('end');
    };

//file processing
gulp.task('less', function(){
    return gulp.src(['./ui/app.less', './ui/**/*.less'])
        .pipe(concat('style.css'))
        .pipe(less())
        .on('error', errorHandler)
        .pipe(gulp.dest('./public/'));
});

gulp.task('buildHtml', function(){
    return gulp.src('ui/index.html')
        //.pipe(processHtml())
        .pipe(minifyHtml())
        .pipe(gulp.dest('./public/'));
});

gulp.task('buildAngularTemplates', function(){
    gulp.src('ui/directives/*.html')
        .pipe(angularTemplates({module: 'playMusicModes', basePath: '/directives/'}))
        .pipe(gulp.dest('.tmp/angular-js-templates'));
    gulp.src('ui/views/*.html')
        .pipe(angularTemplates({module: 'playMusicModes', basePath: '/views/'}))
        .pipe(gulp.dest('.tmp/angular-js-templates'));
});

gulp.task('browserifyJs', function(){
    return gulp.src('ui/main.js')
        .pipe(browserify({
            fileName: 'script.js',
            options: {
                debug: true
            }
        }))
        .on('error', errorHandler)
        .pipe(gulp.dest('.tmp/'));
});

gulp.task('buildJs', ['buildAngularTemplates', 'browserifyJs'], function(){
    return gulp.src(['./.tmp/script.js', './.tmp/angular-js-templates/*'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('./public/'))
        .on('end', function(){
            del(['.tmp'], null);
        });
});

//unit tests
gulp.task('runBackendTests', function(){
    return gulp.src(backEndUnitTestsGlob)
        .pipe(mocha());
});

gulp.task('runFrontendTests', function(){
    return gulp.src(frontEndUnitTestGlob).pipe(karma({
        configFile: './karma.conf.js'
    }));
});

gulp.task('runTests', ['runBackendTests', 'runFrontendTests']);

//server controll
gulp.task('serverStart', function(){
    return server.run([serverInitFile]);
});

gulp.task('serverRestart', function(){
    server.stop();
    return server.run([serverInitFile]);
});

gulp.task('watch', function(){
    //front end changes
    gulp.watch([
        './ui/*.js',
        './ui/**/*.js',
        './ui/*.html',
        './ui/**/*.html',
        './ui/*.less',
        './ui/**/*.less'
    ], ['buildJs', 'less', 'buildHtml']);

    gulp.watch(['./public/*'], function(event){
        server.notify(event);
    });

    //back end changes
    gulp.watch(['./server/**/*.js', './server/*.js' ], ['serverRestart', 'runBackendTests']);
});

gulp.task('default', [
    'buildJs',
    'less',
    'buildHtml',
    'serverStart',
    'watch'
]);
