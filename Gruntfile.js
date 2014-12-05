module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        qunit: {
          all: ['test/*.html']
        },

        jshint: {
            options: {
                jshintrc: './.jshintrc'
            },
            all: ['./Gruntfile.js', './src/iframeMessenger.js']
        }


    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['jshint', 'qunit']);
};
