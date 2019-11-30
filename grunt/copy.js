// Copies remaining files to places other tasks can use
module.exports = {
  dist: {
    files: [{
      expand: true,
      dot: true,
      cwd: '<%= paths.app %>',
      dest: '<%= paths.dist %>',
      src: [
        '*.{ico,png,txt,xml,json}',
        '*.html',
        '*.js',
        'assets/**/*'
      ]
    }, {
      expand: true,
      cwd: '.tmp/images',
      dest: '<%= paths.dist %>/images',
      src: ['generated/*']
    }, {
      expand: true,
      cwd: '<%= paths.app %>',
      dest: '<%= paths.dist %>',
      src: ['src/**/*.html']
    }, {
      expand: true,
      cwd: '<%= paths.app %>/styles',
      dest: '<%= paths.dist %>/styles',
      src: '*.css'
    }]
  }
};
