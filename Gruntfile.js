module.exports = function(grunt) {
  grunt.initConfig({
      jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        node: true,
        globals: {
          jQuery: true,
          window: true,
        }
      },
    gruntfile: {
        src: 'Gruntfile.js'
    },
    lib_test: {
        tasks: ['jshint:lib_test', 'nodeunit']
    }
      },
    nodeunit: {
        files: ['tests/**/*_test.js'],
        options: {
            reporter : 'default'
        }
    },
    concat: {
        options: {
            separator: ';',
        },
        dist: {
            src: ['src/bigHeader.js','lib/jslint.js','lib/parse-js.js', 'src/wordMatcher.js', 'src/javaScirpt-main.js', 'src/inlineScriptRunner.js'],
            dest: 'javascirpt.js',
        },
    }
      
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

  grunt.loadNpmTasks('grunt-contrib-concat');
};
