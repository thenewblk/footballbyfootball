// gulpfile.js
// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint'),
		sass = require('gulp-sass'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		rename = require('gulp-rename'),
		nodemon = require('gulp-nodemon'),
        browserify = require('browserify'),
        reactify = require('reactify'),
        source = require('vinyl-source-stream');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('sass/css/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('assets/css'));
});

// // Compile Our React Stuff
// gulp.task('react-column', function() {
//     // Browserify/bundle the JS.
//     browserify('./assets/js/column-editor/_col_source/column-edit.js')
//         .transform(reactify)
//         .bundle()
//         .pipe(source('column-edit.compiled.js'))
//         .pipe(gulp.dest('assets/js/column-editor/'));
// });

// // Compile Our React Stuff
// gulp.task('react-lock', function() {
//     // Browserify/bundle the JS.
//     browserify('./assets/js/column-editor/_lock_source/lockerroom-edit.js')
//         .transform(reactify)
//         .bundle()
//         .pipe(source('lockerroom-edit.compiled.js'))
//         .pipe(gulp.dest('assets/js/column-editor/'));
// });
// // Compile Our React Stuff
// gulp.task('react-player', function() {
//     // Browserify/bundle the JS.
//     browserify('./assets/js/player-editor/player-edit.js')
//         .transform(reactify)
//         .bundle()
//         .pipe(source('player-edit.compiled.js'))
//         .pipe(gulp.dest('assets/js/player-editor/'));
// });
// Concatenate & Minify JS
// gulp.task('scripts', function() {
//     return gulp.src('js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('dist'));
// });

// Watch Files For Changes
gulp.task('watch', function() {
//     gulp.watch('./assets/js/column-editor/_col_source/*.*', ['react-column']);
//     gulp.watch('./assets/js/column-editor/_lock_source/*.*', ['react-lock']);
//     gulp.watch('./assets/js/player-editor/_source/*.*', ['react-player']);
    gulp.watch('sass/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  nodemon({ script: 'server.js', ext: 'html', ignore: ['ignored.js'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['sass', 'watch', 'develop']);