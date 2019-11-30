// The actual grunt server settings
var serveStatic = require('serve-static');

// used for HTML5mode urls in Angular
var modRewrite = require('connect-modrewrite');

module.exports = {
  options: {
    port: 9001,
    hostname: '127.0.0.1',
    livereload: 35730
  },
  livereload: {
    options: {
      open: true,
      middleware: function (connect) {
        return [
          modRewrite(['^[^\\.]*$ /index.html [L]']),
          serveStatic('.tmp'),
          connect().use(
            '/node_modules',
            serveStatic('./node_modules')
          ),
          connect().use(
            '/app/styles',
            serveStatic('./app/styles')
          ),
          serveStatic('app')
        ];
      }
    }
  },
  dist: {
    options: {
      open: true,
      base: '<%= paths.dist %>'
    }
  }
};
