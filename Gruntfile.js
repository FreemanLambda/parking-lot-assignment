module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    wiredep: {
      task: {
        src: [
          'index.html'   // .html support...
        ],
        options: {

        }
      }
    },

  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-wiredep');

  // Default task(s).
  grunt.registerTask('default', ['wiredep']);
};
