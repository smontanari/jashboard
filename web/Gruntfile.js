module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      dist: {
        src: [
          'jashboard/modules.js',
          'jashboard/plugins.js',
          'jashboard/**/*.js',
          '!jashboard/*loader.js',
          '!jashboard/**/*_plugin.js'
        ],
        dest: 'build/jashboard.js'
      }
    },
    uglify: {
      options: {},
      dist: {
        files: {
          'build/jashboard.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jasmine: {
      src: [
        'jashboard/modules.js',
        'jashboard/jashboardUtils.js',
        'jashboard/routes.js',
        'jashboard/*/**/*.js',
        '!jashboard/**/*_plugin.js'
      ],
      options: {
        specs: [
          'test/spec/**/*Spec.js',
          '!test/spec/SpecHelper.js'
        ],
        helpers: 'test/spec/SpecHelper.js',
        keepRunner: true,
        vendor: [
          './bower_components/underscore/underscore-min.js',
          './bower_components/moment/min/moment.min.js',
          './lib/sinon-1.7.3.js'
        ]
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        '<%= concat.dist.src %>'
      ],
      options: {
        globals: {
          console: true,
          module: true
        }
      }
    },
    less: {
      'build/jashboard.min.css': 'css/jashboard.less',
      options: {
        cleancss: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['jasmine']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'concat', 'uglify', 'less']);
};