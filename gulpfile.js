var gulp = require('gulp');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var changed = require('gulp-changed');
var filter = require('gulp-filter');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var historyApiFallback = require('connect-history-api-fallback');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var stylish = require('jshint-stylish');
var assign = Object.assign || require('object.assign');
var sourcemaps = require('gulp-sourcemaps');
var ngHtml2Js = require('gulp-ng-html2js');
var htmlMin = require('gulp-minify-html');
var builder = require('systemjs-builder');
var RSVP = require('rsvp');
var less = require('gulp-less');
var svgSprite = require('gulp-svg-sprite');
var autoprefixer = require('gulp-autoprefixer');
var karma = require('karma').server;
var insert = require('gulp-insert');
var ngAnnotate = require('gulp-ng-annotate');
var fs = require('fs-extra');
var replace = require('gulp-replace-task');
var yaml = require('gulp-yaml');
var replace = require('gulp-replace');
var lessPluginCleanCSS = require('less-plugin-clean-css');
var cleancss = new lessPluginCleanCSS({advanced: true});
var cache = require('gulp-cached');
var uglify = require('gulp-uglify');
var adjustUrls = require('gulp-css-url-adjuster');
var routeBundler = require('systemjs-route-bundler');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var _ = require('lodash');
var gulpUtil = require('gulp-util');
var pandoc = require('gulp-pandoc');

var compilerOptions = {
  // filename: '',
  filenameRelative: '',
  blacklist: [],
  whitelist: [],
  modules: 'system',
  //sourceMap: true,
  //sourceMapName: '',
  //sourceFileName: '',
  sourceRoot: '',
  moduleRoot: '',
  moduleIds: false,
  experimental: false,
  format: {
    comments: false,
    compact: false,
    indent: {
      parentheses: true,
      adjustMultilineComment: true,
      style: '  ',
      base: 0
    }
  }
};

var path = {
  srcDir:'client/src/',
  jsSrc: [
    'client/src/**/*.js',
    '!client/src/system.config.js'
  ],
  svgSrc:'client/src/assets/svg',
  html:'client/src/**/*.html',
  indexHtml:'client/src/index.html',
  templates:[
    'client/src/{app,common}/**/**.tpl.html',
    '!client/src/index.html',
  ],
  less: 'client/src/**/*.less',
  ymlSrc: 'core-rules/**/*.yml',
  output:'client/dist/',
  distBase: 'dist/',
  distClient: 'dist/client/',
  outputCss: 'dist/client/**/*.css',
  systemJsConfig: 'client/src/system.config.js'
};

var apiPath = {
  source:'server/**/*.js'
};

browserSyncConfig = {
  open: false,
  port: 8000,
  server: {
    baseDir: ['dist'],
    ui: false,
    notify: false,
    ghostMode: false,
    routes: {
      '/jspm_packages': './client/jspm_packages'
    },
    middleware: [
      historyApiFallback,
      function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    ]
  }
};

// prevent code syncing and live reload in production
if (argv.production) {
  browserSyncConfig = _.merge(browserSyncConfig, {
    codeSync: false,
    reloadOnRestart: false,
    server: {
      snippetOptions: {
        rule: {
          match: /qqqqqqqqqqq/
        }
      }
    }
  });
};

var spriteConfig = {
  shape: {
    id: {                 // SVG shape ID related options
      separator: '-',     // Separator for directory name traversal
      generator: function(name) {
        return name.replace('.svg','');
      }
    }
  },
  svg: {
    namespaceIDs: true
  },
  mode: {
    stack: {     // Activate the «css» mode
      example: {
        // for some reason the gulp wrapper for this doesn't pick up pathing
        // relative to the parent, so we use a Node constant
        // 'client/src/assets/svg/active/**/*.svg'
        template: __dirname+'/'+path.svgSrc+'/sprite-template.html',
        // dest: '../../',
      },
      dest: '',
      bust: false,
      render: {
        css: false  // Activate CSS output (with default options)
      }
    }
  }
};

// pandoc -s -S --toc --template=template.html 00-introduction/01-introduction.md -o 00-introduction.tpl.html &&


// gulp.task('odt-to-md', function() {
//   gulp.src('openlegend-corerules.odt')
//     .pipe(pandoc({
//       from: 'opendocument',
//       to: 'markdown',
//       ext: '.md',
//       args: ['-s', '-S']
//     }))
//     .pipe(gulp.dest(path.distClient+'/app'));
// });

gulp.task('rules-docs', function() {
  gulp.src('core-rules/core/src/**/**.md')
    .pipe(pandoc({
      from: 'markdown',
      to: 'html5',
      ext: '.tpl.html',
      args: ['-s', '-S', '--toc', '--template=core-rules/core/src/template.html']
    }))
    .pipe(gulp.dest(path.srcDir+'/app/core'));
});

gulp.task('test', ['compile-all'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(err){
    // `err` is (0 || 1), but we can't pass `err` to done() so we
    // kill the process and return `1` so bash get's an echo-able exit code
    if ( err === 1 ) process.exit(1);
    done();
  });
});

gulp.task('clean', function() {
  return gulp.src([path.distBase+'/*'])
    .pipe(vinylPaths(del));
});

gulp.task('html', function () {
  return gulp.src(path.templates)
    .pipe(cache('html'))
    .pipe(plumber())
    .pipe(changed(path.distClient, { extension: '.html' }))
    .pipe(htmlMin({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(ngHtml2Js())

    // not entirely sure this is needed....
    .pipe(insert.prepend("import angular from 'angular';\n"))
    .pipe(babel(compilerOptions))
    .pipe(gulp.dest(path.distClient))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('less', function () {
  return gulp.src(path.less)
    .pipe(cache('less'))
    .pipe(plumber())
    .pipe(changed(path.distClient, {extension: '.less'}))
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: [ cleancss ]
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.distClient))
    .pipe(filter('**/*.css')) // prevents reloading due to .map files
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('rebase-css-paths', function(callback) {
  return gulp.src(path.distClientCss)
    .pipe(adjustUrls({
      replace:  [/(\.\.\/)+/,'dist/']
    }))
    .pipe(gulp.dest(path.distClient));
});

gulp.task('compile-sprites', function () {
  // don't output docs file in production mode
  if ( argv.production ) {
    spriteConfig = _.merge(spriteConfig, {
      mode: {
        stack: {
          example: false
        }
      }
    });
  }

  return gulp.src(path.svgSrc+'/active/**/*.svg', {cwd:''})
    .pipe(svgSprite( spriteConfig ))
    .pipe(gulpif(argv.production, rev())) // revision the assets
    .pipe(gulp.dest(path.distClient+'/assets')) // output the assets
    .pipe(gulpif(argv.production, rev.manifest( // generate the rev manifest
      path.distClient+'/rev-manifest.json',
      { base: path.distClient, merge: true}
    ))) // only run in production build
    .pipe(gulpif(argv.production, gulp.dest(path.distClient))) // save the rev manifest
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('json', function () {
  return gulp.src('./client/src/**/*.json')
    .pipe(changed(path.distClient, { extension: '.json' }))
    .pipe(gulp.dest(path.distClient))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('index-html', function () {
  return gulp.src(path.indexHtml)
    .pipe(gulp.dest(path.distClient))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('move', ['index-html','json','compile-sprites'], function () {
  return gulp.src([
      'client/src/system.config.js',
      'client/src/**/*.{svg,woff,ttf,png,gif,ico,jpg,eot,pdf}',
      '!'+path.svgSrc+'/**/*'
    ])
    .pipe(cache('move'))
    .pipe(gulpif(argv.production, rev())) // revision the assets
    .pipe(gulp.dest(path.distClient)) // output the assets
    .pipe(gulpif(argv.production, rev.manifest( // generate the rev manifest
      path.distClient+'/rev-manifest.json',
      { base: path.distClient, merge: true}
    ))) // only run in production build
    .pipe(gulpif(argv.production, gulp.dest(path.distClient))) // save the rev manifest
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('copy-client', function () {
  return gulp.src([
      './client/jspm_packages/**/*',
    ], { base: './' })
    .pipe(cache('copy-client'))
    .pipe(gulp.dest(path.distClient)) // output the assets
    .pipe(browserSync.reload({ stream: true }))
    .on('end', function () {
      fs.removeSync('dist/client/jspm_packages');
      fs.rename('dist/client/client/jspm_packages', 'dist/client/jspm_packages', function (err) {
        if (err) return console.error(err);
        console.log('moved jspm_packages dir to dist/client')
      });
    });
});

gulp.task('copy-server', function () {
    return gulp.src([
      '.openshift',
      './package.json',
      './app.yaml',
      './server/**/*',
    ], { base: './' })
    .pipe(cache('copy-server'))
    .pipe(gulp.dest(path.distBase)) // output the assets
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('cache-bust', function(){
  return gulp.src( path.distClient + 'index.html')
    .pipe(replace({
      usePrefix: false,
      patterns: [
        {
          match: '<!--PROD',
          replacement: ''
        },
        {
          match: 'END-->',
          replacement: ''
        },
        {
          match: '{{hash}}',
          replacement: Math.round(new Date() / 1000)
        }
      ]
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('rev', function () {
  return gulp.src([
      path.distClient+'**/*.{css,map,js,html}**',
    ])
    .pipe( revCollector({
      replaceReved: true,
      dirReplacements: {
        // 'css': '/dist/css',
        // '/js/': '/dist/js/',
      }
    }) )
    .pipe( gulp.dest(path.distClient) );
});

gulp.task('es6', function () {
  return gulp.src(path.jsSrc)
    .pipe(cache('es6'))
    .pipe(plumber())
    .pipe(changed(path.distClient, { extension: '.js' }))
    .pipe(sourcemaps.init())
    .pipe(babel(compilerOptions))
    .pipe(ngAnnotate({
      sourceMap: true,
      gulpWarnings: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.distClient))
    .pipe(browserSync.reload({ stream: true }));
});

// compile rules from yaml to json and output to
gulp.task('yaml', function(){
  gulp.src(path.ymlSrc)
    .pipe(yaml({
        space: 2
    }))
    // replaces newlines from YAML "foo : |" linebreaks
    .pipe(replace('\\n', '<br />'))
    .pipe(gulp.dest(path.distClient+'/app'))
});

gulp.task('timestamp', function(){
  gulp.src(path.srcDir+'config/config.js')
    .pipe(babel(compilerOptions))
    .pipe(replace('DATE_TO_REPLACE', Date.now()))
    .pipe(gulp.dest(path.distClient+'config'))
});

gulp.task('compile-all', function (callback) {
  return runSequence(
    ['less', 'html', 'es6', 'yaml', 'move', 'copy-client', 'copy-server'],
    'timestamp',
    callback
  );
});

gulp.task('compile-other', function (callback) {
  return runSequence(
    ['html', 'es6', 'move'],
    'timestamp',
    callback
  );
});

gulp.task('compile-less', function (callback) {
  return runSequence(
    ['less','timestamp'],
    callback
  );
});

gulp.task('recompile', function (callback) {
  return runSequence(
    'clean',
    ['compile-all'],
    callback
  );
});

gulp.task('compile-production', function (callback) {
  return runSequence(
    'recompile',
    'minify',
    'cache-bust',
    // 'rev',
    // ['rebase-css-paths'],
    callback
  )
});

gulp.task('minify', function(){
  var condition = '**/routing.js';
  return gulp.src([
      'dist/client/**/*.js',
      '!**/routing.js',
      '!**/lazy-routes.js',
      '!**/routes.js',
      '!**/*.map',
      '!**/jspm_packages/**/*'
    ])
    // .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify(
      {mangle: false}
    ).on('error', gulpUtil.log))
    // .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.distClient))
});

// gulp.task('release', function(callback) {
//   return runSequence(
//     ['bundle', 'cache-bust'],
//     'minify',
//     callback
//   );
// });

gulp.task('lint-ui', function() {
  var settings = { fail: argv.production ? true : false };
  return gulp.src(path.jsSrc)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, settings));
});

gulp.task('serve', ['api'], function (done) {
  browserSync(browserSyncConfig, done);
});

gulp.task('lint-api', function () {
  var settings = { fail: argv.production ? true : false };
  return gulp.src([apiPath.source, '!server/public/docs/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish, settings));
});

gulp.task('api', function () {
  // check for --debug || --debug-brk flag, if present, run node debugger
  var debugArg = argv.debug ? '--debug=5858' : argv['debug-brk'] ? '--debug=5858 --debug-brk' : '';

  nodemon({
      script: 'server/app.js',
      ext: 'js',
      ignore: ['client/**','node_modules/**'],
      nodeArgs: [ '--harmony', debugArg ]
    })
    .on('restart', function () {
      console.log('API server restarted ' + new Date());
    });
});

gulp.task('watch', function () {
  var standardWatchOptions = {
    usePolling: true
  }
  var clientJsHtml =  path.jsSrc.concat( path.html );
  watch(clientJsHtml, standardWatchOptions, function (file) {
    console.log( file.event + ' in ' + file.relative + ', re-compiling main assets...');
    gulp.start(['lint-ui','compile-other']);
  });
  watch([path.less], standardWatchOptions, function (file) {
    console.log( file.event + ' in ' + file.relative + ', re-compiling LESS...');
    gulp.start(['compile-less']);
  });
  watch([path.ymlSrc], standardWatchOptions, function (file) {
    console.log( file.event + ' in ' + file.relative + ', re-compiling YAML...');
    gulp.start(['yaml','timestamp']);
  });
  watch([apiPath.source], standardWatchOptions, function (file) {
    console.log( file.event + ' in ' + file.relative + ', linting API files');
    gulp.start(['lint-api']);
  });
  // watch(['./package.json'], standardWatchOptions, function (file) {
  //   console.log('package.json changed. Rebuilding systemjs config for jspm dependency changes');
  //   gulp.start('bundle');
  // })
});

gulp.task('bundle', ['compile-production'], function () {

  // only bundle routes in production context
  if ( ! argv.production ) return;

  var routes = require('./client/src/app/routes.json');
  // get the source paths of our routes
  routes = routes.map(function (r) { return r.src; });

  var config = {
    baseURL: path.distClient,
    main: 'app/app',
    routes: routes,
    bundleThreshold: 0.6,
    config: path.systemJsConfig,
    sourceMaps: true,
    minify: true,
    mangle: true,
    dest: path.distClient + '/app',
    destJs: path.distClient + '/app/app.js'
  }

  return routeBundler.build(config);
});

gulp.task('run', function (callback) {
  tasks = ['lint-api','lint-ui'];
  // only run `build` in production context
  if ( argv.production ) {
    tasks.push('bundle');
  } else {
    tasks.push('recompile')
  }
  tasks.push('watch','serve');

  // start node debugger task if --debug || --debug-brk
  if ( argv.debug || argv['debug-brk'] ) {
    tasks.push('debug');
  }

  // call apply to pass the array as a chain of params
  return runSequence.apply(null, tasks);

});

gulp.task('noop', function(callback) {
  console.log("noop");
});

gulp.task('default', ['run']);
