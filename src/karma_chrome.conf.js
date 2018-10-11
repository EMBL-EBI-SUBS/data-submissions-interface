// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// Configuration use for test

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: [
      'jasmine',
      '@angular-devkit/build-angular'
    ],
    plugins: [
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'karma-chrome-launcher',
      '@angular-devkit/build-angular/plugins/karma'
    ],
    files: [],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    angularCli: {
      environment: 'prod'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
