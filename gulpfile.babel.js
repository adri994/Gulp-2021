const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const postcss    = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const webp = require('gulp-webp');
const babel = require('gulp-babel');
import { init as server, stream, reload } from 'browser-sync';

const paths = {
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    imagenes: 'src/img/**/*'
}

gulp.task('html-min', () => {
  return gulp
    .src('./src/*.html')
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(gulp.dest('./public'));
});

gulp.task('sass', () => {
    return gulp
      .src(paths.scss)
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(postcss([autoprefixer(), cssnano()]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css'))
      .pipe(stream());
  });


gulp.task('babel', () => {
    return gulp
      .src(paths.js)
      .pipe(sourcemaps.init())
      .pipe(concat('scripts.js'))
      .pipe(babel({
        presets: ["@babel/preset-env"]
      }))
      .pipe(terser())
      .pipe(sourcemaps.write('.'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest('./public/js'));
  });



gulp.task('imgmin', () => {
    return gulp
      .src(paths.imagenes)
      .pipe(cache(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.mozjpeg({ quality: 30, progressive: true }),
          imagemin.optipng({ optimizationLevel: 1 })
        ])
      ))
      .pipe(gulp.dest('./public/assets'));
  });

  gulp.task('webp', () => {
    return gulp
      .src(paths.imagenes)
      .pipe( webp() )
      .pipe(gulp.dest('./public/assets'));
  });


gulp.task('default', () => {
    server({
      server: './public'
    });
    gulp.watch('./src/*.html', gulp.series('html-min')).on('change', reload)
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/js/**/*.js', gulp.series('babel')).on('change', reload);

  });