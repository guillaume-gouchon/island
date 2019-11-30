// Add vendor prefixed styles
module.exports = {
  options: {
    browsers: ['last 2 versions', 'ie 9']
  },
  server: {
    options: {
      map: true,
    },
    files: [{
      expand: true,
      cwd: '.tmp/styles/',
      src: '*.css',
      dest: '.tmp/styles/'
    }]
  },
  dist: {
    files: [{
      expand: true,
      cwd: '.tmp/styles/',
      src: '*.css',
      dest: '.tmp/styles/'
    }]
  }
};
