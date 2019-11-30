// Watches files for changes and runs tasks based on the changed files
module.exports = {
  gruntfile: {
    files: ['Gruntfile.js']
  },
  js: {
    files: ['<%= paths.app %>/**/*.js'],
    tasks: [],
    options: {
      livereload: '<%= connect.options.livereload %>'
    }
  },
  livereload: {
    options: {
      livereload: '<%= connect.options.livereload %>'
    },
    files: [
      '.tmp/styles/{,*/}*.css',
      '<%= paths.app %>/**/*.html',
      '<%= paths.app %>/images/**/*'
    ]
  }
};
