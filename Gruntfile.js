module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        qunit: {
            options: {
                '--web-security': false
            },
          all: ['test/*.html', '!test/livepages.html'],
          live: ['test/livepages.html']
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

    grunt.registerTask('test', ['jshint', 'qunit:all']);
};
