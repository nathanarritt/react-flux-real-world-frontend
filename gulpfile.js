'use strict';

var gulp = require('gulp'); // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Bundler for JavaScript files
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool

var connect = require('gulp-connect'); // Local Node server for development
var jsonServer = require('gulp-json-srv');
var del = require('del'); // Clean build files
var eslint = require('gulp-eslint'); // Static code analysis
var stylus = require('gulp-stylus'); // Compiler for Stylus files

var paths = {
    BUILD_ROOT: './build',
    CSS_ALL: './src/stylus/**/*.styl',
    CSS_IN: './src/stylus/app.styl',
    CSS_OUT: './build/css',
    JS_ALL: './src/js/**/*.js',
    JS_BUNDLE: 'bundle.js',
    JS_IN: './src/js/main.js',
    JS_OUT: './build/js',
    MAPS: '../maps',
    MOCKS: './src/js/mocks/*.json',
    PUBLIC: ['./src/public/**/*', '!./src/public/css', '!./src/public/css/**/*', '!./src/public/js', '!./src/public/js/**/*']
};

gulp.task('clean', function () {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del([
        paths.BUILD_ROOT + '/**/*'
    ]);
});

gulp.task('lint', function () {
    return gulp.src(paths.JS_ALL)
        .pipe(eslint())
        .pipe(eslint.format());
});

var compileStylus = function () {
    return gulp.src(paths.CSS_IN)
        .pipe(sourcemaps.init())
        .pipe(stylus({compress: true}))
        .pipe(sourcemaps.write(paths.MAPS))
        .pipe(gulp.dest(paths.CSS_OUT))
        .pipe(connect.reload());
};
gulp.task('stylus', ['clean'], compileStylus);
gulp.task('stylus-watch', compileStylus);

var copyPublic = function () {
    return gulp.src(paths.PUBLIC, {base: './src/public'})
        .pipe(gulp.dest(paths.BUILD_ROOT))
        .pipe(connect.reload());
};
gulp.task('copy-public', ['clean'], copyPublic);
gulp.task('copy-public-watch', copyPublic);

gulp.task('copy-mocks', ['clean'], function () {
    return gulp.src(paths.MOCKS, {base: './src/js'})
        .pipe(gulp.dest(paths.BUILD_ROOT));
});

// Error reporting function
function mapError(err) {
    if (err.fileName) {
        // Regular error
        gutil.log(chalk.red(err.name)
        + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
        + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
        + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
        + ': ' + chalk.blue(err.description));
    } else {
        // Browserify error..
        gutil.log(chalk.red(err.name)
        + ': '
        + chalk.yellow(err.message));
    }
}

// Completes the final file outputs
function bundle(bundler, outputDirectory) {
    bundler
        .bundle()
        .on('error', mapError) // Map error reporting
        .pipe(source(paths.JS_BUNDLE)) // Set source name
        .pipe(buffer()) // Convert to gulp pipeline
        .pipe(rename(paths.JS_BUNDLE)) // Rename the output file
        .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
        .pipe(sourcemaps.write(paths.MAPS)) // Set directory for sourcemaps to output to
        .pipe(gulp.dest(outputDirectory)) // Set the output directory
        .pipe(notify({
            message: 'Generated file: <%= file.relative %>',
        })) // Output the file being created
        .pipe(connect.reload()); // Reload the view in the browser
}

// Gulp task for build
gulp.task('devBundle', ['clean'], function() {
    var args = merge(watchify.args, {
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }); // Merge in default watchify args with browserify arguments

    var bundler = browserify(paths.JS_IN, args) // Browserify
        .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/__tests__/**', '**/package.json']}) // Watchify to watch source file changes
        .transform(babelify, {presets: ['es2015', 'react', 'stage-0']}); // Babel tranforms

    bundle(bundler, paths.JS_OUT); // Run the bundle the first time (required for Watchify to kick in)

    bundler.on('update', function() {
        bundle(bundler, paths.JS_OUT); // Re-run bundle on source updates
    });
});

gulp.task('watch', function () {
    gulp.watch(paths.CSS_ALL, ['stylus-watch']);
    gulp.watch(paths.PUBLIC, ['copy-public-watch']);
    gulp.watch(paths.JS_ALL, ['lint']);
});

gulp.task('json-server', function () {
    jsonServer.start({
        data: 'db.json',
        port: 25000
    });
});

gulp.task('connect', ['copy-public'], function () {
    connect.server({
        //https: true,
        livereload: true,
        port: process.env.PORT || 3000,
        root: 'build',
        fallback: 'build/main.html',
        middleware: function (connect, opt) {

            // fix CERT_HAS_EXPIRED error for middleware proxy
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            return [ (function () {
                var url = require('url');
                // var proxy = require('proxy-middleware');
                var proxy = require('./proxy-middleware-custom');

                var options = url.parse('http://localhost:25000/'); // path to APIs
                options.route = '/api'; // route in local environment to intercept
                options.cookieRewrite = true;
                options.cookieRewritePath = '/';
                return proxy(options);
            })() ];
        }
    });
});

gulp.task('default', [
    'copy-mocks', 'copy-public', 'lint', 'stylus',
    'watch', 'devBundle', 'connect', 'json-server'
]);
