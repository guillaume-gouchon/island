// Performs rewrites based on filerev and the useminPrepare configuration
module.exports = {
  html: [
    '<%= paths.dist %>/**/*.html',
  ],
  css: [
    '<%= paths.dist %>/styles/*.css',
  ],
  options: {
    assetsDirs: [
      '<%= paths.dist %>',
      '<%= paths.dist %>/images',
      '<%= paths.dist %>/styles'
    ]
  }
};
