// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/jquery/jquery.js',
      'app/bower_components/angular/angular.js',
      /* Plugins.js */
      'app/bower_components/modernizr/modernizr.js',
      'app/bower_components/underscore/underscore-min.js',
      'app/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
      'app/bower_components/jquery-ui/ui/jquery-ui.js',
      'app/scripts/libs/jquery-ui/jquery.event.drag-2.2.js',
      'app/scripts/libs/jquery-ui/jquery.event.drop-2.2.js',

      'app/bower_components/jquery-bridget/jquery.bridget.js',
      'app/bower_components/get-style-property/get-style-property.js',
      'app/bower_components/get-size/get-size.js',
      'app/bower_components/eventEmitter/EventEmitter.js',
      'app/bower_components/eventie/eventie.js',
      'app/bower_components/doc-ready/doc-ready.js',
      'app/bower_components/matches-selector/matches-selector.js',
      'app/bower_components/outlayer/item.js',
      'app/bower_components/outlayer/outlayer.js',
      'app/bower_components/masonry/masonry.js',
      'app/bower_components/imagesloaded/imagesloaded.js',
      'app/bower_components/angular-masonry/angular-masonry.js',

      /* Modules.js */
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-animate/angular-animate.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'test/libs/**/*.js',
      //'node_modules/socket.io/node_modules/socket.io-client/dist/socket.io.js',
      'app/scripts/app.js',
      'app/scripts/services/index.js',
      'app/scripts/controllers/index.js',
      'app/scripts/directives/index.js',
      'app/scripts/factories/index.js',
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/unit/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    // For the code coverage
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/scripts/!(libs)/**/*.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
      file : 'lcov.info'
    }
  });
};
