module.exports = function(grunt) {
  grunt.initConfig({
    clean: ["app/jashboard*"],
    concat: {
      dist: {
        src: [
          'jashboard/modules.js',
          'jashboard/plugins.js',
          'jashboard/**/*.js',
          '!jashboard/*loader.js',
          '!jashboard/**/*_plugin.js'
        ],
        dest: 'app/jashboard.js'
      }
    },
    uglify: {
      options: {},
      dist: {
        files: {
          'app/jashboard.min.js': ['<%= concat.dist.dest %>']
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
          'test/spec/**/*Spec.js'
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
      'app/jashboard.min.css': 'css/jashboard.less',
      options: {
        cleancss: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['jasmine']);
  grunt.registerTask('build', ['clean', 'jshint', 'jasmine', 'concat', 'uglify', 'less']);
};