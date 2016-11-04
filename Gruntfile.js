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

        browserify: {
            vendor: {

            },
            client: {
                src: [
                    'main.js'
                ],
                dest: 'bundle.js'
            },
        },

 
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-browserify');

    // Default task(s).
    grunt.registerTask('default', ['wiredep', 'browserify']);
};
