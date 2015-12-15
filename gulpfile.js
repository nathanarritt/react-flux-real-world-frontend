'use strict';

var babelify = require('babelify');
var browserify = require('browserify');
var connect = require('gulp-connect');
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var jsonServer = require('gulp-json-srv');
var stylus = require('gulp-stylus');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');

/* nicer browserify errors */
var gutil = require('gulp-util');
var chalk = require('chalk');

function map_error(err) {
    if (err.fileName) {
        // regular error
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
            + ': '
            + 'Line '
            + chalk.magenta(err.lineNumber)
            + ' & '
            + 'Column '
            + chalk.magenta(err.columnNumber || err.column)
            + ': '
            + chalk.blue(err.description));
    } else {
        // browserify error..
        gutil.log(chalk.red(err.name)
            + ': '
            + chalk.yellow(err.message));
    }

    this.end();
}
/* */

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

gulp.task('clean', function (callback) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del([paths.BUILD_ROOT + '/**/*'], callback);
});

gulp.task('lint', function () {
    gulp.src(paths.JS_ALL)
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

gulp.task('watch', ['clean'], function () {
    gulp.watch(paths.CSS_ALL, ['stylus-watch']);
    gulp.watch(paths.PUBLIC, ['copy-public-watch']);
    gulp.watch(paths.JS_ALL, ['lint']);

    var watcher  = watchify(browserify({
        entries: paths.JS_IN,
        transform: [babelify],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    return watcher.on('update', function () {
        watcher.bundle()
            .on('error', map_error)
            .pipe(source(paths.JS_BUNDLE))
            .pipe(gulp.dest(paths.JS_OUT))
            .pipe(connect.reload());
            console.log('Updated');
    })
    .bundle()
    .on('error', map_error)
    .pipe(source(paths.JS_BUNDLE))
    .pipe(gulp.dest(paths.JS_OUT))
    .pipe(connect.reload());
});

gulp.task('json-server', function () {
    jsonServer.start({
        data: 'db.json',
        port: 25000
    });
});

gulp.task('connect', ['copy-public'], function () {
    connect.server({
        // https: true,
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

// Below is the source of the proxy-middleware plugin. It doesn't support our use
// case out of the box so I had to modify it a little to work. This should probably
// be moved to our own version of the plugin or submitted to the original author
// as a pull request to see if he will include the changes.
var os = require('os');
var http = require('http');
var https = require('https');
var owns = {}.hasOwnProperty;

var proxy = function proxyMiddleware(options) {
  //enable ability to quickly pass a url for shorthand setup
  if(typeof options === 'string'){
      options = require('url').parse(options);
  }

  var httpLib = options.protocol === 'https:' ? https : http;
  var request = httpLib.request;

  options = options || {};
  options.hostname = options.hostname;
  options.port = options.port;
  options.pathname = options.pathname || '/';

  return function (req, resp, next) {
    var url = req.url;
    // You can pass the route within the options, as well
    if (typeof options.route === 'string') {
      if (url === options.route) {
        url = '';
      } else if (url.slice(0, options.route.length) === options.route) {
        url = options.preserveRoute ? url : url.slice(options.route.length);
      } else {
        return next();
      }
    }

    //options for this request
    var opts = extend({}, options);
    if (url && url.charAt(0) === '?') { // prevent /api/resource/?offset=0
      if (options.pathname.length > 1 && options.pathname.charAt(options.pathname.length - 1) === '/') {
        opts.path = options.pathname.substring(0, options.pathname.length - 1) + url;
      } else {
        opts.path = options.pathname + url;
      }
    } else if (url) {
      opts.path = slashJoin(options.pathname, url);
    } else {
      opts.path = options.pathname;
    }
    opts.method = req.method;
    opts.headers = options.headers ? merge(req.headers, options.headers) : req.headers;

    applyViaHeader(req.headers, opts, opts.headers);

    if (!options.preserveHost) {
      // Forwarding the host breaks dotcloud
      delete opts.headers.host;
    }

    var myReq = request(opts, function (myRes) {
      var statusCode = myRes.statusCode
        , headers = myRes.headers
        , location = headers.location;
      // Fix the location
      if (((statusCode > 300 && statusCode < 304) || statusCode === 201) && location && location.indexOf(options.href) > -1) {
        // absoulte path
        headers.location = location.replace(options.href, slashJoin('', slashJoin((options.route || ''), '')));
      }
      applyViaHeader(myRes.headers, opts, myRes.headers);
      rewriteCookieHosts(myRes.headers, opts, myRes.headers, req);
      resp.writeHead(myRes.statusCode, myRes.headers);
      myRes.on('error', function (err) {
        next(err);
      });
      myRes.pipe(resp);
    });
    myReq.on('error', function (err) {
      next(err);
    });
    if (!req.readable) {
      myReq.end();
    } else {
      req.pipe(myReq);
    }
  };
};

function applyViaHeader(existingHeaders, opts, applyTo) {
  if (!opts.via) return;

  var viaName = (true === opts.via) ?  os.hostname() : opts.via;
  var viaHeader = '1.1 ' + viaName;
  if(existingHeaders.via) {
    viaHeader = existingHeaders.via + ', ' + viaHeader;
  }

  applyTo.via = viaHeader;
}

function rewriteCookieHosts(existingHeaders, opts, applyTo, req) {
  if (!opts.cookieRewrite || !owns.call(existingHeaders, 'set-cookie')) {
    return;
  }

  var existingCookies = existingHeaders['set-cookie'],
      rewrittenCookies = [],
      rewriteHostname = (true === opts.cookieRewrite) ? os.hostname() : opts.cookieRewrite;

  if (!Array.isArray(existingCookies)) {
    existingCookies = [ existingCookies ];
  }

  for (var i = 0; i < existingCookies.length; i++) {
    var rewrittenCookie = existingCookies[i].replace(/(Domain)=[a-z\.-_]*?(;|$)/gi, '$1=' + rewriteHostname + '$2');

    if (opts.cookieRewritePath) {
      rewrittenCookie = rewrittenCookie.replace(/(Path)=\/?[a-z\.-_]*\/?(;)/gi, '$1=' + opts.cookieRewritePath + '$2');
    }

    if (!req.connection.encrypted) {
      rewrittenCookie = rewrittenCookie.replace(/;\s*?(Secure)/i, '');
    }
    rewrittenCookies.push(rewrittenCookie);
  }

  applyTo['set-cookie'] = rewrittenCookies;
}

function slashJoin(p1, p2) {
  if (p1.length && p1[p1.length - 1] === '/') {p1 = p1.substring(0, p1.length - 1); }
  if (p2.length && p2[0] === '/') {p2 = p2.substring(1); }
  return p1 + '/' + p2;
}

function extend(obj, src) {
  for (var key in src) if (owns.call(src, key)) obj[key] = src[key];
  return obj;
}

//merges data without changing state in either argument
function merge(src1, src2) {
    var merged = {};
    extend(merged, src1);
    extend(merged, src2);
    return merged;
}



                var options = url.parse('http://localhost:25000/'); // path to APIs
                options.route = '/api'; // route in local environment to intercept
                // options.preserveRoute = true;
                options.cookieRewrite = true;
                options.cookieRewritePath = '/';
                return proxy(options);
            })() ];
        }
    });
});

gulp.task('default', [
    'copy-mocks', 'copy-public', 'lint', 'stylus', 'watch', 'connect',
    'json-server'
]);
