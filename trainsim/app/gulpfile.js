var gulp = require('gulp');
var builder = require('nw-builder');
var del = require('del');

// gulp.task('nw', function() {
//   // return gulp.src(['./app/**/*', './node_modules/**/*'])
//   return gulp.src(['./**/*'])
//     .pipe(builder({
//         version: 'v0.12.3',
//         platforms: ['win64'],
//         buildDir: '../build'
//      }));
// });

gulp.task('nw', function () {
	var src_path = [
		'./*',
		'!./gulpfile.js',
		'./scripts/*',
		'./src/*',
		'./styles/*',
		'./views/*',
		'./node_modules/jquery/**',
		'./node_modules/underscore/*',
		'./node_modules/backbone/*',
		'./node_modules/konva/*'
	];
	var nw = new builder({
		version: 'v0.12.3',
	    files: src_path,
	    platforms: ['linux64'],
	    cacheDir: '../cache',
	    buildDir: '../build'
	});

	//Log stuff you want

	nw.on('log',  console.log);

	// Build returns a promise
	nw.build().then(function () {
	   console.log('all done!');
	}).catch(function (error) {
	    console.error(error);
	});
});

gulp.task('clean', function() {
	del('../build', {force: true})
});

gulp.task('default', ['nw']);