// Reads HTML for usemin blocks to enable smart builds that automatically
// concat, minify and revision files. Creates configurations in memory so
// additional tasks can operate on them
module.exports = {
  html: ['<%= paths.app %>/index.html'],
  options: {
    dest: '<%= paths.dist %>',
    flow: {
      html: {
        steps: {
          js: ['concat', 'uglify'],
        },
        post: {}
      }
    }
  }
};
