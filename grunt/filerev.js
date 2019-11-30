// Renames files for browser caching purposes
module.exports = {
  assets: {
    src: [
      '<%= paths.dist %>/styles/*.css',
      '<%= paths.dist %>/images/*.{png,jpg,jpeg,gif,webp,svg}',
    ],
  },
  js: {
    src: [
      '<%= paths.dist %>/js/*.js',
    ],
  },
};
