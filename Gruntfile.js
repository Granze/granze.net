module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      pureCss: {
        src: [
          'public/components/pure/src/grids/css/grids-core.css',
          'public/components/pure/src/grids/css/grids-r.css',
          'public/components/pure/src/grids/css/grids-units.css'
        ],
        dest: 'public/sass/_pure.scss'
      }
    },
    nodemon: {
      dev: {}
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          force: true
        }
      }
    },
    watch: {
      scss: {
        files: ['**/*.scss'],
        tasks: ['compass']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['**/*.hbs','**/*.scss']
      }
    },
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['concat', 'concurrent:target']);
};
