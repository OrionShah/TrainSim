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
    nodewebkit: {
      options: {
        version: 'v0.12.0',
        platforms: ['linux64'],
        // platforms: ['win', 'osx', 'linux32', 'linux64'], // Платформы, под которые будет строиться наше приложение
        buildDir: './build', // Путь, по которому будет располагаться построенное приложение
      },
      src: './app/**/*' // Путь, по которому располагаются исходные коды приложения
    },
    nwjs: {
      options: {
        version: 'v0.12.0',
        platforms: ['linux64'],
        buildDir: './build', // Where the build version of my NW.js app is saved
      },
      src: ['./app/**/*'] // Your NW.js app
    },

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.loadNpmTasks('grunt-nw-builder');
  grunt.registerTask('default', ['watch']);
};