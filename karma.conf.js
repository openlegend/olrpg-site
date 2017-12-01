// Karma configuration

module.exports = function(config) {
  config.set({

    action: 'run',

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // list of files / patterns to load in the browser
    files: [],

    jspm: {
      config: 'client/dist/system.config.js',
      loadFiles: ['client/dist/**/*.spec.js'],
      serveFiles: [
        'client/dist/**/*.js',
        'client/dist/**/*.css',
        'client/dist/**/*.json',
        'node_modules/chai/**/*.js'
      ]
    },

    proxies: {
      '/base/app/':                '/base/client/dist/app/',
      '/base/common/':             '/base/client/dist/common/',
      '/base/jspm_packages/':      '/base/client/jspm_packages/',
      '/base/dist/':               '/base/client/dist/',
      '/base/dist/test/':          '/base/client/dist/test/',
      '/base/dist/node_modules/':  '/base/node_modules/'
    },

    // list of files to exclude
    exclude: [],

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/**/*.js': ['coverage']
      //'client/**/*.js': ['babel']
    },

    /*'babelPreprocessor': {
      options: {
        sourceMap: 'inline',
        modules: 'system',
        moduleIds: false
      }
    }*/

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
