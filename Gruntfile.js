module.exports = function(grunt) {

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
    compass: { //compile scss to css
      dist: {
        options: {
          config: 'config.rb',
          force: true
        }
      }
    },
    watch: {
      css: {
        files: '**/*.scss',
        tasks: ['compass'],
        options: {
          livereload: true
        }
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

  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');

  grunt.registerTask('default', ['concat', 'concurrent:target']);
};