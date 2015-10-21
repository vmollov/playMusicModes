'use strict';

var
    gulp = require('gulp'),
    angularTemplates = require('gulp-angular-templates'),
    browserify = require('gulp-browserify2'),
    concat = require('gulp-concat'),
    //del = require('del'),
    eventStream = require('event-stream'),
    //insert = require('gulp-insert'),
    karma = require('gulp-karma'),
    less = require('gulp-less'),
    mocha = require('gulp-mocha'),
    minifyHtml = require('gulp-minify-html'),
    order = require('gulp-order'),
    //processHtml = require('gulp-processhtml'),
    server = require('gulp-express'),
    //uglify = require('gulp-uglify'),
    serverInitFile = 'server/app.js',
    errorHandler = function (err) {
        console.error(err);
        this.emit('end');
    };

//file processing
gulp.task('compileLess', function(){
    return gulp.src(['ui/app.less', 'ui/**/*.less'])
        .pipe(concat('style.css'))
        .pipe(less())
        .on('error', errorHandler)
        .pipe(gulp.dest('public/'));
});

gulp.task('compileHtml', function(){
    return gulp.src('ui/index.html')
        //.pipe(processHtml())
        .pipe(minifyHtml())
        .on('error', errorHandler)
        .pipe(gulp.dest('public/'));
});

gulp.task('compileJs', function(){
    var
        directiveTemplates =  gulp.src('ui/directives/*.html')
            .pipe(angularTemplates({module: 'playMusicModes', basePath: '/directives/'})),

        viewTemplates = gulp.src('ui/views/*.html')
            .pipe(angularTemplates({module: 'playMusicModes', basePath: '/views/'})),

        script = gulp.src('ui/main.js')
            .pipe(browserify({
                fileName: 'script.js',
                options: {
                    debug: true
                }
            }))
            .on('error', errorHandler);

    eventStream.merge(script, directiveTemplates, viewTemplates)
        .pipe(order([
            'script.js',
            'ui/**/*'
        ]))
        .pipe(concat('script.js'))
        .pipe(gulp.dest('public/'));
});

//tests
gulp.task('testModel', function(){
    return gulp.src('ui/model/**/*.mspec.js')
        .pipe(mocha())
        .on('error', errorHandler);
});

gulp.task('runTests', [
    'testModel'
]);

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
        'ui/**/*.js',
        'ui/**/*.html'
    ], ['compileJs'/*, 'testModel'*/]);

    gulp.watch(['ui/**/*.less'], ['compileLess']);
    gulp.watch(['ui/index.html'], ['compileHtml']);

    gulp.watch(['public/*'], function(event){
        server.notify(event);
    });

    //back end changes
    gulp.watch(['server/**/*.js'], ['serverRestart']);
});

gulp.task('default', [
    'compileJs',
    'compileLess',
    'compileHtml',
    'serverStart',
    'watch'
]);
