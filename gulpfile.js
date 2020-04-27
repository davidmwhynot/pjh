const gulp = require('gulp');
const minify = require('gulp-minify');
const rename = require('gulp-rename');

gulp.task('build', () =>
	gulp
		.src('./pjh.js')
		.pipe(
			minify({
				noSource: true,
				mangle: false,
				ext: {
					min: '.js'
				}
			})
		)
		.pipe(rename('index.js'))
		.pipe(gulp.dest('./'))
);
