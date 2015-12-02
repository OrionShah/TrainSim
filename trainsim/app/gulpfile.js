var gulp = require('gulp');
var builder = require('nw-builder');

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
	var nw = new builder({
		version: 'v0.12.3',
	    files: './**/**', // use the glob format
	    platforms: ['win64'],
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