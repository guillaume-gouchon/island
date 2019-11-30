'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  require('load-grunt-config')(grunt, {
    data: {
      paths: {
        app:        'app',
        dist:       'build'
      }
    }
  });

};
