// Empties folders to start fresh
module.exports = {
  dist: {
    files: [{
      dot: true,
      src: [
        '.tmp',
        '<%= paths.dist %>/{,*/}*',
      ]
    }]
  },
  server: '.tmp'
};
