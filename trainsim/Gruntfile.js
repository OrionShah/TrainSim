module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      node: {
        files: ['app/**/*'],
        tasks: ['nwjs'],
        options: {
          spawn: true,
        }
      }
    },
    nwjs: {
      options: {
        version: 'v0.12.0',
        platforms: ['linux64', 'win64'],
        buildDir: './build', // Where the build version of my NW.js app is saved
      },
      src: ['./app/**/*'] // Your NW.js app
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['watch']);
};