module.exports = {
  dist: {
    options: {
      conservativeCollapse: true,
      keepClosingSlash : true,
      removeComments: true,
      collapseWhitespace: true,
      removeEmptyAttributes: false,
      removeCommentsFromCDATA: false,
      removeRedundantAttributes: false,
      collapseBooleanAttributes: false
    },
    files: [{
      expand: true,
      cwd: '<%= paths.dist %>',
      src: ['*.html', 'src/**/*.html'],
      dest: '<%= paths.dist %>'
    }]
  }
};
