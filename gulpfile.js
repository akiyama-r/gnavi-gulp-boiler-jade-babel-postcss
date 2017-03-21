/**
 * gulp-boiler
 *
 * ** 開発開始手順
 *
 * $ npm i
 * $ gulp sprite
 * $ gulp iamgemin
 *
 *
 * ** 開発開始 with watchコマンド
 *
 * $ gulp start
 *
 * ** buildコマンド
 *
 * $ gulp
 *
 * ** spriteコマンド
 *
 * $ gulp sprite
 *
 * ** iamgeminコマンド
 *
 * $ gulp iamgemin
 *
 * ** js testコマンド
 *
 * $ gulp test
 *
 * ** dist、tmp削除コマンド
 *
 * $ gulp clean
 *
 * ---------------------------------------------------------------------- */

/*
 * init package
 */
let gulp = require('gulp');
var runSequence = require('run-sequence');
let plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var browserSync = require('browser-sync');
let rename = require('gulp-rename');
let size = require('gulp-size');
let postcss = require('gulp-postcss');
var data = require('gulp-data');
let moment = require('momentjs');
//let timestump = moment().format('YYYYMMDDhhmmss');
let timestump = '20161012113446';
let version = require('./version.json');


/*
 * task manage
 */
// build:css
gulp.task('build:css', function () {
  runSequence('precss', 'renamecss', 'postcss');
});

// build:js
gulp.task('build:js', function () {
  runSequence('babel', 'concat', 'test');
});

// build:js lib
gulp.task('concat', function () {
  runSequence('concat:lib');
});

// build:html
gulp.task('build:html', function () {
  runSequence('jade');
});

// build:copy
gulp.task('build:copy', function () {
  runSequence('copy');
});

// imagemin
gulp.task('imagemin', function () {
  runSequence('imageMin');
});

// test
gulp.task('test', function () {
  runSequence('eslint');
});

// build
gulp.task('build', function () {
  return runSequence(
    'build:css', 'build:js', 'build:html', 'build:copy'
  );
});

// default
gulp.task('default', function () {
  runSequence('build');
});


/*
 * option task
 */
// start
gulp.task('start', function () {
  return runSequence(
    'build', 'watch', 'serve'
  );
});

// local
gulp.task('local', function () {
  runSequence('build');
});

// dev
gulp.task('dev', function () {
  runSequence('build');
});


/*
 * path
 */
const path = {
  src: 'src/',
  dist: 'dist/',
  tmp: 'tmp/',
  html_src: 'src/jade/',
  css_src: 'src/css/',
  styleguide_src: 'src/styleguide/',
  js_src: 'src/js/',
  img_src: 'src/img/',
  sprite_src: 'src/sprite/'
};


/*
 * stat path
 */
const pathStat = {
  local: './',
  test_x: 'http://hoge/'
};


/*
 * js parts
 */
const js_part = {
  lib: [
    path.js_src + 'lib/jquery-3.2.0.min.js',
    path.js_src + 'lib/lodash.min.js'
  ],
  common: [
    path.js_src + 'common/utility.js',
    path.js_src + 'common/ajax.js',
    path.js_src + 'common/ui.js'
  ]
};


/*
 * BrowserSync
 */
gulp.task('serve', function () {
  var syncOption = {
    port: 8051,
    ui: {
      port: 8052
    },
    server: {
      baseDir: path.dist
    }
  };
  browserSync(syncOption);
});


/*
 * watch
 */
gulp.task('watch', function () {
  console.log('---------- watch ----------');
  return (function(){
    gulp.watch(path.css_src + '**/*.css', ['build:css']).on('change', browserSync.reload);
    gulp.watch(path.js_src + '**/*.js', ['build:js']).on('change', browserSync.reload);
    gulp.watch(path.html_src + '**/*.{jade,json}', ['build:html']).on('change', browserSync.reload);
    gulp.watch(path.img_src + '**/*.{png,jpg}', ['build:copy']).on('change', browserSync.reload);
    gulp.watch('gulpfile.js', ['build']).on('change', browserSync.reload);
  })();
});


/*
 * clean
 */
let clean = require('del');
gulp.task('clean', function () {
  console.log('---------- clean ----------');
  clean(path.tmp);
  clean(path.dist);
  clean(path.tmp_dev);
});


/*
 * sprite
 */
let spritesmith = require('gulp.spritesmith');
gulp.task('sprite', function () {
  console.log('---------- sprite ----------');
  let spriteData = gulp.src(path.sprite_src + 'sprite-icon/*.png')
  .pipe(spritesmith({
    imgName: 'sprite-icon.png',
    cssName: 'sprite-icon.css',
    imgPath: '../img/sprite-icon.png',
    cssFormat: 'css',
    padding: 5,
    cssOpts: {
    cssSelector: function (sprite) {
      return '.icon--' + sprite.name;
    }
  }
  }));
  spriteData.img.pipe(gulp.dest(path.img_src));
  spriteData.css.pipe(gulp.dest(path.css_src + 'common/module/'))
    .pipe(size({title:'size : sprite'}));
});


/*
 * imageMin
 */
let imagemin = require('gulp-imagemin');
gulp.task('imageMin', function() {
  console.log('---------- imageMin ----------');
  return gulp.src(path.img_src + '**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(path.img_src));
});


/*
 * postcss
 */
// precss(scss like)
let precss = require('precss');
gulp.task('precss', function () {
  console.log('---------- css ----------');
  return gulp.src(path.css_src + '**/*.css')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(postcss([
        precss()
    ]))
    .pipe(gulp.dest(path.tmp + 'css/'));
});

// rename
gulp.task('renamecss', function () {
  return gulp.src(path.tmp + 'css/common/import.css')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(rename('common-' + version.css.common + '.css'))
    .pipe(gulp.dest(path.tmp + 'css/'));
});

// postcss
let autoprefixer = require('autoprefixer');
let cssnano = require('cssnano');
gulp.task('postcss', function () {
  return gulp.src(path.tmp + 'css/*.css')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(postcss([
      autoprefixer ({
        browsers: ['last 2 version', 'ie >= 9'],
        cascade: false
       }),
      cssnano({
        minifyFontValues: {
          removeQuotes: false
        }
      })
    ]))
    .pipe(gulp.dest(path.dist + 'css/'))
    .pipe(size({title:'size : css'}));
});


/*
 * kss styleguide
 */
let kss = require('gulp-kss');
gulp.task('styleguide', function () {
  return gulp.src(path.tmp + 'css/common.css')
    .pipe(kss({
      overview: path.styleguide_src + 'styleguide.md'
    }))
    .pipe(gulp.dest(path.dist + 'styleguide/'));
});


/*
 * js
 */
// es2015
let babel = require('gulp-babel');
let concat = require('gulp-concat-util');
let minify = require('gulp-babel-minify');
let uglify = require('gulp-uglify');

// babel
gulp.task('babel', function () {
  console.log('---------- js ----------');
  return gulp.src(js_part.common)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(concat('common-' + version.js.common + '.js'))
    .pipe(concat.header([
      '(function(window, $){',
      "  'use strict';",
      ''
    ].join('\n')))
    .pipe(concat.footer([
      '',
      '})(window, window.jQuery);'
    ].join('\n')))
    .pipe(gulp.dest(path.tmp + 'js/'))
    .pipe(babel({
      filename: 'common-' + version.js.common + '.js',
      presets: [["es2015", {"loose": true}]],
      compact: true,
      minified: true,
      comments: false
    }))
    .pipe(uglify())
    .pipe(gulp.dest(path.dist + 'js/'))
    .pipe(size({title:'size : js common'}));
});

// concat
// lib
gulp.task('concat:lib', function () {
  return gulp.src(js_part.lib)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(concat('lib-' + version.js.lib + '.js'))
    .pipe(gulp.dest(path.dist + 'js/'))
    .pipe(size({title:'size : js lib'}));
});


/*
 * js test
 */
// eslint
let eslint = require('gulp-eslint');
gulp.task('eslint', function () {
  return gulp.src(path.tmp + 'js/common.js')
    .pipe(eslint('eslint-config-gnavi'));
});


/*
 * html
 */
// jade
let jade = require('gulp-jade');
gulp.task('jade', function() {
  console.log('---------- html ----------');
  gulp.src(
      [
        path.html_src + 'html/**/*.jade',
        '!' + path.html_src + 'html/include/**/*.jade'
      ]
    )
    .pipe(data(function (file) {
      return {
        config: require('./' + path.html_src + 'data/common/config.json'),
        nav: require('./' + path.html_src + 'data/common/nav.json'),
        sample: require('./' + path.html_src + 'data/module/sample.json'),
        version: require('./version.json'),
        timestump: timestump,
        pathStat: pathStat.local
      };
    }))
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(jade(
      {
        pretty: true
      }
    ))
    .pipe(gulp.dest(path.dist + '/'))
    .pipe(size({title:'size : html'}));
});


/*
 * copy
 */
gulp.task('copy', function () {
  console.log('---------- copy ----------');
  return gulp.src(
    [
      path.img_src + '**/*'
    ],
    {base: path.src}
  )
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>')
  }))
  .pipe(gulp.dest(path.dist));
});


